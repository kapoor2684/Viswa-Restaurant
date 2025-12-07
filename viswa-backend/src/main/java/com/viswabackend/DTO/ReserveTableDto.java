package com.viswabackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReserveTableDto {
    public Long id;
    public Long customerId;
    public String name;
    public String contact;
    public String email;
    public LocalDate bookingDate;
    public LocalTime time;
    public Integer guests;
    public Integer selectedTable;
    public String status;
    public String specialRequests;
}