# Backend Connection Guide

This guide explains how to connect the mobile app to the Spring Boot backend.

## API Configuration

The API base URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8080/api'  // Development
  : 'https://api.sanjaycommunications.com';  // Production
```

## Setting Up for Different Environments

### 1. iOS Simulator
- Use: `http://localhost:8080/api`
- Already configured in the code

### 2. Android Emulator
- Change to: `http://10.0.2.2:8080/api`
- Update `src/services/api.js`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:8080/api'  // Android Emulator
  : 'https://api.sanjaycommunications.com';
```

### 3. Physical Device
- Find your computer's IP address:
  - Mac/Linux: `ifconfig | grep "inet "`
  - Windows: `ipconfig`
- Use: `http://YOUR_IP:8080/api`
- Example: `http://192.168.1.100:8080/api`
- Update `src/services/api.js` with your IP

## Starting the Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Start MySQL (or use H2 for development):
   ```bash
   # For MySQL
   # Make sure MySQL is running and database is created
   
   # For H2 (development)
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

3. Backend will start on `http://localhost:8080`

## Testing the Connection

1. Start the backend server
2. Start the mobile app
3. Try logging in or browsing products
4. Check the console for any API errors

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products/services` - Get all services
- `GET /api/products/services/{id}/categories` - Get categories
- `GET /api/products/categories/{id}/brands` - Get brands
- `GET /api/products/brands/{id}/models` - Get models
- `GET /api/products/models/{id}/product` - Get product details
- `GET /api/products/search?q={query}` - Search products

### Cart
- `GET /api/cart/{userId}` - Get cart items
- `POST /api/cart/{userId}/add?productId={id}&quantity={qty}` - Add to cart
- `PUT /api/cart/{userId}/items/{id}?quantity={qty}` - Update cart
- `DELETE /api/cart/{userId}/items/{id}` - Remove from cart
- `DELETE /api/cart/{userId}/clear` - Clear cart

### Orders
- `GET /api/orders/{userId}` - Get user orders
- `POST /api/orders/{userId}/create` - Create order

## Troubleshooting

### Connection Refused
- Make sure backend is running
- Check if port 8080 is available
- Verify firewall settings

### CORS Errors
- Backend has CORS enabled for all origins
- If issues persist, check `SecurityConfig.java`

### Network Error on Physical Device
- Ensure phone and computer are on same WiFi network
- Check computer's firewall allows port 8080
- Verify IP address is correct

### Authentication Issues
- Make sure user is registered first
- Check backend logs for errors
- Verify password encoding is working

## Next Steps

1. Add sample data to database
2. Test all API endpoints
3. Implement JWT authentication (optional)
4. Add error handling improvements
5. Add loading states

## Support

For issues, check:
- Backend logs in console
- Mobile app console for errors
- Network tab in React Native debugger
