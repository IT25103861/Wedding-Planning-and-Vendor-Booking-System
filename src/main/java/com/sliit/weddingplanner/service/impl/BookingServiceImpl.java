package com.sliit.weddingplanner.service.impl;

import com.sliit.weddingplanner.dto.booking.BookingDTO;
import com.sliit.weddingplanner.repository.AdminRepository;
import com.sliit.weddingplanner.repository.BookingRepository;
import com.sliit.weddingplanner.service.BookingService;

import java.util.List;

public class BookingServiceImpl implements BookingService{

    private final BookingRepository BookingRepository;

    public BookingServiceImpl(BookingRepository BookingRepository) {
        this.BookingRepository = BookingRepository;
    }

    @Override
    public BookingDTO createBookingService(BookingDTO BookingServiceDTO) {


        return BookingRepository.save(BookingServiceDTO);
    }

    @Override
    public BookingDTO getBookingById(int BookingServiceId) {
        return BookingRepository.findById( BookingServiceId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Override
    public List<BookingDTO> getAllBooking() {
        return BookingRepository.findAll();
    }

    @Override
    public BookingDTO updateBooking(int BookingServiceId, BookingDTO BookingServiceDTO) {
        BookingServiceDTO.setBookingId(BookingServiceId);
        return BookingRepository.update(BookingServiceDTO);

    }

    @Override
    public void deleteBookingService(int BookingServiceId) {
        BookingRepository.delete(BookingServiceId);

    }
}
