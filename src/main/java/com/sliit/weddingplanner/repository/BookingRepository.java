package com.sliit.weddingplanner.repository;

import com.sliit.weddingplanner.dto.booking.BookingDTO;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class BookingRepository {

    public BookingDTO save(BookingDTO bookingDTO) {
        // TODO: implement save booking
        return null;
    }

    public void delete(int id) {
        // TODO: implement delete booking
    }

    public Optional<BookingDTO> findById(int id) {
        // TODO: implement find booking by id
        return Optional.empty();
    }

    public List<BookingDTO> findAll() {
        // TODO: implement find all bookings
        return null;
    }

    public BookingDTO update(BookingDTO bookingDTO) {
        // TODO: implement update booking
        return null;
    }

    public boolean existsById(int id) {
        // TODO: implement check booking exists
        return false;
    }
}