package com.viswabackend.services;

import com.viswabackend.model.Customer;
import com.viswabackend.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WalletMoneyService {

    @Autowired
    private CustomerRepository customerRepository;

    // ✔ Fetch Wallet Money
    public Double getWalletBalance(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return customer.getWalletMoney();
    }

    // ✔ Add Money to Wallet
    public Double addMoney(Long customerId, Double amount) {
        if (amount <= 0) throw new RuntimeException("Invalid amount");

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setWalletMoney(customer.getWalletMoney() + amount);
        customerRepository.save(customer);

        return customer.getWalletMoney();
    }

    // ✔ Deduct Money from Wallet
    public Double deductMoney(Long customerId, Double amount) {
        if (amount <= 0) throw new RuntimeException("Invalid deduction amount");

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (customer.getWalletMoney() < amount)
            throw new RuntimeException("Insufficient wallet balance");

        customer.setWalletMoney(customer.getWalletMoney() - amount);
        customerRepository.save(customer);

        return customer.getWalletMoney();
    }

    // ✔ Set Wallet Balance Directly (Admin or Reset)
    public Double updateWallet(Long customerId, Double newAmount) {
        if (newAmount < 0) throw new RuntimeException("Invalid wallet amount");

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setWalletMoney(newAmount);
        customerRepository.save(customer);

        return customer.getWalletMoney();
    }
}
