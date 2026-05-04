package com.sliit.weddingplanner.model;

public class Review {
    private int id;
    private String vendor;
    private int rating;
    private String comment;

    public Review(String vendor, int rating, String comment) {
        this.setVendor(vendor);
        this.setRating(rating);
        this.setComment(comment);
    }


    public Review() {}

    public String getVendor() { return vendor; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}