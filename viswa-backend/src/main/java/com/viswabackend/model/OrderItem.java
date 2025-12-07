package com.viswabackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)   // FIXED
    private Order order;

    @Column(name = "item_id")                          // FIXED
    private Long itemId;

    @Column(length = 255)
    private String name;

    private BigDecimal price;

    private Integer quantity;

    @Column(name = "total_price")                      // FIXED
    private BigDecimal totalPrice;
}
