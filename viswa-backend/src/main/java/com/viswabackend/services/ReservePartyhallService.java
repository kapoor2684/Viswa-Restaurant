package com.viswabackend.services;

import com.viswabackend.model.ReservePartyhall;
import com.viswabackend.model.Status;
import com.viswabackend.repositories.ReservePartyhallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservePartyhallService {

    @Autowired
    private ReservePartyhallRepository repository;

    public List<ReservePartyhall> findAll() { return repository.findAll(); }

    public Optional<ReservePartyhall> findById(Long id) { return repository.findById(id); }

    public ReservePartyhall reservePartyhall(ReservePartyhall reservePartyhall) { return repository.save(reservePartyhall); }

    public List<ReservePartyhall> findByCustomerId(Long customerId) {
        return repository.findByCustomerId(customerId);
    }
    public ReservePartyhall updateBooking(Long id, ReservePartyhall updatedReservePartyhall) {
        Optional<ReservePartyhall> optionalExisting = repository.findById(id);
        if (optionalExisting.isPresent()) {
            ReservePartyhall existing = optionalExisting.get();

            existing.setBookingName(updatedReservePartyhall.getBookingName());
            existing.setCustomerId(updatedReservePartyhall.getCustomerId());
            existing.setBookingDate(updatedReservePartyhall.getBookingDate());
            existing.setEventType(updatedReservePartyhall.getEventType());
            existing.setStartTime(updatedReservePartyhall.getStartTime());
            existing.setEndTime(updatedReservePartyhall.getEndTime());
            existing.setTotalHours(updatedReservePartyhall.getTotalHours());
            existing.setGuests(updatedReservePartyhall.getGuests());
            existing.setSpecialRequests(updatedReservePartyhall.getSpecialRequests());
            existing.setEmergencyContactName(updatedReservePartyhall.getEmergencyContactName());
            existing.setEmergencyContactPhone(updatedReservePartyhall.getEmergencyContactPhone());
            existing.setStatus(updatedReservePartyhall.getStatus());
            existing.setVenue(updatedReservePartyhall.getVenue());
            existing.setPaymentStatus(updatedReservePartyhall.getPaymentStatus());
            existing.setUpdatedAt(java.time.LocalDateTime.now());

            return repository.save(existing);
        } else {
            throw new RuntimeException("Partyhall reservation with id " + id + " not found");
        }
    }

    public ReservePartyhall deactivateBooking(Long id) {
        Optional<ReservePartyhall> optionalExisting = repository.findById(id);
        if (optionalExisting.isPresent()) {
            ReservePartyhall existing = optionalExisting.get();
            existing.setStatus(Status.CANCELLED);
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            return repository.save(existing);
        } else {
            throw new RuntimeException("Partyhall reservation with id " + id + " not found");
        }
    }

    public List<ReservePartyhall> findByBookingDate(LocalDate bookingDate) {
        return repository.findByBookingDate(bookingDate);
    }


}
