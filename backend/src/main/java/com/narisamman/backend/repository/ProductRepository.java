package com.narisamman.backend.repository;

import com.narisamman.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(String status);
    List<Product> findByArtisanId(String artisanId);
    List<Product> findByStatusAndArtisanId(String status, String artisanId);
}
