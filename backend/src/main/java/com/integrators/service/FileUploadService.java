package com.integrators.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Image service base URL (e.g. https://image-service.railway.app).
     * When set, uploads are forwarded to this service instead of saving locally.
     */
    @Value("${app.image-service.url:}")
    private String imageServiceUrl;

    /**
     * Image service upload path (e.g. /upload or /api/upload).
     */
    @Value("${app.image-service.upload-path:/upload}")
    private String imageServiceUploadPath;

    private final RestTemplate restTemplate = new RestTemplate();

    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // If image-service is configured, forward upload to it
        if (imageServiceUrl != null && !imageServiceUrl.isBlank()) {
            return uploadToImageService(file);
        }

        // Otherwise save locally
        return uploadLocally(file);
    }

    /**
     * Forward the file to the Railway image-service and return the URL from the response.
     */
    private String uploadToImageService(MultipartFile file) throws IOException {
        String uploadUrl = imageServiceUrl.replaceAll("/$", "") + imageServiceUploadPath;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new MultipartFileResource(file));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                uploadUrl,
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> resp = response.getBody();
            if (resp.containsKey("imageUrl") && resp.get("imageUrl") != null) {
                return (String) resp.get("imageUrl");
            }
            if (resp.containsKey("url") && resp.get("url") != null) {
                return (String) resp.get("url");
            }
        }
        throw new IOException("Image service did not return a valid URL. Check " + uploadUrl + " response format (expected 'url' or 'imageUrl').");
    }

    private String uploadLocally(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return baseUrl + "/uploads/" + uniqueFilename;
    }

    public void deleteFile(String imageUrl) {
        try {
            if (imageUrl != null && imageServiceUrl != null && !imageServiceUrl.isBlank()
                    && imageUrl.startsWith(imageServiceUrl)) {
                return;
            }
            if (imageUrl != null && imageUrl.contains("/uploads/")) {
                String filename = imageUrl.substring(imageUrl.lastIndexOf("/uploads/") + "/uploads/".length());
                Path filePath = Paths.get(uploadDir, filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            System.err.println("Error deleting file: " + e.getMessage());
        }
    }

    private static class MultipartFileResource extends ByteArrayResource {
        private final String filename;

        MultipartFileResource(MultipartFile file) throws IOException {
            super(file.getBytes());
            this.filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        }

        @Override
        public String getFilename() {
            return filename;
        }
    }
}
