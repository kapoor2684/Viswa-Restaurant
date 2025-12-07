package com.viswabackend.services;


import com.viswabackend.model.FoodItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.viswabackend.repositories.FoodItemRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository repository;

    public List<FoodItem> findAll() {
        return repository.findAll();
    }

    public Optional<FoodItem> findById(Long id) {
        return repository.findById(id);
    }

    public FoodItem save(FoodItem foodItem) {
        return repository.save(foodItem);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public FoodItem update(Long id, FoodItem updatedFoodItem) {
        return repository.findById(id)
                .map(foodItem -> {
                    // update fields
                    foodItem.setName(updatedFoodItem.getName());
                    foodItem.setCategory(updatedFoodItem.getCategory());
                    foodItem.setType(updatedFoodItem.getType());
                    foodItem.setPrice(updatedFoodItem.getPrice());
                    foodItem.setImage(updatedFoodItem.getImage());
                    foodItem.setDescription(updatedFoodItem.getDescription());
                    foodItem.setIngredients(updatedFoodItem.getIngredients());
                    foodItem.setAvailable(updatedFoodItem.getAvailable());
                    foodItem.setIsFeatured(updatedFoodItem.getIsFeatured());
                    foodItem.setRating(updatedFoodItem.getRating());
                    foodItem.setReviews(updatedFoodItem.getReviews());
                    foodItem.setLikes(updatedFoodItem.getLikes());
                    foodItem.setDiscount(updatedFoodItem.getDiscount());
                    foodItem.setCalories(updatedFoodItem.getCalories());
                    foodItem.setSpecialInstructions(updatedFoodItem.getSpecialInstructions());
                    return repository.save(foodItem);
                })
                .orElseThrow(() -> new RuntimeException("FoodItem not found with id " + id));
    }

    public List<FoodItem> findByCategory(Long categoryId) {
        return repository.findByCategory(categoryId);
    }

}
