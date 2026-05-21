package com.narisamman.backend.controller;

import com.narisamman.backend.model.Product;
import com.narisamman.backend.model.WishlistItem;
import com.narisamman.backend.repository.ProductRepository;
import com.narisamman.backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(@RequestParam String userId) {
        List<WishlistItem> items = wishlistRepository.findByUserId(userId);
        List<Product> products = items.stream()
                .map(WishlistItem::getProduct)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<Void> addToWishlist(@RequestParam String userId, @RequestParam Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                WishlistItem item = new WishlistItem();
                item.setUserId(userId);
                item.setProduct(productOpt.get());
                wishlistRepository.save(item);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build(); // Already exists
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<Void> removeFromWishlist(@RequestParam String userId, @RequestParam Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            wishlistRepository.deleteByUserIdAndProductId(userId, productId);
        }
        return ResponseEntity.ok().build();
    }
}
