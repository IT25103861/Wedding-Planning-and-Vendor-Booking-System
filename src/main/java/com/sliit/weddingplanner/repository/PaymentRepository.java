package com.sliit.weddingplanner.repository;

import com.sliit.weddingplanner.dto.payment.PaymentDTO;
import com.sliit.weddingplanner.db.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PaymentRepository {

    private final Connection connection;

    public PaymentRepository() {
        this.connection = DBConnection.getInstance().getConnection();
    }

    public PaymentDTO save(PaymentDTO dto) {
        try {
            String sql = "INSERT INTO payment (payment_id, booking_id, amount, status) VALUES (?, ?, ?, ?)";
            PreparedStatement ps = connection.prepareStatement(sql);

            ps.setInt(1, dto.getPaymentId());
            ps.setInt(2, dto.getBookingId());
            ps.setDouble(3, dto.getAmount());
            ps.setString(4, dto.getStatus());

            ps.executeUpdate();
            return dto;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<PaymentDTO> getAll() {
        List<PaymentDTO> list = new ArrayList<>();

        try {
            String sql = "SELECT * FROM payment";
            PreparedStatement ps = connection.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                list.add(new PaymentDTO(
                        rs.getInt("payment_id"),
                        rs.getInt("booking_id"),
                        rs.getDouble("amount"),
                        rs.getString("status"),
                        rs.getTimestamp("payment_date")
                ));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    public PaymentDTO search(int paymentId) {
        try {
            String sql = "SELECT * FROM payment WHERE payment_id=?";
            PreparedStatement ps = connection.prepareStatement(sql);

            ps.setInt(1, paymentId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return new PaymentDTO(
                        rs.getInt("payment_id"),
                        rs.getInt("booking_id"),
                        rs.getDouble("amount"),
                        rs.getString("status"),
                        rs.getTimestamp("payment_date")
                );
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public PaymentDTO update(PaymentDTO dto) {
        try {
            String sql = "UPDATE payment SET booking_id=?, amount=?, status=? WHERE payment_id=?";
            PreparedStatement ps = connection.prepareStatement(sql);

            ps.setInt(1, dto.getBookingId());
            ps.setDouble(2, dto.getAmount());
            ps.setString(3, dto.getStatus());
            ps.setInt(4, dto.getPaymentId());

            ps.executeUpdate();
            return dto;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean delete(int paymentId) {
        try {
            String sql = "DELETE FROM payment WHERE payment_id=?";
            PreparedStatement ps = connection.prepareStatement(sql);

            ps.setInt(1, paymentId);

            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}