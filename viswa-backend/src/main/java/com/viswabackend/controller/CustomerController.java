package com.viswabackend.controller;

import com.viswabackend.DTO.CartDTO;
import com.viswabackend.model.*;
import com.viswabackend.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService service;

    @Autowired
    private ReserveTableService reserveTableService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private ReservePartyhallService reservePartyhallService;

    @Autowired
    private CartService cartService;


    @GetMapping("/{customerId}/addresses")
    public ResponseEntity<List<Address>> getAddressesByCustomerId(@PathVariable Integer customerId) {
        List<Address> addresses = addressService.findByCustomerId(customerId);
        return ResponseEntity.ok(addresses);
    }


    @GetMapping("/{customerId}/reserve-table")
    public List<ReserveTable> getReserveTableByCustomerId(@PathVariable Long customerId) {
        return reserveTableService.findByCustomerId(customerId);
    }

    @GetMapping("/{customerId}/reserve-partyhall")
    public List<ReservePartyhall> getReservePartyHallByCustomerId(@PathVariable Long customerId) {
        return reservePartyhallService.findByCustomerId(customerId);
    }

    @GetMapping("/{customerId}/orders")
    public ResponseEntity<?> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<Order> orders = service.findOrdersByCustomerId(customerId);
        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No orders found for customerId: " + customerId);
        }
        return ResponseEntity.status(HttpStatus.OK).body(orders);
    }

    @GetMapping("/{customerId}/cart")
    public ResponseEntity<CartDTO> getCartByCustomerId(@PathVariable Long customerId) {
        CartDTO cartDTO = cartService.getCartDTOByCustomer(customerId);
        return ResponseEntity.ok(cartDTO);
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = service.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return service.findById(id)
                .map(customer -> ResponseEntity.status(HttpStatus.OK).body(customer))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        try {
            Customer updated = service.update(id, customer);
            return ResponseEntity.status(HttpStatus.OK).body(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Customer not found with id: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Customer deleted with id: " + id);
    }

}
