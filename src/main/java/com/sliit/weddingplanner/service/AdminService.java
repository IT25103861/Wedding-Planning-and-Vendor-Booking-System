package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.admin.AdminDTO;

import java.util.List;

public interface AdminService {

    AdminDTO createAdmin(AdminDTO adminDTO);

    AdminDTO getAdminById(int adminId);

    List<AdminDTO> getAllAdmins();

    AdminDTO updateAdmin(int adminId, AdminDTO adminDTO);

    void deleteAdmin(int adminId);
}
