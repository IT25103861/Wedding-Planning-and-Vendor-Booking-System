package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.vendor.VendorDTO;

public interface VendorService extends UserService<VendorDTO> {
        void approveVendor(int vendorId, int adminId);
        void rejectVendor(int vendorId, int adminId);
        void updateAvailability(int vendorId, String availability, Integer adminId);
}
