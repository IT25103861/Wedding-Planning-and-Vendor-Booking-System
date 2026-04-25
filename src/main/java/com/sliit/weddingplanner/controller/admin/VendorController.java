package com.sliit.weddingplanner.controller.admin;

import com.sliit.weddingplanner.dto.vendor.VendorDTO;
import com.sliit.weddingplanner.service.VendorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    // CREATE
    @PostMapping("/create")
    public ResponseEntity<VendorDTO> create(@RequestBody VendorDTO dto) {
        return new ResponseEntity<>(
                vendorService.createVendor(dto),
                HttpStatus.CREATED
        );
    }

    // GET BY ID
    @GetMapping("/id/{id}")
    public ResponseEntity<VendorDTO> getById(@PathVariable int id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    // GET ALL
    @GetMapping("/all")
    public ResponseEntity<List<VendorDTO>> getAll() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<VendorDTO> update(
            @PathVariable int id,
            @RequestBody VendorDTO dto) {

        return ResponseEntity.ok(
                vendorService.updateVendor(id, dto)
        );
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok("Vendor deleted");
    }
}