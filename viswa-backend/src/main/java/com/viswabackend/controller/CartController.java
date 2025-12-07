package com.viswabackend.controller;

import com.viswabackend.DTO.CartAddRequest;
import com.viswabackend.model.Cart;
import com.viswabackend.model.Customer;
import com.viswabackend.services.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<List<Cart>> getCart(@PathVariable Long customerId) {
         List<Cart> cartItems = cartService.getCartItemsByCustomer(customerId);
        return ResponseEntity.ok(cartItems);
    }

    // Add or update cart item
    @PostMapping("/add")
    public ResponseEntity<Cart> addCartItem(@RequestBody CartAddRequest cartAddRequest) {
        Cart cartItem = cartService.addOrUpdateCartItem(cartAddRequest.getCustomerId(), cartAddRequest.getItemId());
        return ResponseEntity.ok(cartItem);
    }

    // Remove cart item
    @PostMapping("/remove")
    public ResponseEntity<String> removeCartItem(@RequestBody CartAddRequest cartAddRequest) {
        cartService.removeCartItem(cartAddRequest.getCustomerId(), cartAddRequest.getItemId());
        return ResponseEntity.ok("Cart item removed or updated successfully");
    }
}
