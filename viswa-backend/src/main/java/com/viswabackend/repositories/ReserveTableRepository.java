package com.viswabackend.repositories;

import com.viswabackend.model.ReservePartyhall;
import com.viswabackend.model.ReserveTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReserveTableRepository extends JpaRepository<ReserveTable, Long> {
    List<ReserveTable> findByCustomerId(Long customerId);
    List<ReserveTable> findByBookingDate(LocalDate bookingDate);

}