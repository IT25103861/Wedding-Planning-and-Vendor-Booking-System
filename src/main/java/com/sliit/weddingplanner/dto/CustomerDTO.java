package com.sliit.weddingplanner.dto;

import java.time.LocalDateTime;

public class CustomerDTO extends UserDTO {

    private String phone;

    public CustomerDTO() {
        super();
    }

    // Constructor with all fields (including parent fields)
    public CustomerDTO(int id,
                       String username,
                       String name,
                       String email,
                       String password,
                       LocalDateTime createdAt,
                       String phone) {

        super(id, username, name, email, password, createdAt);
        this.phone = phone;
    }

    // Constructor without ID (useful for create operations)
    public CustomerDTO(String username,
                       String name,
                       String email,
                       String password,
                        String phone) {

        super();
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

    // Getter & Setter
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}