package com.sliit.weddingplanner.dto;

public class PaymentDTO {
    protected String transactionID;
    protected double amount;
    protected String date;
    protected String status;
    private String coutomerID;

    public PaymentDTO(String transactionID, double amount, String date, String status, String coutomerID) {
        this.transactionID = transactionID;
        this.amount = amount;
        this.date = date;
        this.status = status;
        this.coutomerID = coutomerID;
    }

    @Override
    public String toString() {
        return "PaymentDTO{" +
                "transactionID='" + transactionID + '\'' +
                ", amount=" + amount +
                ", date='" + date + '\'' +
                ", status='" + status + '\'' +
                ", coutomerID='" + coutomerID + '\'' +
                '}';
    }
}
