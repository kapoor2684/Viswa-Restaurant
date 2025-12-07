package com.viswabackend.repositories;

import com.viswabackend.model.ReservePartyhall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservePartyhallRepository extends JpaRepository<ReservePartyhall, Long> {
    List<ReservePartyhall> findByCustomerId(Long customerId);
    List<ReservePartyhall> findByBookingDate(LocalDate bookingDate);

}