package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.admin.AdminDTO;
import com.sliit.weddingplanner.repository.AdminRepository;
import com.sliit.weddingplanner.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public AdminDTO createAdmin(AdminDTO adminDTO) {

        boolean exists = adminRepository.existsByUsernameOrEmail(
                adminDTO.getUsername(),
                adminDTO.getEmail()
        );

        if (exists) {
            throw new RuntimeException("Username or email already exists");
        }

        return adminRepository.save(adminDTO);
    }

    @Override
    public AdminDTO getAdminById(int id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    @Override
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public AdminDTO updateAdmin(int id, AdminDTO dto) {
        dto.setId(id);
        return adminRepository.update(dto);
    }

    @Override
    public void deleteAdmin(int id) {
        adminRepository.delete(id);
    }
}
