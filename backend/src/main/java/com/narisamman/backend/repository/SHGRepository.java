package com.narisamman.backend.repository;

import com.narisamman.backend.model.SHG;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SHGRepository extends JpaRepository<SHG, Long> {
    Optional<SHG> findByEmail(String email);
    Optional<SHG> findByPhone(String phone);
    List<SHG> findByStatus(String status);
}
