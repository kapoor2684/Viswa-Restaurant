package com.viswabackend.controller;

import com.viswabackend.DTO.CustomerRegisterRequest;
import com.viswabackend.DTO.LoginRequest;
import com.viswabackend.model.Customer;
import com.viswabackend.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000") // allow your frontend origin
public class AuthenticationController {

    @Autowired
    private CustomerService customerService;

    // POST /auth/customer/login
    @PostMapping("/login")
    public ResponseEntity<Customer> loginCustomer(@RequestBody LoginRequest request) {
        return customerService.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerRegisterRequest request) {
        try {
            Customer savedCustomer = customerService.registerCustomer(request);
            return ResponseEntity.ok(savedCustomer);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

    }
}
