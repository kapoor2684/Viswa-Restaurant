package com.viswabackend.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {
    private Long customerId;
    private List<CartItemDTO> foodItems;
    private BigDecimal grandTotal;
    private Integer totalQuantity;

}