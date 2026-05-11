package com.sliit.weddingplanner.repository;

import com.sliit.weddingplanner.dto.booking.BookingDTO;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class BookingRepository {

    public BookingDTO save(BookingDTO bookingDTO) {

        return null;
    }

    public void delete(int id) {

    }

    public Optional<BookingDTO> findById(int id) {

        return Optional.empty();
    }

    public List<BookingDTO> findAll() {

        return null;
    }

    public BookingDTO update(BookingDTO bookingDTO) {

        return null;
    }

    public boolean existsById(int id) {

        return false;
    }
}