package com.integrators.service;

import com.integrators.dto.NotificationDTO;
import com.integrators.entity.Notification;
import com.integrators.entity.User;
import com.integrators.repository.NotificationRepository;
import com.integrators.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Page<NotificationDTO> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toDTO);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public NotificationDTO markAsRead(Long notificationId, Long userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        n.setRead(true);
        notificationRepository.save(n);
        return toDTO(n);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged())
                .getContent()
                .forEach(n -> {
                    n.setRead(true);
                    notificationRepository.save(n);
                });
    }

    @Transactional
    public NotificationDTO createForUser(Long userId, String title, String body, String type) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setBody(body);
        n.setType(type != null ? type : "INFO");
        n = notificationRepository.save(n);
        return toDTO(n);
    }

    private NotificationDTO toDTO(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setBody(n.getBody());
        dto.setType(n.getType());
        dto.setRead(n.getRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
