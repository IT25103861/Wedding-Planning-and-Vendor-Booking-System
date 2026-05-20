package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.PackageDTO;

import java.util.List;

public interface PackageService {
    PackageDTO create(PackageDTO dto);
    PackageDTO getById(int id);
    List<PackageDTO> getAll();
    PackageDTO update(int id, PackageDTO dto);
    void delete(int id);

    List<PackageDTO> getPackagesByVendor(int vendorId);
    List<PackageDTO> getAllAvailable();
    void updateAvailability(int id, String status);
    List<Integer> getBookedPackageIdsByDate(String date);
}
