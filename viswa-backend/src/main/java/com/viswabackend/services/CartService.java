package com.viswabackend.services;

import com.viswabackend.DTO.CartDTO;
import com.viswabackend.DTO.CartItemDTO;
import com.viswabackend.model.Cart;
import com.viswabackend.model.Customer;
import com.viswabackend.model.FoodItem;
import com.viswabackend.repositories.CartRepository;
import com.viswabackend.repositories.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    public CartDTO getCartDTOByCustomer(Long customer) {
        List<Cart> cartItems = cartRepository.findByCustomerId(customer);

        List<CartItemDTO> foodItems = cartItems.stream()
                .map(cart -> {
                    FoodItem foodItem = foodItemRepository.findById(cart.getItemId())  // ensure field name matches entity
                            .orElseThrow(() -> new RuntimeException("Food item not found"));
                    return new CartItemDTO(
                            foodItem.getId(),
                            foodItem.getName(),
                            foodItem.getImage(),
                            foodItem.getPrice(),
                            cart.getTotalPrice(),
                            cart.getQuantity()
                    );
                }).collect(Collectors.toList());

        BigDecimal grandTotal = foodItems.stream()
                .map(CartItemDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer totalQuantity = foodItems.stream()
                .map(CartItemDTO::getQuantity)
                .reduce(0, Integer::sum);  // sum quantities

        return new CartDTO(customer, foodItems, grandTotal, totalQuantity);
    }

    public List<Cart> getCartItemsByCustomer(Long customer) {
        return cartRepository.findByCustomerId(customer);
    }

    public Cart addOrUpdateCartItem(Long customerId, Long itemId) {
        Optional<Cart> existingCartItemOpt = cartRepository.findByCustomerIdAndItemId(customerId, itemId);

        Cart cartItem;
        if (existingCartItemOpt.isPresent()) {
            cartItem = existingCartItemOpt.get();
            cartItem.setQuantity(cartItem.getQuantity() + 1);
        } else {
            cartItem = new Cart();
            cartItem.setCustomerId(customerId);
            FoodItem foodItem = foodItemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Food item not found"));
            cartItem.setItemId(foodItem.getId());
            cartItem.setQuantity(1);
            cartItem.setPrice(foodItem.getPrice());
        }
        cartItem.setTotalPrice(cartItem.getPrice().multiply(new BigDecimal(cartItem.getQuantity())));
        return cartRepository.save(cartItem);
    }

    public void removeCartItem(Long customerId, Long itemId) {
        Optional<Cart> existingCartItemOpt = cartRepository.findByCustomerIdAndItemId(customerId, itemId);

        if (existingCartItemOpt.isPresent()) {
            Cart cartItem = existingCartItemOpt.get();

            if (cartItem.getQuantity() > 1) {
                cartItem.setQuantity(cartItem.getQuantity() - 1);
                cartItem.setTotalPrice(cartItem.getTotalPrice().subtract(cartItem.getPrice()));
                cartRepository.save(cartItem);
            } else {
                cartRepository.deleteById(cartItem.getId());
            }
        } else {
            throw new RuntimeException("Cart item not found for this customer and item");
        }
    }




}
