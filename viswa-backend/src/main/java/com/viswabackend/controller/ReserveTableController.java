package com.viswabackend.controller;

import com.viswabackend.model.ReservePartyhall;
import com.viswabackend.model.ReserveTable;
import com.viswabackend.services.ReserveTableService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservetable")
public class ReserveTableController {

    @Autowired
    private ReserveTableService service;

    @GetMapping
    public ResponseEntity<List<ReserveTable>> getAll() {
        List<ReserveTable> list = service.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/booking")
    public ResponseEntity<List<ReserveTable>> getByBookingDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate) {
        List<ReserveTable> results = service.findByBookingDate(bookingDate);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReserveTable> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReserveTable> bookTable(@RequestBody ReserveTable reserveTable) {
        ReserveTable saved = service.bookTable(reserveTable);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReserveTable> update(@PathVariable Long id, @RequestBody ReserveTable reserveTable) {
        try {
            ReserveTable updated = service.updateBooking(id, reserveTable);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ReserveTable> deactivateBooking(@PathVariable Long id) {
        try {
            ReserveTable deactivated = service.deactivateBooking(id);
            return ResponseEntity.ok(deactivated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
