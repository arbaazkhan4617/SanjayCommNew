# Use Maven and JDK 17 for building
FROM nixos/nix:latest AS builder

WORKDIR /app

# Install Maven and JDK 17 using Nix
RUN nix-env -iA nixpkgs.maven nixpkgs.jdk17

# Copy backend source
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

# Build the application
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built JAR
COPY --from=builder /app/backend/target/integrators-backend-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/products/services || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
