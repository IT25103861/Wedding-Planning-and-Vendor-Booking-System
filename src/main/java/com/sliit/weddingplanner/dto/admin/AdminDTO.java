package com.sliit.weddingplanner.dto.admin;

import com.sliit.weddingplanner.dto.UserDTO;

public class AdminDTO extends UserDTO {

    private String role;

    public AdminDTO() {}

    public AdminDTO(int id, String username, String name, String email,
                    String password, String role, java.time.LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    @Override
    public String toString() {
        return "AdminDTO{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
