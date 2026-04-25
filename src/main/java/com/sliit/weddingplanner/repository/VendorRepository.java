package com.sliit.weddingplanner.repository;

import com.sliit.weddingplanner.db.DBConnection;
import com.sliit.weddingplanner.dto.vendor.VendorDTO;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.*;

@Repository
public class VendorRepository {

    private final Connection con;

    public VendorRepository() {
        con = DBConnection.getInstance().getConnection();
    }

    public VendorDTO save(VendorDTO dto) {

        String sql = "INSERT INTO vendor " +
                "(vendor_id,name,username,email,phone,service_type,price,availability,status) " +
                "VALUES (?,?,?,?,?,?,?,?,?)";

        try (PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1,dto.getVendorId());
            ps.setString(2,dto.getName());
            ps.setString(3,dto.getUsername());
            ps.setString(4,dto.getEmail());
            ps.setString(5,dto.getPhone());
            ps.setString(6,dto.getServiceType());
            ps.setDouble(7,dto.getPrice());
            ps.setString(8,dto.getAvailability());
            ps.setString(9,dto.getStatus());

            ps.executeUpdate();
            return dto;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Optional<VendorDTO> findById(int id) {

        String sql = "SELECT * FROM vendor WHERE vendor_id=?";

        try (PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1,id);
            ResultSet rs = ps.executeQuery();

            if(rs.next()){

                VendorDTO v = new VendorDTO();

                v.setVendorId(rs.getInt("vendor_id"));
                v.setName(rs.getString("name"));
                v.setUsername(rs.getString("username"));
                v.setEmail(rs.getString("email"));
                v.setPhone(rs.getString("phone"));
                v.setServiceType(rs.getString("service_type"));
                v.setPrice(rs.getDouble("price"));
                v.setAvailability(rs.getString("availability"));
                v.setStatus(rs.getString("status"));

                return Optional.of(v);
            }

        } catch(Exception e){
            throw new RuntimeException(e);
        }

        return Optional.empty();
    }

    public List<VendorDTO> findAll() {

        List<VendorDTO> list = new ArrayList<>();

        try (PreparedStatement ps =
                     con.prepareStatement("SELECT * FROM vendor")) {

            ResultSet rs = ps.executeQuery();

            while(rs.next()){

                VendorDTO v = new VendorDTO();

                v.setVendorId(rs.getInt("vendor_id"));
                v.setName(rs.getString("name"));
                v.setUsername(rs.getString("username"));
                v.setEmail(rs.getString("email"));

                list.add(v);
            }

        } catch(Exception e){
            throw new RuntimeException(e);
        }

        return list;
    }

    public VendorDTO update(VendorDTO dto) {

        String sql = "UPDATE vendor SET name=?,username=?,email=? WHERE vendor_id=?";

        try (PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1,dto.getName());
            ps.setString(2,dto.getUsername());
            ps.setString(3,dto.getEmail());
            ps.setInt(4,dto.getVendorId());

            ps.executeUpdate();
            return dto;

        } catch(Exception e){
            throw new RuntimeException(e);
        }
    }

    public void delete(int id) {

        try (PreparedStatement ps =
                     con.prepareStatement("DELETE FROM vendor WHERE vendor_id=?")) {

            ps.setInt(1,id);
            ps.executeUpdate();

        } catch(Exception e){
            throw new RuntimeException(e);
        }
    }

    public boolean existsByUsernameOrEmail(String username,String email){

        String sql = "SELECT 1 FROM vendor WHERE username=? OR email=?";

        try(PreparedStatement ps = con.prepareStatement(sql)){

            ps.setString(1,username);
            ps.setString(2,email);

            return ps.executeQuery().next();

        } catch(Exception e){
            throw new RuntimeException(e);
        }
    }
}