package com.integrators.service;

import com.integrators.dto.CreateServiceRequestDTO;
import com.integrators.dto.ServiceRequestDTO;
import com.integrators.entity.ProductCategory;
import com.integrators.entity.ServiceRequest;
import com.integrators.entity.User;
import com.integrators.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {
    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ProductCategoryRepository categoryRepository;

    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository, UserRepository userRepository, ServiceRepository serviceRepository, ProductCategoryRepository categoryRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ServiceRequestDTO> getUserServiceRequests(Long userId) {
        return serviceRequestRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ServiceRequestDTO getServiceRequestById(Long id, Long userId) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service request not found"));
        
        if (!request.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to service request");
        }
        
        return convertToDTO(request);
    }

    @Transactional
    public ServiceRequestDTO createServiceRequest(CreateServiceRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceRequest request = new ServiceRequest();
        request.setUser(user);
        request.setSubject(dto.getSubject());
        request.setDescription(dto.getDescription());
        request.setContactName(dto.getContactName());
        request.setContactPhone(dto.getContactPhone());
        request.setContactEmail(dto.getContactEmail());
        request.setAddress(dto.getAddress());
        request.setStatus("PENDING");

        if (dto.getServiceId() != null) {
            com.integrators.entity.Service service = serviceRepository.findById(dto.getServiceId())
                    .orElse(null);
            request.setService(service);
        }

        if (dto.getCategoryId() != null) {
            ProductCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElse(null);
            request.setCategory(category);
        }

        request = serviceRequestRepository.save(request);
        return convertToDTO(request);
    }

    @Transactional
    public ServiceRequestDTO updateServiceRequestStatus(Long id, String status) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service request not found"));
        
        request.setStatus(status);
        request = serviceRequestRepository.save(request);
        return convertToDTO(request);
    }

    private ServiceRequestDTO convertToDTO(ServiceRequest request) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        dto.setId(request.getId());
        dto.setUserId(request.getUser().getId());
        dto.setUserName(request.getUser().getName());
        dto.setSubject(request.getSubject());
        dto.setDescription(request.getDescription());
        dto.setContactName(request.getContactName());
        dto.setContactPhone(request.getContactPhone());
        dto.setContactEmail(request.getContactEmail());
        dto.setAddress(request.getAddress());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());

        if (request.getService() != null) {
            dto.setServiceId(request.getService().getId());
            dto.setServiceName(request.getService().getName());
        }

        if (request.getCategory() != null) {
            dto.setCategoryId(request.getCategory().getId());
            dto.setCategoryName(request.getCategory().getName());
        }

        return dto;
    }
}
