package com.sliit.weddingplanner.dto.payment;

import java.sql.Timestamp;

public class PaymentDTO {

    private int paymentId;
    private int bookingId;
    private double amount;
    private String status;
    private Timestamp paymentDate;

    public PaymentDTO() {}

    public PaymentDTO(int paymentId, int bookingId, double amount, String status) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.amount = amount;
        this.status = status;
    }

    public PaymentDTO(int paymentId, int bookingId, double amount, String status, Timestamp paymentDate) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.amount = amount;
        this.status = status;
        this.paymentDate = paymentDate;
    }

    public int getPaymentId() { return paymentId; }
    public void setPaymentId(int paymentId) { this.paymentId = paymentId; }

    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getPaymentDate() { return paymentDate; }
    public void setPaymentDate(Timestamp paymentDate) { this.paymentDate = paymentDate; }
}