package com.viswabackend.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRegisterRequest {
    private String username;

     private String email;

     private String phone;

     private String password;

     private String gender;

     private LocalDate lastOrderDate;

     private Long totalOrders;

     private Integer loyaltyPoints;
}
