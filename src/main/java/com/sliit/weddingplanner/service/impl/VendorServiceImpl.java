package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.vendor.VendorDTO;
import com.sliit.weddingplanner.repository.VendorRepository;
import com.sliit.weddingplanner.service.VendorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;

    public VendorServiceImpl(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public VendorDTO createVendor(VendorDTO dto) {

        if (vendorRepository.existsByUsernameOrEmail(
                dto.getUsername(),
                dto.getEmail())) {

            throw new RuntimeException("Username or Email already exists");
        }

        return vendorRepository.save(dto);
    }

    public VendorDTO getVendorById(int id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    public List<VendorDTO> getAllVendors() {
        return vendorRepository.findAll();
    }

    public VendorDTO updateVendor(int id, VendorDTO dto) {
        dto.setVendorId(id);
        return vendorRepository.update(dto);
    }

    public void deleteVendor(int id) {
        vendorRepository.delete(id);
    }
}