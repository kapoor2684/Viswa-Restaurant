package com.viswabackend.controller;

import com.viswabackend.services.WalletMoneyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("customer/{customerId}/wallet")
public class WalletMoneyController {

    @Autowired
    private WalletMoneyService walletMoneyService;

    // ✔ Get Wallet Balance
    @GetMapping
    public ResponseEntity<?> getWalletBalance(@PathVariable Long customerId) {
        Double balance = walletMoneyService.getWalletBalance(customerId);
        return ResponseEntity.ok(balance);
    }

    // ✔ Add Money
    @PostMapping("/add")
    public ResponseEntity<?> addMoney(
            @PathVariable Long customerId,
            @RequestParam Double amount
    ) {
        Double updated = walletMoneyService.addMoney(customerId, amount);
        return ResponseEntity.ok(updated);
    }

    // ✔ Deduct Money
    @PostMapping("/deduct")
    public ResponseEntity<?> deductMoney(
            @PathVariable Long customerId,
            @RequestParam Double amount
    ) {
        Double updated = walletMoneyService.deductMoney(customerId, amount);
        return ResponseEntity.ok(updated);
    }

    // ✔ Update Wallet Directly
    @PutMapping("/update/")
    public ResponseEntity<?> updateWallet(
            @PathVariable Long customerId,
            @RequestParam Double amount
    ) {
        Double updated = walletMoneyService.updateWallet(customerId, amount);
        return ResponseEntity.ok(updated);
    }
}
