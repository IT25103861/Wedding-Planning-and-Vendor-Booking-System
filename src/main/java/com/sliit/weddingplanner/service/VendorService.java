package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.vendor.VendorDTO;

import java.util.List;

public interface VendorService {

        VendorDTO createVendor(VendorDTO vendorDTO);

        VendorDTO getVendorById(int vendorDTO);

        List<VendorDTO> getAllVendors();

        VendorDTO updateVendor(int vendorId, VendorDTO vendorDTO);

        void deleteVendor(int vendorId);

}
