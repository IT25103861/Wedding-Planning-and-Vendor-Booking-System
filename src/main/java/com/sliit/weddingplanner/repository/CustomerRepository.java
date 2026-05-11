package com.sliit.weddingplanner.repository;

import com.sliit.weddingplanner.db.DBConnection;
import com.sliit.weddingplanner.dto.CustomerDTO;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class CustomerRepository {

    private final Connection connection;

    public CustomerRepository() {
        this.connection = DBConnection.getInstance().getConnection();
    }

    // CREATE
    public CustomerDTO save(CustomerDTO customerDTO) {

        String sql = "INSERT INTO customer (customer_id, username, name, email, phone, password, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, customerDTO.getId());
            ps.setString(2, customerDTO.getUsername());  // Add this line
            ps.setString(3, customerDTO.getName());
            ps.setString(4, customerDTO.getEmail());
            ps.setString(5, customerDTO.getPhone());
            ps.setString(6, customerDTO.getPassword());
            ps.setTimestamp(7, Timestamp.valueOf(customerDTO.getCreatedAt()));

            ps.executeUpdate();
            return customerDTO;

        } catch (SQLException e) {
            throw new RuntimeException("Error saving customer: " + e.getMessage(), e);
        }
    }

    // DELETE
    public void delete(int id) {

        String sql = "DELETE FROM customer WHERE customer_id = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Error deleting customer", e);
        }
    }

    // FIND BY ID
    public Optional<CustomerDTO> findById(int id) {

        String sql = "SELECT * FROM customer WHERE customer_id = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                CustomerDTO customer = new CustomerDTO();

                customer.setId(rs.getInt("customer_id"));
                customer.setName(rs.getString("name"));
                customer.setEmail(rs.getString("email"));
                customer.setPhone(rs.getString("phone"));
                customer.setPassword(rs.getString("password"));

                customer.setCreatedAt(
                        rs.getTimestamp("created_at") != null
                                ? rs.getTimestamp("created_at").toLocalDateTime()
                                : null
                );

                return Optional.of(customer);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return Optional.empty();
    }

    // FIND ALL
    public List<CustomerDTO> findAll() {

        List<CustomerDTO> list = new ArrayList<>();
        String sql = "SELECT * FROM customer";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                CustomerDTO customer = new CustomerDTO();

                customer.setId(rs.getInt("customer_id"));
                customer.setName(rs.getString("name"));
                customer.setEmail(rs.getString("email"));
                customer.setPhone(rs.getString("phone"));
                customer.setPassword(rs.getString("password"));

                customer.setCreatedAt(
                        rs.getTimestamp("created_at") != null
                                ? rs.getTimestamp("created_at").toLocalDateTime()
                                : null
                );

                list.add(customer);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return list;
    }

    // UPDATE
    public CustomerDTO update(CustomerDTO customerDTO) {

        String sql = "UPDATE customer SET name=?, email=?, phone=?, password=? WHERE customer_id=?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            ps.setString(1, customerDTO.getName());
            ps.setString(2, customerDTO.getEmail());
            ps.setString(3, customerDTO.getPhone());
            ps.setString(4, customerDTO.getPassword());
            ps.setInt(5, customerDTO.getId());

            ps.executeUpdate();
            return customerDTO;

        } catch (SQLException e) {
            throw new RuntimeException("Error updating customer", e);
        }
    }

    // CHECK EXISTENCE (email only, since username not in DB)
    public boolean existsByEmail(String email) {

        String sql = "SELECT 1 FROM customer WHERE email=?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            ps.setString(1, email);
            return ps.executeQuery().next();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}