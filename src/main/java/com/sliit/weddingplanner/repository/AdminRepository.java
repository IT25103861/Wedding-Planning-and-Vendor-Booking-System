package com.sliit.weddingplanner.repository;

import com.sliit.weddingplanner.db.DBConnection;
import com.sliit.weddingplanner.dto.admin.AdminDTO;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class AdminRepository {

    private final Connection connection;

    public AdminRepository() {
        this.connection = DBConnection.getInstance().getConnection();
    }

    public AdminDTO save(AdminDTO adminDTO) {

        String sql = "INSERT INTO admin (admin_id, name, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            ps.setInt(1, adminDTO.getId());
            ps.setString(2, adminDTO.getName());
            ps.setString(3, adminDTO.getUsername());
            ps.setString(4, adminDTO.getEmail());
            ps.setString(5, adminDTO.getPassword());
            ps.setString(6, adminDTO.getRole());

            ps.executeUpdate();
            return adminDTO;

        } catch (SQLException e) {
            throw new RuntimeException("Error saving admin: " + e.getMessage(), e);
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM admin WHERE admin_id = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting admin", e);
        }
    }

    public Optional<AdminDTO> findById(int id) {

        String sql = "SELECT * FROM admin WHERE admin_id = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                AdminDTO admin = new AdminDTO();
                admin.setId(rs.getInt("admin_id"));
                admin.setName(rs.getString("name"));
                admin.setUsername(rs.getString("username"));
                admin.setEmail(rs.getString("email"));
                admin.setPassword(rs.getString("password"));
                admin.setRole(rs.getString("role"));
                return Optional.of(admin);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return Optional.empty();
    }

    public List<AdminDTO> findAll() {

        List<AdminDTO> list = new ArrayList<>();
        String sql = "SELECT * FROM admin";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                AdminDTO admin = new AdminDTO();
                admin.setId(rs.getInt("admin_id"));
                admin.setName(rs.getString("name"));
                admin.setUsername(rs.getString("username"));
                admin.setEmail(rs.getString("email"));
                admin.setPassword(rs.getString("password"));
                admin.setRole(rs.getString("role"));
                list.add(admin);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return list;
    }

    public AdminDTO update(AdminDTO adminDTO) {

        String sql = "UPDATE admin SET name=?, username=?, email=?, password=?, role=? WHERE admin_id=?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            ps.setString(1, adminDTO.getName());
            ps.setString(2, adminDTO.getUsername());
            ps.setString(3, adminDTO.getEmail());
            ps.setString(4, adminDTO.getPassword());
            ps.setString(5, adminDTO.getRole());
            ps.setInt(6, adminDTO.getId());

            ps.executeUpdate();
            return adminDTO;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean existsByUsernameOrEmail(String username, String email) {

        String sql = "SELECT 1 FROM admin WHERE username=? OR email=?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, email);

            return ps.executeQuery().next();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}