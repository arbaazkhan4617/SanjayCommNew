# Integrators Backend API

Spring Boot REST API backend for the Integrators mobile application.

## Tech Stack

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Data JPA**: For database operations
- **MySQL**: Production database
- **H2**: Development/Testing database
- **Lombok**: For reducing boilerplate code
- **Maven**: Build tool

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/integrators/
│   │   │   ├── entity/          # JPA Entities
│   │   │   ├── repository/      # Data Access Layer
│   │   │   ├── service/         # Business Logic Layer
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   └── config/          # Configuration Classes
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Database Schema

The application uses a hierarchical structure:
- **Services** → **Product Categories** → **Brands** → **Models** → **Products** (with Specifications & Price)

### Entities:
- `Service` - Main service categories (CCTV, Fire Alarms, etc.)
- `ProductCategory` - Categories under services (IP Cameras, Analog Cameras, etc.)
- `Brand` - Brands under categories (Hikvision, Dahua, etc.)
- `Model` - Models under brands (DS-2CD2043G0-I, etc.)
- `Product` - Products with specifications and prices
- `User` - User accounts
- `CartItem` - Shopping cart items
- `Order` - Customer orders
- `OrderItem` - Order line items

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (for production)
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure Database**
   
   For MySQL (Production):
   - Update `src/main/resources/application.properties`
   - Set your MySQL username and password
   - Create database: `CREATE DATABASE integrators_db;`

   For H2 (Development):
   - Use `application-dev.properties` profile
   - H2 runs in-memory, no setup needed

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   
   Or run `IntegratorsApplication.java` from your IDE

5. **Access the API**
   - API Base URL: `http://localhost:8080/api`
   - H2 Console (dev): `http://localhost:8080/h2-console`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products/services` - Get all services
- `GET /api/products/services/{id}` - Get service by ID
- `GET /api/products/services/{serviceId}/categories` - Get categories by service
- `GET /api/products/categories/{categoryId}/brands` - Get brands by category
- `GET /api/products/brands/{brandId}/models` - Get models by brand
- `GET /api/products/models/{modelId}/product` - Get product by model
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products` - Get all products

### Cart
- `GET /api/cart/{userId}` - Get user's cart items
- `POST /api/cart/{userId}/add?productId={id}&quantity={qty}` - Add to cart
- `PUT /api/cart/{userId}/items/{cartItemId}?quantity={qty}` - Update cart item
- `DELETE /api/cart/{userId}/items/{cartItemId}` - Remove from cart
- `DELETE /api/cart/{userId}/clear` - Clear cart

### Orders
- `GET /api/orders/{userId}` - Get user's orders
- `GET /api/orders/{userId}/{orderId}` - Get order by ID
- `POST /api/orders/{userId}/create?shippingAddress={addr}&paymentMethod={method}` - Create order

## Example API Calls

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+91-9179500312"
  }'
```

### Get All Services
```bash
curl http://localhost:8080/api/products/services
```

### Get Categories by Service
```bash
curl http://localhost:8080/api/products/services/1/categories
```

### Search Products
```bash
curl http://localhost:8080/api/products/search?q=cctv
```

## Development

### Running with Different Profiles

**Development (H2 Database):**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Production (MySQL):**
```bash
mvn spring-boot:run
```

### Database Migrations

The application uses JPA auto-update (`spring.jpa.hibernate.ddl-auto=update`). 
For production, consider using Flyway or Liquibase for migrations.

## Testing

Run tests:
```bash
mvn test
```

## Integration with Mobile App

Update the mobile app's API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

For Android emulator, use: `http://10.0.2.2:8080/api`
For iOS simulator, use: `http://localhost:8080/api`
For physical device, use your computer's IP: `http://192.168.x.x:8080/api`

## CORS Configuration

CORS is enabled for all origins in development. For production, update `SecurityConfig.java` to restrict origins.

## Security Notes

- Currently, authentication is basic (email/password)
- Passwords are encrypted using BCrypt
- For production, implement JWT tokens
- Add role-based access control if needed

## Next Steps

1. Add JWT authentication
2. Add image upload functionality
3. Add email notifications
4. Add payment gateway integration
5. Add order tracking
6. Add product reviews and ratings
7. Add admin panel APIs

## Support

For issues or questions, contact:
- Email: sales@sanjaycomm.com
- Phone: +91-9179500312

---

**Built with Spring Boot for Integrators Mobile App**
