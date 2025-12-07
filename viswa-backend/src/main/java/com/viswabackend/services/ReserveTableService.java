package com.viswabackend.services;
import com.viswabackend.model.ReservePartyhall;
import com.viswabackend.model.ReserveTable;
import com.viswabackend.model.Status;
import com.viswabackend.repositories.ReserveTableRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class ReserveTableService {

    @Autowired
    private ReserveTableRepository repository;

    public List<ReserveTable> findAll() { return repository.findAll(); }

    public Optional<ReserveTable> findById(Long id) { return repository.findById(id); }

    public ReserveTable bookTable(ReserveTable reserveTable) { return repository.save(reserveTable); }


    public ReserveTable updateBooking(Long id, ReserveTable updatedReserveTable) {
        Optional<ReserveTable> optionalExisting = repository.findById(id);
        if (optionalExisting.isPresent()) {
            ReserveTable existing = optionalExisting.get();
            // Update relevant fields, except id and createdAt
            existing.setCustomerId(updatedReserveTable.getCustomerId());
            existing.setName(updatedReserveTable.getName());
            existing.setContact(updatedReserveTable.getContact());
            existing.setEmail(updatedReserveTable.getEmail());
            existing.setBookingDate(updatedReserveTable.getBookingDate());
            existing.setTime(updatedReserveTable.getTime());
            existing.setGuests(updatedReserveTable.getGuests());
            existing.setSelectedTable(updatedReserveTable.getSelectedTable());
            existing.setStatus(updatedReserveTable.getStatus());
            existing.setSpecialRequests(updatedReserveTable.getSpecialRequests());
            existing.setUpdatedAt(java.time.LocalDateTime.now());

            return repository.save(existing);
        } else {
            throw new RuntimeException("Booking with id " + id + " not found");
        }
    }
    public List<ReserveTable> findByCustomerId(Long customerId) {
        return repository.findByCustomerId(customerId);
    }

    public ReserveTable deactivateBooking(Long id) {
        Optional<ReserveTable> optionalExisting = repository.findById(id);
        if (optionalExisting.isPresent()) {
            ReserveTable existing = optionalExisting.get();
            existing.setStatus(Status.CANCELLED);
            existing.setUpdatedAt(LocalDateTime.now());
            return repository.save(existing);
        } else {
            throw new RuntimeException("Booking with id " + id + " not found");
        }
    }

    public List<ReserveTable> findByBookingDate(LocalDate bookingDate) {
        return repository.findByBookingDate(bookingDate);
    }

}
