package com.integrators.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
	private Long id;
	private List<OrderItemDTO> orderItems;
	private BigDecimal total;
	private String status;
	private String shippingAddress;
	private String paymentMethod;
	private LocalDateTime createdAt;

	public static class OrderItemDTO {
		private Long id;
		private ProductDTO product;
		private Integer quantity;
		private BigDecimal price;

		// Constructors
		public OrderItemDTO() {
		}

		public OrderItemDTO(Long id, ProductDTO product, Integer quantity, BigDecimal price) {
			this.id = id;
			this.product = product;
			this.quantity = quantity;
			this.price = price;
		}

		// Getters and Setters
		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public ProductDTO getProduct() {
			return product;
		}

		public void setProduct(ProductDTO product) {
			this.product = product;
		}

		public Integer getQuantity() {
			return quantity;
		}

		public void setQuantity(Integer quantity) {
			this.quantity = quantity;
		}

		public BigDecimal getPrice() {
			return price;
		}

		public void setPrice(BigDecimal price) {
			this.price = price;
		}

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<OrderItemDTO> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<OrderItemDTO> orderItems) {
		this.orderItems = orderItems;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getShippingAddress() {
		return shippingAddress;
	}

	public void setShippingAddress(String shippingAddress) {
		this.shippingAddress = shippingAddress;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	// Constructors
	public OrderDTO() {
	}

	public OrderDTO(Long id, List<OrderItemDTO> orderItems, BigDecimal total, String status, String shippingAddress,
			String paymentMethod, LocalDateTime createdAt) {
		this.id = id;
		this.orderItems = orderItems;
		this.total = total;
		this.status = status;
		this.shippingAddress = shippingAddress;
		this.paymentMethod = paymentMethod;
		this.createdAt = createdAt;
	}

}
