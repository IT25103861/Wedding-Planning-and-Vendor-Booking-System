package com.sliit.weddingplanner.dto.vendor;

import com.sliit.weddingplanner.dto.UserDTO;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class VendorDTO extends UserDTO {

    private String serviceType;
    private double price;
    private String availability;
    private String status;
    private Integer approvedBy;
    private Timestamp approvedAt;
    private String phone;

    public VendorDTO(){

    }

    public VendorDTO(int id, String username, String name, String email, String password, LocalDateTime createdAt, String serviceType, double price, String availability, String status, Integer approvedBy, Timestamp approvedAt,String phone) {
        super(id, username, name, email, password, createdAt);
        this.serviceType = serviceType;
        this.price = price;
        this.availability = availability;
        this.status = status;
        this.approvedBy = approvedBy;
        this.approvedAt = approvedAt;
        this.phone=phone;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(Integer approvedBy) {
        this.approvedBy = approvedBy;
    }

    public Timestamp getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(Timestamp approvedAt) {
        this.approvedAt = approvedAt;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Override
    public String toString() {
        return "VendorDTO{" +
                "name='" + name + '\'' +
                ", serviceType='" + serviceType + '\'' +
                ", price=" + price +
                ", availability='" + availability + '\'' +
                ", status='" + status + '\'' +
                ", approvedBy=" + approvedBy +
                ", approvedAt=" + approvedAt +
                ", phone='" + phone + '\'' +
                ", id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}