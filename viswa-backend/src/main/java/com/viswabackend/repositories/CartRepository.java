package com.viswabackend.repositories;
import com.viswabackend.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByCustomerId(Long customerId);
    Optional<Cart> findByCustomerIdAndItemId(Long customerId, Long ItemId);

}