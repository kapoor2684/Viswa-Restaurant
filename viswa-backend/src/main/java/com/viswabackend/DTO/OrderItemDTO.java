package com.viswabackend.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Long itemId;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal totalPrice;
    // Getters and setters
}