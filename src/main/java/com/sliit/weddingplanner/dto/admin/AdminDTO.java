package com.sliit.weddingplanner.dto.admin;

import com.sliit.weddingplanner.dto.UserDTO;

import java.time.LocalDateTime;

public class AdminDTO extends UserDTO {

    private String role;

    public AdminDTO() {}

    public AdminDTO(String role) {
        this.role = role;
    }

    public AdminDTO(Integer id, String username, String name, String email, String password, LocalDateTime createdAt, String role) {
        super(id, username, name, email, password, createdAt);
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "AdminDTO{" +
                "role='" + role + '\'' +
                ", id=" + id +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
