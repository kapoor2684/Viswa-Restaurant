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
public class ReservePartyhallDto {
    public Long id;
    public String bookingName;
    public Long customerId;
    public LocalDate bookingDate;
    public String eventType;
    public LocalTime startTime;
    public LocalTime endTime;
    public Integer totalHours;
    public Integer guests;
    public String specialRequests;
    public String emergencyContactName;
    public String emergencyContactPhone;
    public String status;
    public String venue;
    public String paymentStatus;
}