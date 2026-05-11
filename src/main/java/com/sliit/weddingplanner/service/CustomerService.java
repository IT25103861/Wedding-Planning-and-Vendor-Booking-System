package com.sliit.weddingplanner.service;


import com.sliit.weddingplanner.dto.CustomerDTO;
import java.util.List;

public interface CustomerService {

    // Create
    CustomerDTO createCustomer(CustomerDTO customerDTO);

    // Read
    CustomerDTO getCustomerById(int customerId);

    // Read all
    List<CustomerDTO> getAllCustomers();

    // Update
    CustomerDTO updateCustomer(int customerId, CustomerDTO customerDTO);

    // Delete
    void deleteCustomer(int customerId);
}






