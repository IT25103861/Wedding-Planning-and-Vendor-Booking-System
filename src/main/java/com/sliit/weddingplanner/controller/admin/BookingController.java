package com.sliit.weddingplanner.controller.admin;


import com.sliit.weddingplanner.dto.booking.BookingDTO;
import com.sliit.weddingplanner.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {

        this.bookingService = bookingService;
    }

    @PostMapping("/create")
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO dto) {
        BookingDTO created = bookingService.createBookingService(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable int id) {
        com.sliit.weddingplanner.dto.booking.BookingDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBooking());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BookingDTO> updateBooking(
            @PathVariable int id,
            @RequestBody BookingDTO bookingDTO) {

        return ResponseEntity.ok(bookingService.updateBooking(id, bookingDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable int id) {
        bookingService.deleteBookingService(id);
        return ResponseEntity.ok("Booking Service deleted successfully. ID: " + id);
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Booking Service is Running...");
    }
}






