package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.AdminDTO;

public interface AdminService extends UserService<AdminDTO> {
    void rejectVendor(int vendorId, int adminId);
    void approveVendor(int vendorId, int adminId);

}
