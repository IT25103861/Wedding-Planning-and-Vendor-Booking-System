package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.UserDTO;

import java.util.List;

public interface UserService<T extends UserDTO> {
    T createUser(T user);
    T updateUser(int id, T user);
    T getUserById(int id);
    List<T> getAllUsers();
    void deleteUser(int id);
}
