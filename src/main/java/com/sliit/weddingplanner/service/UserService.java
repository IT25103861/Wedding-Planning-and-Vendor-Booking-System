package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.UserDTO;

import java.util.List;

public interface UserService<T extends UserDTO> {

    T createUser(T dto);

    T getUserById(int id);

    List<T> getAllUsers();

    T updateUser(int id, T dto);

    void deleteUser(int id);
}
