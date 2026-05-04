package com.sliit.weddingplanner.controller;

import com.sliit.weddingplanner.model.Review;
import com.sliit.weddingplanner.service.ReviewService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ReviewController {

    private final ReviewService service;

    // ✅ Constructor Injection (BEST PRACTICE)
    public ReviewController(ReviewService service) {
        this.service = service;
    }

    // READ ALL
    @GetMapping("/reviews")
    public String showReviews(Model model) {
        model.addAttribute("reviews", service.getAllReviews());
        return "reviews";
    }

    // CREATE
    @PostMapping("/addReview")
    public String addReview(@RequestParam String vendor,
                            @RequestParam int rating,
                            @RequestParam String comment) {

        Review review = new Review(vendor, rating, comment);
        service.addReview(review);

        return "redirect:/reviews";
    }

    // DELETE
    @GetMapping("/deleteReview/{id}")
    public String deleteReview(@PathVariable int id) {
        service.deleteReview(id);
        return "redirect:/reviews";
    }

    // SHOW UPDATE FORM (optional but recommended)
    @GetMapping("/editReview/{id}")
    public String editReview(@PathVariable int id, Model model) {
        model.addAttribute("review", service.getReviewById(id));
        return "edit-review";
    }

    // UPDATE
    @PostMapping("/updateReview")
    public String updateReview(@ModelAttribute Review review) {
        service.updateReview(review);
        return "redirect:/reviews";
    }
}