package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.*;
import com.sliit.weddingplanner.exception.ResourceNotFoundException;
import com.sliit.weddingplanner.repository.*;
import com.sliit.weddingplanner.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final EventPackageRepository eventPackageRepository;
    private final BookingPackageRepository bookingPackageRepository;
    private final PaymentRepository paymentRepository;
    private final CompanyFinanceRepository companyFinanceRepository;

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository,
                              EventRepository eventRepository,
                              EventPackageRepository eventPackageRepository,
                              BookingPackageRepository bookingPackageRepository,
                              PaymentRepository paymentRepository,
                              CompanyFinanceRepository companyFinanceRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.eventPackageRepository = eventPackageRepository;
        this.bookingPackageRepository = bookingPackageRepository;
        this.paymentRepository = paymentRepository;
        this.companyFinanceRepository = companyFinanceRepository;
    }

    @Override
    public BookingDTO create(BookingDTO dto) {
        return bookingRepository.save(dto);
    }

    @Override
    public BookingDTO getById(int id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
    }

    @Override
    public List<BookingDTO> getAll() {
        List<BookingDTO> bookings = bookingRepository.findAll();
        for (BookingDTO b : bookings) {
            b.setPackages(bookingPackageRepository.findAllByBookingId(b.getBookingId()));
        }
        return bookings;
    }

    @Override
    public BookingDTO update(int id, BookingDTO dto) {
        BookingDTO existing = getById(id);
        existing.setEventId(dto.getEventId());
        existing.setCustomerId(dto.getCustomerId());
        existing.setBookingDate(dto.getBookingDate());
        existing.setLocation(dto.getLocation());
        existing.setStatus(dto.getStatus());
        return bookingRepository.update(existing);
    }

    @Override
    public void delete(int id) {
        getById(id); // Throws if not found
        bookingRepository.delete(id);
    }

    @Override
    public List<BookingDTO> getBookingsByCustomer(int customerId) {
        List<BookingDTO> bookings = bookingRepository.findAllByCustomerId(customerId);
        for (BookingDTO b : bookings) {
            List<BookingPackageDTO> pkgs = bookingPackageRepository.findAllByBookingId(b.getBookingId());
            System.out.println("DEBUG: Found " + pkgs.size() + " packages for Booking ID: " + b.getBookingId());
            b.setPackages(pkgs);
        }
        return bookings;
    }

    @Override
    @Transactional
    public void updateBookingStatus(int bookingId, String status) {
        bookingRepository.updateStatus(bookingId, status);

        if ("CANCELLED".equalsIgnoreCase(status)) {
            // 1. Cancel all packages under this booking to release dates
            List<BookingPackageDTO> packages = bookingPackageRepository.findAllByBookingId(bookingId);
            for (BookingPackageDTO bp : packages) {
                bookingPackageRepository.updateVendorStatus(bp.getBookingPackageId(), "CANCELLED", "Booking cancelled by customer");
            }

            // 2. Clear location if it had a venue package
            bookingRepository.findById(bookingId).ifPresent(booking -> {
                int eventId = booking.getEventId();
                eventRepository.findById(eventId).ifPresent(event -> {
                    event.setLocation(null);
                    eventRepository.update(event);
                });
                booking.setLocation(null);
                bookingRepository.update(booking);
            });

            // 3. Process full refund/adjust payment
            paymentRepository.findByBookingId(bookingId).ifPresent(payment -> {
                java.math.BigDecimal paidSoFar = payment.getAmount() != null ? payment.getAmount() : java.math.BigDecimal.ZERO;

                if (paidSoFar.compareTo(java.math.BigDecimal.ZERO) > 0) {
                    System.out.println("DEBUG: Cancelling booking #" + bookingId + ". Refunding full amount: " + paidSoFar);

                    try {
                        com.sliit.weddingplanner.dto.CompanyFinanceDTO finance = new com.sliit.weddingplanner.dto.CompanyFinanceDTO();
                        finance.setType("EXPENSE");
                        finance.setBookingId(bookingId);
                        finance.setPaymentId(payment.getPaymentId());
                        finance.setAmount(paidSoFar);
                        finance.setDescription("FULL REFUND: Booking #" + bookingId + " cancelled by customer");
                        finance.setPaymentMethod("ONLINE");
                        companyFinanceRepository.save(finance);
                    } catch (Exception ex) {
                        System.err.println("Error saving full refund in company finance: " + ex.getMessage());
                    }
                }

                payment.setTotalAmount(java.math.BigDecimal.ZERO);
                payment.setAmount(java.math.BigDecimal.ZERO);
                payment.setDueAmount(java.math.BigDecimal.ZERO);
                payment.setStatus("CANCELLED");
                paymentRepository.update(payment);
            });
        }
    }

    @Override
    @Transactional
    public BookingDTO confirmEvent(int eventId, String location, String paymentType) {
        // 1. Get Event
        EventDTO event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // 2. Update Event Status and Location
        event.setStatus("PENDING_APPROVAL");
        event.setLocation(location);
        eventRepository.update(event);

        // 3. Create or Get Booking
        BookingDTO booking = bookingRepository.findByEventId(eventId).orElse(null);
        java.util.Map<Integer, String> previousStatuses = new java.util.HashMap<>();
        if (booking == null) {
            booking = new BookingDTO();
            booking.setEventId(eventId);
            booking.setCustomerId(event.getCustomerId());
            booking.setBookingDate(event.getEventDate());
            booking.setLocation(location);
            booking.setStatus("PENDING");
            booking.setPaymentType(paymentType);
            booking.setCreatedAt(LocalDateTime.now());
            booking = bookingRepository.save(booking);
        } else {
            // Save the previous vendor statuses for all packages so we do not re-request them!
            List<BookingPackageDTO> existingPkgs = bookingPackageRepository.findAllByBookingId(booking.getBookingId());
            for (BookingPackageDTO bp : existingPkgs) {
                if (bp.getVendorStatus() != null) {
                    previousStatuses.put(bp.getEventPackageId(), bp.getVendorStatus());
                }
            }

            booking.setLocation(location);
            booking.setStatus("PENDING");
            booking.setPaymentType(paymentType);
            bookingRepository.update(booking);
            // Clear existing packages for re-selection sync
            bookingPackageRepository.deleteAllByBookingId(booking.getBookingId());
        }

        // 4. Create Booking Packages and calculate total cost
        BigDecimal totalCost = BigDecimal.ZERO;
        List<EventPackageDTO> eventPackages = eventPackageRepository.findAllByEventId(eventId);
        for (EventPackageDTO ep : eventPackages) {
            BigDecimal pkgPrice = ep.getPackagePrice() != null ? ep.getPackagePrice() : BigDecimal.ZERO;
            int qty = ep.getQuantity() != null ? ep.getQuantity() : 1;

            // Retain previous status or mark as PENDING if new
            String statusForPkg = previousStatuses.get(ep.getEventPackageId());
            if (statusForPkg == null) {
                statusForPkg = "PENDING";
            }

            // Exclude rejected packages from the total cost calculation
            if (!statusForPkg.equalsIgnoreCase("REJECTED")) {
                totalCost = totalCost.add(pkgPrice.multiply(BigDecimal.valueOf(qty)));
            }

            BookingPackageDTO bp = new BookingPackageDTO();
            bp.setBookingId(booking.getBookingId());
            bp.setEventPackageId(ep.getEventPackageId());
            bp.setQuantity(qty);
            bp.setPriceAtBooking(pkgPrice);
            bp.setVendorStatus(statusForPkg);
            bp.setNotes(ep.getNotes());
            bp.setCreatedAt(LocalDateTime.now());
            bookingPackageRepository.save(bp);
        }

        // Update booking with the calculated total cost
        booking.setTotalCost(totalCost.doubleValue());
        bookingRepository.update(booking);

        System.out.println("DEBUG: Booking #" + booking.getBookingId() + " updated with total " + totalCost);
        return booking;
    }

    @Override
    @Transactional
    public void customerConfirmBooking(int bookingId, String location) {
        BookingDTO booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus("CONFIRMED");
        booking.setLocation(location);
        bookingRepository.update(booking);

        EventDTO event = eventRepository.findById(booking.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus("CONFIRMED");
        event.setLocation(location);
        eventRepository.update(event);

        // Auto-generate/Update Payment
        try {
            PaymentDTO payment = paymentRepository.findByBookingId(bookingId).orElse(null);
            BigDecimal totalCostVal = BigDecimal.valueOf(booking.getTotalCost());
            if (payment == null) {
                payment = new PaymentDTO();
                payment.setBookingId(bookingId);
                payment.setTotalAmount(totalCostVal);
                payment.setAmount(BigDecimal.ZERO);
                payment.setDueAmount(totalCostVal);
                payment.setStatus("PENDING");
                payment.setPaymentType(booking.getPaymentType() != null ? booking.getPaymentType() : "FULL");
                paymentRepository.save(payment);
            } else {
                payment.setTotalAmount(totalCostVal);
                if ("PENDING".equalsIgnoreCase(payment.getStatus())) {
                    payment.setAmount(BigDecimal.ZERO);
                    payment.setDueAmount(totalCostVal);
                } else {
                    BigDecimal paidAmount = payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO;
                    payment.setAmount(paidAmount);
                    payment.setDueAmount(totalCostVal.subtract(paidAmount));
                }
                payment.setStatus("PENDING");
                paymentRepository.update(payment);
            }
        } catch (Exception ex) {
            System.err.println("ERROR: Failed to handle payment auto-generation/updating on customer confirmation: " + ex.getMessage());
        }
    }

    @Override
    public List<BookingPackageDTO> getBookingPackages(int bookingId) {
        return bookingPackageRepository.findAllByBookingId(bookingId);
    }

    @Override
    public List<BookingPackageDTO> getVendorBookings(int vendorId) {
        return bookingPackageRepository.findAllByVendorId(vendorId);
    }

    @Override
    @Transactional
    public void updateBookingPackageStatus(int id, String status, String reason) {
        System.out.println("DEBUG: Updating status for package ID: " + id + " to " + status);

        // 1. Update the individual package status
        bookingPackageRepository.updateVendorStatus(id, status, reason);

        // 2. Get the booking ID for this package
        int bookingId = bookingPackageRepository.getBookingIdByPackageId(id);
        System.out.println("DEBUG: Found booking ID: " + bookingId);
        if (bookingId <= 0) return;

        // Automatically update the location of the event and booking if it's a venue package
        bookingRepository.findById(bookingId).ifPresent(booking -> {
            int eventId = booking.getEventId();
            List<EventPackageDTO> eventPkgs = eventPackageRepository.findAllByEventId(eventId);
            List<BookingPackageDTO> allPkgs = bookingPackageRepository.findAllByBookingId(bookingId);
            BookingPackageDTO currentBP = allPkgs.stream()
                    .filter(bp -> bp.getBookingPackageId() == id)
                    .findFirst()
                    .orElse(null);

            if (currentBP != null) {
                EventPackageDTO currentEP = eventPkgs.stream()
                        .filter(ep -> ep.getEventPackageId() == currentBP.getEventPackageId())
                        .findFirst()
                        .orElse(null);

                if (currentEP != null && currentEP.getCategoryName() != null && currentEP.getCategoryName().toLowerCase().contains("venue")) {
                    if (status.equalsIgnoreCase("REJECTED") || status.equalsIgnoreCase("UNAVAILABLE")) {
                        System.out.println("DEBUG: Venue package rejected. Clearing event & booking location.");
                        eventRepository.findById(eventId).ifPresent(event -> {
                            event.setLocation(null);
                            eventRepository.update(event);
                        });
                        booking.setLocation(null);
                        bookingRepository.update(booking);
                    } else if (status.equalsIgnoreCase("APPROVED") || status.equalsIgnoreCase("CONFIRMED")) {
                        System.out.println("DEBUG: Venue package approved. Updating event & booking location to: " + currentEP.getPackageTitle());
                        eventRepository.findById(eventId).ifPresent(event -> {
                            event.setLocation(currentEP.getPackageTitle());
                            eventRepository.update(event);
                        });
                        booking.setLocation(currentEP.getPackageTitle());
                        bookingRepository.update(booking);
                    }
                }
            }
        });

        // Recalculate booking total cost excluding rejected packages
        bookingRepository.findById(bookingId).ifPresent(booking -> {
            double newTotalCost = 0.0;
            List<BookingPackageDTO> allPkgs = bookingPackageRepository.findAllByBookingId(bookingId);
            for (BookingPackageDTO p : allPkgs) {
                if (p.getVendorStatus() != null && !p.getVendorStatus().equalsIgnoreCase("REJECTED")) {
                    double pkgPrice = p.getPriceAtBooking() != null ? p.getPriceAtBooking().doubleValue() : 0.0;
                    int qty = p.getQuantity() != null ? p.getQuantity() : 1;
                    newTotalCost += pkgPrice * qty;
                }
            }
            booking.setTotalCost(newTotalCost);
            bookingRepository.update(booking);
            System.out.println("DEBUG: Recalculated booking total cost after status update to: " + newTotalCost);
        });

        // If package is REJECTED, update both booking and event status to REJECTED
        if (status.equalsIgnoreCase("REJECTED")) {
            System.out.println("DEBUG: Package rejected. Transitioning Booking #" + bookingId + " and Event to REJECTED");
            bookingRepository.updateStatus(bookingId, "REJECTED");
            bookingRepository.findById(bookingId).ifPresent(booking -> {
                eventRepository.findById(booking.getEventId()).ifPresent(event -> {
                    event.setStatus("REJECTED");
                    eventRepository.update(event);
                    System.out.println("DEBUG: Event #" + event.getEventId() + " status updated to REJECTED");
                });
            });
            return;
        }

        // All packages updated, no automated confirmation of booking or event
    }

}
