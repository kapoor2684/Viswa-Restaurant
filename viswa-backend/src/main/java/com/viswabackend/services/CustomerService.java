package com.viswabackend.services;

import com.viswabackend.DTO.CustomerRegisterRequest;
import com.viswabackend.model.Customer;
import com.viswabackend.model.Order;
import com.viswabackend.repositories.CustomerRepository;
import com.viswabackend.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    @Autowired
    private OrderRepository orderRepository;  // Inject order repository

    public Customer registerCustomer(CustomerRegisterRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        Customer customer = new Customer();
        customer.setUsername(request.getUsername());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setPassword(request.getPassword());
        customer.setGender(request.getGender());
        customer.setLastOrderDate(request.getLastOrderDate());
        customer.setTotalOrders(request.getTotalOrders());
        customer.setLoyaltyPoints(request.getLoyaltyPoints());
        return repository.save(customer);
    }

    public List<Customer> findAll() {
        return repository.findAll();
    }

    public List<Order> findOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public Optional<Customer> findById(Long id) {
        return repository.findById(id);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Customer update(Long id, Customer updatedCustomer) {
        return repository.findById(id)
                .map(customer -> {
                    customer.setUsername(updatedCustomer.getUsername());
                    customer.setEmail(updatedCustomer.getEmail());
                    customer.setPhone(updatedCustomer.getPhone());
                    customer.setPassword(updatedCustomer.getPassword());
                    customer.setDob(updatedCustomer.getDob());
                    customer.setGender(updatedCustomer.getGender());
                    customer.setImage(updatedCustomer.getImage());
                    customer.setLastOrderDate(updatedCustomer.getLastOrderDate());
                    customer.setTotalOrders(updatedCustomer.getTotalOrders());
                    customer.setLoyaltyPoints(updatedCustomer.getLoyaltyPoints());
                    customer.setPreferredPaymentMethod(updatedCustomer.getPreferredPaymentMethod());
                    customer.setIsSubscribed(updatedCustomer.getIsSubscribed());
                    return repository.save(customer);
                })
                .orElseThrow(() -> new RuntimeException("Customer not found with id " + id));
    }

    public Optional<Customer> findByEmailAndPassword(String email, String password) {
        return repository.findByEmailAndPassword(email, password);
    }

}
