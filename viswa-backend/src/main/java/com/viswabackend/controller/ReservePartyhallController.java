package com.viswabackend.controller;

import com.viswabackend.model.ReservePartyhall;
import com.viswabackend.services.ReservePartyhallService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservepartyhall")
public class ReservePartyhallController {

    @Autowired
    private ReservePartyhallService reservePartyhallService;

    @GetMapping("/booking")
    public ResponseEntity<List<ReservePartyhall>> getByBookingDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate) {
        List<ReservePartyhall> results = reservePartyhallService.findByBookingDate(bookingDate);
        return ResponseEntity.ok(results);
    }
    @GetMapping
    public ResponseEntity<List<ReservePartyhall>> getAll() {
        List<ReservePartyhall> list = reservePartyhallService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservePartyhall> getById(@PathVariable Long id) {
        return reservePartyhallService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReservePartyhall> reservePartyhall(@RequestBody ReservePartyhall reservePartyhall) {
        ReservePartyhall saved = reservePartyhallService.reservePartyhall(reservePartyhall);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservePartyhall> updateBooking(@PathVariable Long id, @RequestBody ReservePartyhall reservePartyhall) {
        try {
            ReservePartyhall updated = reservePartyhallService.updateBooking(id, reservePartyhall);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ReservePartyhall> deactivateBooking(@PathVariable Long id) {
        try {
            ReservePartyhall deactivated = reservePartyhallService.deactivateBooking(id);
            return ResponseEntity.ok(deactivated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
