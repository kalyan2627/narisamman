package com.narisamman.backend.controller;

import com.narisamman.backend.model.Address;
import com.narisamman.backend.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @GetMapping
    public ResponseEntity<List<Address>> getAddressesByUserId(@RequestParam String userId) {
        return ResponseEntity.ok(addressRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestBody Address address) {
        if (address.getIsDefault() != null && address.getIsDefault()) {
            // Unset previous defaults if this is marked as default
            List<Address> existing = addressRepository.findByUserId(address.getUserId());
            for (Address a : existing) {
                if (Boolean.TRUE.equals(a.getIsDefault())) {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                }
            }
        } else if (address.getIsDefault() == null) {
            address.setIsDefault(false);
        }
        
        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address updated) {
        Optional<Address> opt = addressRepository.findById(id);
        if (opt.isPresent()) {
            Address existing = opt.get();
            if (updated.getLabel() != null) existing.setLabel(updated.getLabel());
            if (updated.getLine() != null) existing.setLine(updated.getLine());
            if (updated.getIsDefault() != null) {
                if (updated.getIsDefault() && !Boolean.TRUE.equals(existing.getIsDefault())) {
                    // Unset others
                    List<Address> all = addressRepository.findByUserId(existing.getUserId());
                    for (Address a : all) {
                        if (Boolean.TRUE.equals(a.getIsDefault()) && !a.getId().equals(existing.getId())) {
                            a.setIsDefault(false);
                            addressRepository.save(a);
                        }
                    }
                }
                existing.setIsDefault(updated.getIsDefault());
            }
            return ResponseEntity.ok(addressRepository.save(existing));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        if (addressRepository.existsById(id)) {
            addressRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
