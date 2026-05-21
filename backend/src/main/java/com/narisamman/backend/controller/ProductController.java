package com.narisamman.backend.controller;

import com.narisamman.backend.model.Product;
import com.narisamman.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // Create a new product (defaults status to PENDING)
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        product.setStatus("PENDING");
        // Ensure emoji is set if missing
        if (product.getEmoji() == null) {
            String cat = product.getCategory();
            if ("food".equalsIgnoreCase(cat)) {
                product.setEmoji("🍯");
            } else if ("textiles".equalsIgnoreCase(cat)) {
                product.setEmoji("🧵");
            } else {
                product.setEmoji("🏺");
            }
        }
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }

    // Get all products or filter by status / artisanId
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String artisanId) {
        
        List<Product> products;
        if (status != null && artisanId != null) {
            products = productRepository.findByStatusAndArtisanId(status, artisanId);
        } else if (status != null) {
            products = productRepository.findByStatus(status);
        } else if (artisanId != null) {
            products = productRepository.findByArtisanId(artisanId);
        } else {
            products = productRepository.findAll();
        }
        return ResponseEntity.ok(products);
    }

    // Get single product
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        return optionalProduct.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Approve product
    @PutMapping("/{id}/approve")
    public ResponseEntity<Product> approveProduct(@PathVariable Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Product product = optionalProduct.get();
        product.setStatus("APPROVED");
        product.setRejectionReason(null);
        Product updated = productRepository.save(product);
        return ResponseEntity.ok(updated);
    }

    // Reject product
    @PutMapping("/{id}/reject")
    public ResponseEntity<Product> rejectProduct(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Product product = optionalProduct.get();
        product.setStatus("REJECTED");
        if (body != null && body.containsKey("reason")) {
            product.setRejectionReason(body.get("reason"));
        } else {
            product.setRejectionReason("Rejected by admin");
        }
        Product updated = productRepository.save(product);
        return ResponseEntity.ok(updated);
    }

    // Update product details
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product details) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Product product = optionalProduct.get();
        product.setName(details.getName());
        product.setCategory(details.getCategory());
        product.setPrice(details.getPrice());
        product.setMrp(details.getMrp());
        product.setUnit(details.getUnit());
        product.setDescription(details.getDescription());
        product.setStock(details.getStock());
        if (details.getImage() != null) {
            product.setImage(details.getImage());
        }
        product.setFssai(details.isFssai());
        product.setGi(details.isGi());
        product.setHandloom(details.isHandloom());
        product.setNabard(details.isNabard());
        product.setTags(details.getTags());
        product.setStatus("PENDING"); // Reset to PENDING for admin review when edited
        Product updated = productRepository.save(product);
        return ResponseEntity.ok(updated);
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        productRepository.delete(optionalProduct.get());
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }
}
