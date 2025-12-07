package com.viswabackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testcontroller {

    @GetMapping("/api/test")
    public String testApi() {
        return "Test API is working!";
    }
}
