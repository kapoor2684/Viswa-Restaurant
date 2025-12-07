package com.viswabackend.services;

import com.viswabackend.model.Order;
import com.viswabackend.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }

    public Order update(Long id, Order updatedOrder) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setCustomerId(updatedOrder.getCustomerId());
                    order.setCustomerName(updatedOrder.getCustomerName());
                    order.setPhone(updatedOrder.getPhone());
                    order.setOrderDate(updatedOrder.getOrderDate());
                    order.setAddressId(updatedOrder.getAddressId());
                    order.setPaymentMethod(updatedOrder.getPaymentMethod());
                    order.setPaymentStatus(updatedOrder.getPaymentStatus());
                    order.setTotalAmount(updatedOrder.getTotalAmount());
                    order.setStatus(updatedOrder.getStatus());
                    order.setDeliveryInstructions(updatedOrder.getDeliveryInstructions());
                    order.setOrderItems(updatedOrder.getOrderItems());
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Order not found with id " + id));
    }
}
