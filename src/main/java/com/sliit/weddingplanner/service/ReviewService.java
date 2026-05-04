package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dao.ReviewDAO;
import com.sliit.weddingplanner.model.Review;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewDAO dao = new ReviewDAO();

    // CREATE
    public void addReview(Review review) {
        dao.addReview(review);
    }

    // READ ALL
    public List<Review> getAllReviews() {
        return dao.getAllReviews();
    }

    // READ BY ID
    public Review getReviewById(int id) {
        return dao.getReviewById(id);
    }

    // UPDATE
    public void updateReview(Review review) {
        dao.updateReview(review);
    }

    // DELETE
    public void deleteReview(int id) {
        dao.deleteReview(id);
    }
}