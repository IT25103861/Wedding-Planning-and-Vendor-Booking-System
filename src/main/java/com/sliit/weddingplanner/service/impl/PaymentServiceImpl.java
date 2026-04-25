package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.payment.PaymentDTO;
import com.sliit.weddingplanner.repository.PaymentRepository;
import com.sliit.weddingplanner.service.PaymentService;

import java.util.List;

public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository repo = new PaymentRepository();

    @Override
    public boolean savePayment(PaymentDTO dto) {
        if (dto.getAmount() < 1000) return false;
        return repo.save(dto) != null;
    }

    @Override
    public List<PaymentDTO> getAllPayments() {
        return repo.getAll();
    }

    @Override
    public boolean updatePayment(PaymentDTO dto) {
        return repo.update(dto) != null;
    }

    @Override
    public boolean deletePayment(int paymentId) {
        return repo.delete(paymentId);
    }

    @Override
    public PaymentDTO searchPayment(int paymentId) {
        return repo.search(paymentId);
    }
}