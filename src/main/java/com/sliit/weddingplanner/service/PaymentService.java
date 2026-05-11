package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.payment.PaymentDTO;

import java.util.List;

public interface PaymentService {

    boolean savePayment(PaymentDTO dto);

    List<PaymentDTO> getAllPayments();

    boolean updatePayment(PaymentDTO dto);

    boolean deletePayment(int paymentId);

    PaymentDTO searchPayment(int paymentId);
}