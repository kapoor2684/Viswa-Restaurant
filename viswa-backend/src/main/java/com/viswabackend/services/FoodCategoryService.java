package com.viswabackend.services;

import com.viswabackend.model.FoodCategory;
import com.viswabackend.repositories.FoodCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FoodCategoryService {

    @Autowired
    private FoodCategoryRepository repository;

    public List<FoodCategory> findAll() {
        return repository.findAll();
    }

    public Optional<FoodCategory> findById(Long id) {
        return repository.findById(id);
    }

    public FoodCategory save(FoodCategory category) {
        return repository.save(category);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public FoodCategory update(Long id, FoodCategory updatedCategory) {
        return repository.findById(id)
                .map(category -> {
                    category.setName(updatedCategory.getName());
                    category.setDescription(updatedCategory.getDescription());
                    category.setImage(updatedCategory.getImage());
                    category.setIsActive(updatedCategory.getIsActive());
                    return repository.save(category);
                })
                .orElseThrow(() -> new RuntimeException("FoodCategory not found with id " + id));
    }
}
