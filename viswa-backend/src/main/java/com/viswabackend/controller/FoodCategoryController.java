package com.viswabackend.controller;

import com.viswabackend.model.FoodCategory;
import com.viswabackend.services.FoodCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/foodcategories")
public class FoodCategoryController {

    @Autowired
    private FoodCategoryService service;

    @GetMapping
    public ResponseEntity<List<FoodCategory>> getAllCategories() {
        List<FoodCategory> categories = service.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodCategory> getCategoryById(@PathVariable Long id) {
        return service.findById(id)
                .map(category -> ResponseEntity.status(HttpStatus.OK).body(category))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody FoodCategory category) {
        FoodCategory created = service.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody FoodCategory category) {
        try {
            FoodCategory updated = service.update(id, category);
            return ResponseEntity.status(HttpStatus.OK).body(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Food category not found with id: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body("Food category deleted with id: " + id);
    }
}
