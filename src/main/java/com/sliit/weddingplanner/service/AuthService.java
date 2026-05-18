package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.login.LoginRequestDTO;
import com.sliit.weddingplanner.dto.login.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO authenticate(LoginRequestDTO loginRequest);
    LoginResponseDTO loginAdmin(LoginRequestDTO loginRequest);
    LoginResponseDTO loginCustomer(LoginRequestDTO loginRequest);
    LoginResponseDTO loginVendor(LoginRequestDTO loginRequest);
}
