package com.narisamman.backend.controller;

import com.narisamman.backend.model.CustomerOrder;
import com.narisamman.backend.model.OrderItem;
import com.narisamman.backend.repository.CustomerOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class CustomerOrderController {

    @Autowired
    private CustomerOrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<CustomerOrder> placeOrder(@RequestBody CustomerOrder order) {
        // Link items back to the order for JPA cascade
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setCustomerOrder(order);
            }
        }
        
        CustomerOrder savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping
    public ResponseEntity<List<CustomerOrder>> getOrders(@RequestParam(required = false) String userId) {
        List<CustomerOrder> orders;
        if (userId != null) {
            orders = orderRepository.findByUserIdOrderByDateDesc(userId);
        } else {
            orders = orderRepository.findAll();
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerOrder> getOrderById(@PathVariable Long id) {
        Optional<CustomerOrder> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
