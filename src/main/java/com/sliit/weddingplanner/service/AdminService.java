package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.admin.AdminDTO;

public interface AdminService extends UserService<AdminDTO> {
    void approveVendor(int vendorId, int adminId);
    void rejectVendor(int vendorId, int adminId);
}
