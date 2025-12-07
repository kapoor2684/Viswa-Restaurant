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
public class CartItemDTO {
    private Long id;
    private String name;
    private String image;
    private BigDecimal price;
    private BigDecimal totalPrice;
    private Integer quantity;
}
