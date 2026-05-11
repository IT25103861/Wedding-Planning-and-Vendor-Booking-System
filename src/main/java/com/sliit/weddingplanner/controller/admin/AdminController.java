package com.sliit.weddingplanner.controller.admin;

import com.sliit.weddingplanner.dto.admin.AdminDTO;
import com.sliit.weddingplanner.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/create")
    public ResponseEntity<AdminDTO> createAdmin(@RequestBody AdminDTO adminDTO) {
        return new ResponseEntity<>(adminService.createUser(adminDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> getAdminById(@PathVariable int id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AdminDTO> updateAdmin(
            @PathVariable int id,
            @RequestBody AdminDTO adminDTO) {

        return ResponseEntity.ok(adminService.updateUser(id, adminDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable int id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("Admin deleted successfully. ID: " + id);
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Admin Service is Running...");
    }
}