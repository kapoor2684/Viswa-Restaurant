package com.viswabackend.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String phone;
    private LocalDateTime orderDate;
    private Long addressId;
    private String paymentMethod;
    private String paymentStatus;
    private BigDecimal totalAmount;
    private String orderStatus;
    private String deliveryInstructions;
    private List<OrderItemDTO> orderItems;
 }