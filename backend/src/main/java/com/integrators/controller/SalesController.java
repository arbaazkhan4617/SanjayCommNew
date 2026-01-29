package com.integrators.controller;

import com.integrators.dto.OrderDTO;
import com.integrators.dto.ProductDTO;
import com.integrators.dto.ServiceRequestDTO;
import com.integrators.entity.Order;
import com.integrators.entity.Product;
import com.integrators.entity.ServiceRequest;
import com.integrators.repository.OrderRepository;
import com.integrators.repository.ServiceRequestRepository;
import com.integrators.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SalesController {
    private final OrderRepository orderRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;

    public SalesController(OrderRepository orderRepository, ServiceRequestRepository serviceRequestRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<Order> allOrders = orderRepository.findAll();
        List<ServiceRequest> allServiceRequests = serviceRequestRepository.findAll();

        // Calculate total revenue
        BigDecimal totalRevenue = allOrders.stream()
                .map(Order::getTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate today's revenue
        BigDecimal todayRevenue = allOrders.stream()
                .filter(order -> order.getCreatedAt() != null && 
                        order.getCreatedAt().toLocalDate().equals(LocalDate.now()))
                .map(Order::getTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Count orders by status
        long pendingOrders = allOrders.stream()
                .filter(order -> order.getStatus() != null && "PENDING".equals(order.getStatus().name()))
                .count();
        long completedOrders = allOrders.stream()
                .filter(order -> order.getStatus() != null && "COMPLETED".equals(order.getStatus().name()))
                .count();

        // Count service requests by status
        long pendingServiceRequests = allServiceRequests.stream()
                .filter(request -> "PENDING".equals(request.getStatus()))
                .count();
        long inProgressServiceRequests = allServiceRequests.stream()
                .filter(request -> "IN_PROGRESS".equals(request.getStatus()))
                .count();
        long completedServiceRequests = allServiceRequests.stream()
                .filter(request -> "COMPLETED".equals(request.getStatus())
                        || "RESOLVED".equals(request.getStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("todayRevenue", todayRevenue);
        stats.put("totalOrders", allOrders.size());
        stats.put("pendingOrders", pendingOrders);
        stats.put("completedOrders", completedOrders);
        stats.put("totalServiceRequests", allServiceRequests.size());
        stats.put("pendingServiceRequests", pendingServiceRequests);
        stats.put("inProgressServiceRequests", inProgressServiceRequests);
        stats.put("completedServiceRequests", completedServiceRequests);
        stats.put("totalCustomers", userRepository.count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/dashboard/revenue-chart")
    public ResponseEntity<Map<String, Object>> getRevenueChart(@RequestParam(defaultValue = "7") int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);

        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> order.getCreatedAt() != null)
                .filter(order -> {
                    LocalDate orderDate = order.getCreatedAt().toLocalDate();
                    return !orderDate.isBefore(startDate) && !orderDate.isAfter(endDate);
                })
                .collect(Collectors.toList());

        Map<String, BigDecimal> dailyRevenue = new LinkedHashMap<>();
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            final LocalDate date = currentDate;
            BigDecimal dayRevenue = orders.stream()
                    .filter(order -> order.getCreatedAt().toLocalDate().equals(date))
                    .map(Order::getTotal)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dailyRevenue.put(date.format(DateTimeFormatter.ofPattern("MMM dd")), dayRevenue);
            currentDate = currentDate.plusDays(1);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", new ArrayList<>(dailyRevenue.keySet()));
        response.put("data", dailyRevenue.values().stream()
                .map(BigDecimal::doubleValue)
                .collect(Collectors.toList()));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard/orders-chart")
    public ResponseEntity<Map<String, Object>> getOrdersChart(@RequestParam(defaultValue = "7") int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);

        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> order.getCreatedAt() != null)
                .filter(order -> {
                    LocalDate orderDate = order.getCreatedAt().toLocalDate();
                    return !orderDate.isBefore(startDate) && !orderDate.isAfter(endDate);
                })
                .collect(Collectors.toList());

        Map<String, Long> dailyOrders = new LinkedHashMap<>();
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            final LocalDate date = currentDate;
            long dayOrders = orders.stream()
                    .filter(order -> order.getCreatedAt().toLocalDate().equals(date))
                    .count();
            dailyOrders.put(date.format(DateTimeFormatter.ofPattern("MMM dd")), dayOrders);
            currentDate = currentDate.plusDays(1);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", new ArrayList<>(dailyOrders.keySet()));
        response.put("data", new ArrayList<>(dailyOrders.values()));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard/service-requests-chart")
    public ResponseEntity<Map<String, Object>> getServiceRequestsChart(@RequestParam(defaultValue = "7") int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);

        List<ServiceRequest> requests = serviceRequestRepository.findAll().stream()
                .filter(request -> request.getCreatedAt() != null)
                .filter(request -> {
                    LocalDate requestDate = request.getCreatedAt().toLocalDate();
                    return !requestDate.isBefore(startDate) && !requestDate.isAfter(endDate);
                })
                .collect(Collectors.toList());

        Map<String, Long> dailyRequests = new LinkedHashMap<>();
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            final LocalDate date = currentDate;
            long dayRequests = requests.stream()
                    .filter(request -> request.getCreatedAt().toLocalDate().equals(date))
                    .count();
            dailyRequests.put(date.format(DateTimeFormatter.ofPattern("MMM dd")), dayRequests);
            currentDate = currentDate.plusDays(1);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", new ArrayList<>(dailyRequests.keySet()));
        response.put("data", new ArrayList<>(dailyRequests.values()));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sortBy) {
        List<Order> orders = orderRepository.findAll();

        if (status != null && !status.isEmpty()) {
            orders = orders.stream()
                    .filter(order -> order.getStatus() != null && status.equals(order.getStatus().name()))
                    .collect(Collectors.toList());
        }

        if ("date".equals(sortBy)) {
            orders.sort((a, b) -> {
                if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });
        } else if ("amount".equals(sortBy)) {
            orders.sort((a, b) -> {
                if (a.getTotal() == null || b.getTotal() == null) return 0;
                return b.getTotal().compareTo(a.getTotal());
            });
        }

        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping("/service-requests")
    public ResponseEntity<List<ServiceRequestDTO>> getAllServiceRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sortBy) {
        List<ServiceRequest> requests = serviceRequestRepository.findAll();

        if (status != null && !status.isEmpty()) {
            requests = requests.stream()
                    .filter(request -> status.equals(request.getStatus()))
                    .collect(Collectors.toList());
        }

        if ("date".equals(sortBy)) {
            requests.sort((a, b) -> {
                if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });
        }

        List<ServiceRequestDTO> requestDTOs = requests.stream()
                .map(this::convertToServiceRequestDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(requestDTOs);
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(orderStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + status);
        }
        order = orderRepository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order status updated successfully");
        response.put("data", convertToOrderDTO(order));

        return ResponseEntity.ok(response);
    }

    @PutMapping("/service-requests/{requestId}/status")
    public ResponseEntity<Map<String, Object>> updateServiceRequestStatus(
            @PathVariable Long requestId,
            @RequestParam String status) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Service request not found"));

        request.setStatus(status);
        request = serviceRequestRepository.save(request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Service request status updated successfully");
        response.put("data", convertToServiceRequestDTO(request));

        return ResponseEntity.ok(response);
    }

    private OrderDTO convertToOrderDTO(Order order) {
        List<OrderDTO.OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(item -> {
                    Product product = item.getProduct();
                    ProductDTO productDTO = new ProductDTO(
                            product.getId(),
                            product.getName(),
                            product.getDescription(),
                            product.getPrice(),
                            product.getOriginalPrice(),
                            product.getInStock(),
                            product.getRating(),
                            product.getReviews(),
                            product.getModel() != null ? product.getModel().getId() : null,
                            product.getSpecifications()
                    );
                    return new OrderDTO.OrderItemDTO(item.getId(), productDTO, item.getQuantity(), item.getPrice());
                })
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                orderItemDTOs,
                order.getTotal(),
                order.getStatus() != null ? order.getStatus().name() : "PENDING",
                order.getShippingAddress(),
                order.getPaymentMethod(),
                order.getCreatedAt()
        );
    }

    private ServiceRequestDTO convertToServiceRequestDTO(ServiceRequest request) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        dto.setId(request.getId());
        dto.setUserId(request.getUser().getId());
        dto.setUserName(request.getUser().getName());
        dto.setSubject(request.getSubject());
        dto.setDescription(request.getDescription());
        dto.setStatus(request.getStatus());
        dto.setContactName(request.getContactName());
        dto.setContactPhone(request.getContactPhone());
        dto.setContactEmail(request.getContactEmail());
        dto.setAddress(request.getAddress());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        
        if (request.getCategory() != null) {
            dto.setCategoryId(request.getCategory().getId());
            dto.setCategoryName(request.getCategory().getName());
        }
        
        if (request.getSubCategory() != null) {
            dto.setSubCategoryId(request.getSubCategory().getId());
            dto.setSubCategoryName(request.getSubCategory().getName());
        }
        
        return dto;
    }
}
