package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.PaymentDTO;
import com.sliit.weddingplanner.exception.ResourceNotFoundException;
import com.sliit.weddingplanner.repository.PaymentRepository;
import com.sliit.weddingplanner.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final com.sliit.weddingplanner.repository.CompanyFinanceRepository companyFinanceRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository, com.sliit.weddingplanner.repository.CompanyFinanceRepository companyFinanceRepository) {
        this.paymentRepository = paymentRepository;
        this.companyFinanceRepository = companyFinanceRepository;
    }

    @Override
    public PaymentDTO create(PaymentDTO dto) {
        return paymentRepository.save(dto);
    }

    @Override
    public PaymentDTO getById(int id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));
    }

    @Override
    public List<PaymentDTO> getAll() {
        return paymentRepository.findAll();
    }

    @Override
    public PaymentDTO update(int id, PaymentDTO dto) {
        dto.setPaymentId(id);
        return paymentRepository.update(dto);
    }

    @Override
    public void delete(int id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PaymentDTO getPaymentByBookingId(int bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking " + bookingId));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void updatePaymentStatus(int paymentId, String status, String paymentType) {
        PaymentDTO payment = getById(paymentId);
        java.math.BigDecimal total = payment.getTotalAmount() != null ? payment.getTotalAmount() : java.math.BigDecimal.ZERO;
        java.math.BigDecimal alreadyPaid = payment.getAmount() != null ? payment.getAmount() : java.math.BigDecimal.ZERO;

        if ("PAYING".equalsIgnoreCase(status) || ("PENDING".equalsIgnoreCase(status) && "MILESTONE".equalsIgnoreCase(paymentType) && alreadyPaid.compareTo(java.math.BigDecimal.ZERO) == 0)) {
            // Milestone First Half payment (divide total by 2)
            java.math.BigDecimal halfAmount = total.divide(new java.math.BigDecimal(2), 2, java.math.RoundingMode.HALF_UP);

            payment.setStatus("PENDING"); // Keep "PENDING" in database to prevent SQLException (ENUM constraint)
            payment.setAmount(halfAmount);
            payment.setDueAmount(halfAmount);
            if (paymentType != null) payment.setPaymentType(paymentType);
            paymentRepository.update(payment);

            // Record first half in Company Finance
            com.sliit.weddingplanner.dto.CompanyFinanceDTO finance = new com.sliit.weddingplanner.dto.CompanyFinanceDTO();
            finance.setType("INCOME");
            finance.setBookingId(payment.getBookingId());
            finance.setPaymentId(payment.getPaymentId());
            finance.setAmount(halfAmount);
            finance.setDescription(payment.getPaymentType() + " partial payment (Part 1/2) for Booking #" + payment.getBookingId());
            finance.setPaymentMethod("ONLINE");
            companyFinanceRepository.save(finance);

            System.out.println("DEBUG: First milestone payment recorded for Payment #" + paymentId);
        } else if ("PAID".equalsIgnoreCase(status)) {
            // Either Full Payment from start, or Milestone Second Half payment
            java.math.BigDecimal payAmount;
            String desc;

            if ("MILESTONE".equalsIgnoreCase(payment.getPaymentType()) && alreadyPaid.compareTo(java.math.BigDecimal.ZERO) > 0) {
                // Paying the second half of Milestone
                payAmount = payment.getDueAmount();
                desc = payment.getPaymentType() + " final payment (Part 2/2) for Booking #" + payment.getBookingId();
            } else {
                // Paying Full Payment
                payAmount = total;
                desc = (paymentType != null ? paymentType : payment.getPaymentType()) + " full payment for Booking #" + payment.getBookingId();
            }

            payment.setStatus("PAID");
            payment.setAmount(total);
            payment.setDueAmount(java.math.BigDecimal.ZERO);
            if (paymentType != null) payment.setPaymentType(paymentType);
            paymentRepository.update(payment);

            // Record in Company Finance
            com.sliit.weddingplanner.dto.CompanyFinanceDTO finance = new com.sliit.weddingplanner.dto.CompanyFinanceDTO();
            finance.setType("INCOME");
            finance.setBookingId(payment.getBookingId());
            finance.setPaymentId(payment.getPaymentId());
            finance.setAmount(payAmount);
            finance.setDescription(desc);
            finance.setPaymentMethod("ONLINE");
            companyFinanceRepository.save(finance);

            System.out.println("DEBUG: Final payment recorded for Payment #" + paymentId + " of amount " + payAmount);
        } else {
            paymentRepository.updateStatus(paymentId, status);
        }
    }

    @Override
    public List<PaymentDTO> getPaymentsByCustomerId(int customerId) {
        return paymentRepository.findAllByCustomerId(customerId);
    }
}
