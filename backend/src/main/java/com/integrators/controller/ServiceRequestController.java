package com.integrators.controller;

import com.integrators.dto.CreateServiceRequestDTO;
import com.integrators.dto.ServiceRequestDTO;
import com.integrators.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service-requests")
@CrossOrigin(origins = "*")
public class ServiceRequestController {
    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ServiceRequestDTO>> getUserServiceRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(serviceRequestService.getUserServiceRequests(userId));
    }

    @GetMapping("/{userId}/{requestId}")
    public ResponseEntity<ServiceRequestDTO> getServiceRequestById(
            @PathVariable Long userId,
            @PathVariable Long requestId) {
        return ResponseEntity.ok(serviceRequestService.getServiceRequestById(requestId, userId));
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createServiceRequest(
            @Valid @RequestBody CreateServiceRequestDTO dto) {
        try {
            ServiceRequestDTO request = serviceRequestService.createServiceRequest(dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Service request created successfully",
                    "data", request
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long requestId,
            @RequestParam String status) {
        try {
            ServiceRequestDTO request = serviceRequestService.updateServiceRequestStatus(requestId, status);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Status updated successfully",
                    "data", request
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
