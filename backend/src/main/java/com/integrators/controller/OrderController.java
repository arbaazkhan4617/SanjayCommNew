package com.integrators.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.integrators.dto.OrderDTO;
import com.integrators.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@GetMapping("/{userId}")
	public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable Long userId) {
		return ResponseEntity.ok(orderService.getUserOrders(userId));
	}

	@GetMapping("/{userId}/{orderId}")
	public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long userId, @PathVariable Long orderId) {
		return ResponseEntity.ok(orderService.getOrderById(orderId, userId));
	}

	@PostMapping("/{userId}/create")
	public ResponseEntity<OrderDTO> createOrder(@PathVariable Long userId, @RequestParam String shippingAddress,
			@RequestParam String paymentMethod) {
		return ResponseEntity.ok(orderService.createOrder(userId, shippingAddress, paymentMethod));
	}
}
