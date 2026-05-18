package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.admin.AdminDTO;
import com.sliit.weddingplanner.exeption.DuplicateRecordException;
import com.sliit.weddingplanner.exeption.ResourceNotFoundException;
import com.sliit.weddingplanner.repository.AdminRepository;
import com.sliit.weddingplanner.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    @Autowired
    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public AdminDTO createUser(AdminDTO adminDTO) {
        if (adminRepository.existsByUsernameOrEmail(adminDTO.getUsername(), adminDTO.getEmail())) {
            throw new DuplicateRecordException("Username or email already exists");
        }
        // Password encoding removed
        adminDTO.setRole("ROLE_ADMIN");
        return adminRepository.save(adminDTO);
    }

    @Override
    public AdminDTO getUserById(int id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id " + id));
    }

    @Override
    public List<AdminDTO> getAllUsers() {
        return adminRepository.findAll();
    }

    @Override
    public AdminDTO updateUser(int id, AdminDTO adminDetails) {
        AdminDTO admin = getUserById(id);

        // Update fields except password and id
        admin.setName(adminDetails.getName());
        admin.setUsername(adminDetails.getUsername());
        admin.setEmail(adminDetails.getEmail());

        return adminRepository.update(admin);
    }

    @Override
    public void deleteUser(int id) {
        AdminDTO admin = getUserById(id);
        adminRepository.delete(admin.getId());
    }

    @Override
    public void approveVendor(int vendorId, int adminId) {
        throw new UnsupportedOperationException("Call VendorService to approve vendor");
    }

    @Override
    public void rejectVendor(int vendorId, int adminId) {
        throw new UnsupportedOperationException("Call VendorService to reject vendor");
    }
}
