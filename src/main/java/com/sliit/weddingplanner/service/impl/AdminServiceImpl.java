package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.admin.AdminDTO;
import com.sliit.weddingplanner.exeption.DuplicateRecordException;
import com.sliit.weddingplanner.exeption.ResourceNotFoundException;
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
    public AdminDTO createUser(AdminDTO adminDTO) {
        if (adminRepository.existsByUsernameOrEmail(adminDTO.getUsername(), adminDTO.getEmail())) {
            throw new DuplicateRecordException("Username or email already exists");
        }

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
    public AdminDTO updateUser(int id, AdminDTO adminDTO) {
        AdminDTO admin = getUserById(id);

        admin.setName(adminDTO.getName());
        admin.setUsername(adminDTO.getUsername());
        admin.setEmail(adminDTO.getEmail());

        return adminRepository.update(admin);
    }

    @Override
    public void deleteUser(int id) {
        AdminDTO admin = getUserById(id);
        if(admin == null){
            System.out.println("No Admin Found under "+id+" number");
        }else{
            adminRepository.delete(admin.getId());
        }

    }
}
