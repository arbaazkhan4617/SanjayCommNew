package com.integrators.repository;

import com.integrators.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByModelId(Long modelId);

    @Query(value = "SELECT p FROM Product p WHERE p.originalPrice IS NOT NULL AND p.originalPrice > p.price",
           countQuery = "SELECT COUNT(p) FROM Product p WHERE p.originalPrice IS NOT NULL AND p.originalPrice > p.price")
    Page<Product> findDeals(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);

    List<Product> findByInStockTrue();
}
