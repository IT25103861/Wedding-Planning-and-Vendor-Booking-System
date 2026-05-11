package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.CustomerDTO;
import com.sliit.weddingplanner.repository.CustomerRepository;
import com.sliit.weddingplanner.service.CustomerService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {

        // Validate ID (must be provided manually)
        if (customerDTO.getId() <= 0) {
            throw new RuntimeException("ID must be provided manually");
        }

        // Validate password length (customer: min 6 characters)
        if (customerDTO.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        // Check if email already exists (customer only has email, no username)
        boolean exists = customerRepository.existsByEmail(customerDTO.getEmail());

        if (exists) {
            throw new RuntimeException("Email already exists");
        }

        // Set created timestamp
        customerDTO.setCreatedAt(LocalDateTime.now());

        return customerRepository.save(customerDTO);
    }

    @Override
    public CustomerDTO getCustomerById(int id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public CustomerDTO updateCustomer(int id, CustomerDTO dto) {
        dto.setId(id);
        return customerRepository.update(dto);
    }

    @Override
    public void deleteCustomer(int id) {
        customerRepository.delete(id);
    }
}