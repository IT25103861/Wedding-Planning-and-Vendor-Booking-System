package com.sliit.weddingplanner.dto;

public class AdminDTO extends UserDTO {

    private String role;
    public AdminDTO() {}

    public AdminDTO(String role) {
        this.role = role;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
