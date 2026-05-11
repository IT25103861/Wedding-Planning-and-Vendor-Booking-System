package com.sliit.weddingplanner.dto.booking;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDTO {

    private int bookingId;
    private int customerId;
    private int vendorId;
    private LocalDate eventDate;
    private String location;
    private String status;
    private LocalDateTime createdAt;

    // Default constructor
    public BookingDTO() {
    }

    // Parameterized constructor
    public BookingDTO(int bookingId, int customerId, int vendorId, LocalDate eventDate,
                      String location, String status, LocalDateTime createdAt) {
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.vendorId = vendorId;
        this.eventDate = eventDate;
        this.location = location;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public int getBookingId() {
        return bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public int getVendorId() {
        return vendorId;
    }

    public void setVendorId(int vendorId) {
        this.vendorId = vendorId;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // toString method
    @Override
    public String toString() {
        return "BookingDTO{" +
                "bookingId=" + bookingId +
                ", customerId=" + customerId +
                ", vendorId=" + vendorId +
                ", eventDate=" + eventDate +
                ", location='" + location + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}