# Integrators Mobile App

E-commerce mobile application for Integrators (Sanjay Communications) built with React Native (Expo) and Spring Boot backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- Expo CLI
- MySQL 8.0+

### Local Development

#### Backend
```bash
cd backend
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

#### Mobile App
```bash
npm install
npx expo start
```

Scan QR code with Expo Go app.

## 📱 Features

- User Authentication (Login/Register)
- Product Browsing (Services → Categories → Brands → Models)
- Product Search
- Shopping Cart
- Order Management
- Order History

## 🏗️ Architecture

- **Frontend**: React Native (Expo SDK 54)
- **Backend**: Spring Boot 3.2.0
- **Database**: MySQL
- **State Management**: Context API
- **Navigation**: React Navigation v7

## 📦 Deployment

### Backend to Railway
See `DEPLOYMENT.md` or `QUICK_DEPLOY.md` for detailed instructions.

Quick steps:
1. Push code to GitHub
2. Deploy from Railway dashboard
3. Add MySQL database
4. Set `SPRING_PROFILES_ACTIVE=prod`

### Mobile App to Expo
```bash
expo login
expo publish
```

Or use EAS for production builds:
```bash
eas build --platform android
```

## 🔧 Configuration

### API Configuration
Update `src/utils/apiConfig.js` with your Railway backend URL:
```javascript
return 'https://your-app.railway.app/api';
```

### Environment Variables
Create `.env` file:
```
EXPO_PUBLIC_API_URL=https://your-app.railway.app/api
```

## 📚 Documentation

- `DEPLOYMENT.md` - Detailed deployment guide
- `QUICK_DEPLOY.md` - Quick 5-minute deployment
- `DEPLOY_CHECKLIST.md` - Deployment checklist
- `TROUBLESHOOTING.md` - Common issues and solutions

## 🧪 Testing

### Default Test Credentials
- **Email**: `admin@integrators.com`
- **Password**: `admin123`

### Test Backend
```bash
curl http://localhost:8080/api/products/services
```

## 📂 Project Structure

```
SanjayCommNew/
├── backend/                 # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── application.properties
├── src/                     # React Native app
│   ├── screens/
│   ├── components/
│   ├── context/
│   └── services/
├── app.json                # Expo configuration
└── package.json           # Node dependencies
```

## 🛠️ Development

### Backend Endpoints
- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/products/services` - Get all services
- `/api/products/services/{id}/categories` - Get categories
- `/api/cart/{userId}` - Get user cart
- `/api/orders/{userId}` - Get user orders

### Mobile App Screens
- Login/Register
- Home (Services)
- Product Categories
- Brands
- Models
- Product Details
- Cart
- Checkout
- Orders

## 📝 License

Private - Integrators (Sanjay Communications)

## 👥 Support

For issues or questions, refer to:
- `TROUBLESHOOTING.md`
- `DEPLOYMENT.md`
- Railway logs
- Expo logs

---

**Built with ❤️ for Integrators**
