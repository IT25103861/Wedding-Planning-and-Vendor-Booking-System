package com.sliit.weddingplanner.dto.vendor;

public class VendorDTO {

    private String vendorId;
    private String name;
    private String email;
    private String phone;
    private String serviceType;
    private double price;
    private String availability;

    // Default Constructor
    public VendorDTO() {
    }

    // Parameterized Constructor
    public VendorDTO(String vendorId, String name, String email, String phone,
                     String serviceType, double price, String availability) {
        this.vendorId = vendorId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.serviceType = serviceType;
        this.price = price;
        this.availability = availability;
    }

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    @Override
    public String toString() {
        return "VendorDTO{" +
                "vendorId='" + vendorId + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", serviceType='" + serviceType + '\'' +
                ", price=" + price +
                ", availability='" + availability + '\'' +
                '}';
    }
}
