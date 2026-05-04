package com.sliit.weddingplanner.dao;

import com.sliit.weddingplanner.db.DBConnection;
import com.sliit.weddingplanner.model.Review;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ReviewDAO {

    // CREATE
    public void addReview(Review review) {
        try {
            Connection con = DBConnection.getInstance().getConnection();

            String sql = "INSERT INTO reviews (vendor, rating, comment) VALUES (?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, review.getVendor());
            ps.setInt(2, review.getRating());
            ps.setString(3, review.getComment());

            ps.executeUpdate();

            System.out.println("✅ Review inserted!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // READ ALL
    public List<Review> getAllReviews() {
        List<Review> list = new ArrayList<>();

        try {
            Connection con = DBConnection.getInstance().getConnection();

            String sql = "SELECT * FROM reviews";
            PreparedStatement ps = con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Review r = new Review();
                r.setId(rs.getInt("id"));
                r.setVendor(rs.getString("vendor"));
                r.setRating(rs.getInt("rating"));
                r.setComment(rs.getString("comment"));

                list.add(r);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    // READ BY ID
    public Review getReviewById(int id) {
        Review review = null;

        try {
            Connection con = DBConnection.getInstance().getConnection();

            String sql = "SELECT * FROM reviews WHERE id=?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, id);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                review = new Review();
                review.setId(rs.getInt("id"));
                review.setVendor(rs.getString("vendor"));
                review.setRating(rs.getInt("rating"));
                review.setComment(rs.getString("comment"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return review;
    }

    // UPDATE
    public void updateReview(Review review) {
        try {
            Connection con = DBConnection.getInstance().getConnection();

            String sql = "UPDATE reviews SET vendor=?, rating=?, comment=? WHERE id=?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, review.getVendor());
            ps.setInt(2, review.getRating());
            ps.setString(3, review.getComment());
            ps.setInt(4, review.getId());

            ps.executeUpdate();

            System.out.println("✏️ Review updated!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // DELETE
    public void deleteReview(int id) {
        try {
            Connection con = DBConnection.getInstance().getConnection();

            String sql = "DELETE FROM reviews WHERE id=?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, id);

            ps.executeUpdate();

            System.out.println("🗑️ Review deleted!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}