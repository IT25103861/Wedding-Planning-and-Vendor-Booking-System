package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.booking.BookingDTO;

import java.util.List;

public interface BookingService {
    BookingDTO createBookingService(BookingDTO BookingServiceDTO);

    BookingDTO getBookingById(int BookingServiceId);

    List<BookingDTO> getAllBooking();

    BookingDTO updateBooking(int BookingServiceId, BookingDTO BookingServiceDTO);

    void deleteBookingService(int BookingServiceId);




}
