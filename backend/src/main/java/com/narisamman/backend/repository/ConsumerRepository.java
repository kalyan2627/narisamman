package com.narisamman.backend.repository;

import com.narisamman.backend.model.Consumer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConsumerRepository extends JpaRepository<Consumer, Long> {
    Optional<Consumer> findByEmail(String email);
    Optional<Consumer> findByMobileNumber(String mobileNumber);
}
