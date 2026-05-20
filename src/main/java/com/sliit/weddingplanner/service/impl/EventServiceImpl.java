package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.EventDTO;
import com.sliit.weddingplanner.dto.CompanyFinanceDTO;
import com.sliit.weddingplanner.exception.ResourceNotFoundException;
import com.sliit.weddingplanner.repository.*;
import com.sliit.weddingplanner.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final BookingPackageRepository bookingPackageRepository;
    private final PaymentRepository paymentRepository;
    private final CompanyFinanceRepository companyFinanceRepository;

    @Autowired
    public EventServiceImpl(EventRepository eventRepository,
                            BookingRepository bookingRepository,
                            BookingPackageRepository bookingPackageRepository,
                            PaymentRepository paymentRepository,
                            CompanyFinanceRepository companyFinanceRepository) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
        this.bookingPackageRepository = bookingPackageRepository;
        this.paymentRepository = paymentRepository;
        this.companyFinanceRepository = companyFinanceRepository;
    }

    @Override
    public EventDTO create(EventDTO dto) {
        return eventRepository.save(dto);
    }

    @Override
    public EventDTO getById(int id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + id));
    }

    @Override
    public List<EventDTO> getAll() {
        return eventRepository.findAll();
    }

    @Override
    public EventDTO update(int id, EventDTO dto) {
        EventDTO existing = getById(id);
        existing.setEventName(dto.getEventName());
        existing.setEventDate(dto.getEventDate());
        existing.setLocation(dto.getLocation());
        existing.setDescription(dto.getDescription());
        existing.setStatus(dto.getStatus());
        existing.setEventRating(dto.getEventRating());
        existing.setEventReview(dto.getEventReview());
        return eventRepository.update(existing);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void delete(int id) {
        getById(id); // Check existence

        // 1. Soft delete the event
        eventRepository.delete(id);
        System.out.println("DEBUG: Event #" + id + " status set to DELETED");

        // 2. Find any bookings associated with this event
        List<com.sliit.weddingplanner.dto.BookingDTO> bookings = bookingRepository.findAll();
        for (com.sliit.weddingplanner.dto.BookingDTO booking : bookings) {
            if (booking.getEventId() == id) {
                int bookingId = booking.getBookingId();
                System.out.println("DEBUG: Found Booking #" + bookingId + " for Event #" + id);

                // Update booking status to DELETED
                bookingRepository.updateStatus(bookingId, "DELETED");
                System.out.println("DEBUG: Booking #" + bookingId + " status updated to DELETED");

                // Update booking packages status to REJECTED to release the packages (relevent package convert to REJECTED)
                List<com.sliit.weddingplanner.dto.BookingPackageDTO> bpList = bookingPackageRepository.findAllByBookingId(bookingId);
                for (com.sliit.weddingplanner.dto.BookingPackageDTO bp : bpList) {
                    bookingPackageRepository.updateVendorStatus(bp.getBookingPackageId(), "REJECTED", "Event cancelled/deleted");
                    System.out.println("DEBUG: Booking Package #" + bp.getBookingPackageId() + " status updated to REJECTED");
                }

                // 3. Find payment associated with this booking
                paymentRepository.findByBookingId(bookingId).ifPresent(payment -> {
                    // Change payment status to REFUNDED
                    paymentRepository.updateStatus(payment.getPaymentId(), "REFUNDED");
                    System.out.println("DEBUG: Payment #" + payment.getPaymentId() + " status updated to REFUNDED");

                    // 4. Update/insert in company_finance table
                    com.sliit.weddingplanner.dto.CompanyFinanceDTO finance = new com.sliit.weddingplanner.dto.CompanyFinanceDTO();
                    finance.setType("EXPENSE");
                    finance.setBookingId(bookingId);
                    finance.setPaymentId(payment.getPaymentId());
                    finance.setAmount(payment.getTotalAmount() != null ? payment.getTotalAmount() : java.math.BigDecimal.ZERO);
                    finance.setDescription("REFUND for Booking #" + bookingId);
                    finance.setPaymentMethod(payment.getPaymentType() != null ? payment.getPaymentType() : "ONLINE");

                    companyFinanceRepository.save(finance);
                    System.out.println("DEBUG: Refund logged in company_finance of amount: " + finance.getAmount());
                });
            }
        }
    }

    @Override
    public List<EventDTO> getEventsByCustomer(int customerId) {
        return eventRepository.findAllByCustomerId(customerId);
    }

    @Override
    public List<EventDTO> getPendingReviewsByCustomer(int customerId) {
        return eventRepository.findPendingReviewsByCustomerId(customerId);
    }

    @Override
    public void submitEventReview(int eventId, int rating, String review) {
        eventRepository.submitReview(eventId, rating, review);
    }
}
