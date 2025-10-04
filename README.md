# AfyaLink - Comprehensive e-Referral Health System

A full-stack, multi-language healthcare referral management system built with microservices architecture for secure, scalable, and compliant healthcare operations.

## 🏥 System Overview

AfyaLink is a comprehensive healthcare platform that enables seamless referral management between healthcare providers, facilities, and patients. The system supports multiple user roles, real-time communication, comprehensive audit logging, and enterprise-grade security.

## 🏗️ Architecture

### Multi-Language Microservices Architecture

- **Authentication Service** (Go) - High-performance JWT authentication with 2FA
- **Patient Service** (Python/Django) - Complex healthcare data management
- **Referral Service** (Node.js) - Workflow management and status tracking
- **Facility Service** (Go) - Healthcare facility directory with search
- **Messaging Service** (Node.js) - Real-time communication with Socket.io
- **Audit Service** (Go) - Comprehensive compliance and activity tracking
- **API Gateway** (Node.js) - Request routing and rate limiting

### Technology Stack

#### Backend Services
- **Go** - High-performance services (Auth, Facility, Audit)
- **Node.js/Express** - API services (Referral, Messaging, Gateway)
- **Python/Django** - Healthcare logic and data processing
- **PostgreSQL** - Primary database for healthcare data
- **Redis** - Caching and session management
- **Socket.io** - Real-time communication

#### Frontend Applications
- **React.js + TypeScript** - Main healthcare provider interface
- **Vue.js + TypeScript** - Specialized dashboards
- **React Native** - Mobile applications
- **Angular** - Admin portal

#### Infrastructure
- **Docker + Kubernetes** - Containerization and orchestration
- **Prometheus + Grafana** - Monitoring and metrics
- **Elasticsearch** - Full-text search capabilities

## 🚀 Features

### Core Functionality
- ✅ **Multi-Role Authentication** - Admin, Doctor, Nurse, Specialist roles
- ✅ **Two-Factor Authentication** - Email/SMS verification
- ✅ **Patient Management** - Comprehensive patient records with consent
- ✅ **Referral Workflow** - Create, track, and manage referrals
- ✅ **Facility Directory** - Search and filter healthcare facilities
- ✅ **Real-time Messaging** - Secure communication between providers
- ✅ **Audit Logging** - Comprehensive activity tracking
- ✅ **Compliance Reporting** - HIPAA and healthcare compliance

### Security Features
- 🔒 **JWT Authentication** with role-based access control
- 🔒 **Data Encryption** for sensitive medical information
- 🔒 **Input Validation** and sanitization
- 🔒 **Rate Limiting** and DDoS protection
- 🔒 **Audit Trails** for all system activities
- 🔒 **Secure File Upload** for medical documents

### Advanced Features
- 📊 **Real-time Notifications** for referral updates
- 📊 **Analytics Dashboard** for healthcare metrics
- 📊 **Mobile Applications** for on-the-go access
- 📊 **API Documentation** with Swagger/OpenAPI
- 📊 **Data Export** capabilities for reporting
- 📊 **Multi-language Support** for diverse healthcare settings

## 📋 Prerequisites

- **Docker & Docker Compose** - For containerized deployment
- **Node.js 18+** - For Node.js services
- **Python 3.9+** - For Python services
- **Go 1.21+** - For Go services
- **PostgreSQL 13+** - Primary database
- **Redis 6+** - Caching and sessions

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd afyalink
```

### 2. Environment Configuration
Create environment files for each service:

```bash
# Auth Service
cp afyalink/auth-service/.env.example afyalink/auth-service/.env

# Patient Service
cp afyalink/patient-service/.env.example afyalink/patient-service/.env

# Referral Service
cp afyalink/referral-service/.env.example afyalink/referral-service/.env

# Facility Service
cp afyalink/facility-service/.env.example afyalink/facility-service/.env

# Messaging Service
cp afyalink/messaging-service/.env.example afyalink/messaging-service/.env

# Audit Service
cp afyalink/audit-service/.env.example afyalink/audit-service/.env

# API Gateway
cp afyalink/api-gateway/.env.example afyalink/api-gateway/.env
```

### 3. Docker Deployment (Recommended)
```bash
# Start all services
docker-compose up -d

# View service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]
```

### 4. Manual Installation
```bash
# Install Go dependencies
cd afyalink/auth-service && go mod tidy
cd afyalink/facility-service && go mod tidy
cd afyalink/audit-service && go mod tidy

# Install Node.js dependencies
cd afyalink/referral-service && npm install
cd afyalink/messaging-service && npm install
cd afyalink/api-gateway && npm install

# Install Python dependencies
cd afyalink/patient-service && pip install -r requirements.txt
```

## 🚀 Running the Services

### Development Mode
```bash
# Start all services concurrently
# Auth Service (Go)
cd afyalink/auth-service && go run main.go server.go

# Facility Service (Go)
cd afyalink/facility-service && go run main.go

# Audit Service (Go)
cd afyalink/audit-service && go run main.go

# Referral Service (Node.js)
cd afyalink/referral-service && npm run dev

# Messaging Service (Node.js)
cd afyalink/messaging-service && npm run dev

# Patient Service (Python)
cd afyalink/patient-service && python manage.py runserver

# API Gateway (Node.js)
cd afyalink/api-gateway && npm run dev
```

### Production Mode
```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or build and run individually
# Auth Service
cd afyalink/auth-service && go build -o auth-service && ./auth-service

# Facility Service
cd afyalink/facility-service && go build -o facility-service && ./facility-service

# Audit Service
cd afyalink/audit-service && go build -o audit-service && ./audit-service
```

## 🌐 API Endpoints

### Authentication Service (Port 8081)
- `GET /health` - Health check
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/verify-2fa` - 2FA verification
- `POST /api/v1/auth/refresh` - Token refresh

### Patient Service (Port 8080)
- `GET /health` - Health check
- `GET /api/v1/patients` - List patients
- `POST /api/v1/patients` - Create patient
- `GET /api/v1/patients/{id}` - Get patient details
- `PUT /api/v1/patients/{id}` - Update patient
- `GET /api/v1/medical-records` - Medical records
- `POST /api/v1/consents` - Manage patient consents

### Referral Service (Port 8083)
- `GET /health` - Health check
- `GET /referrals` - List referrals
- `POST /referrals` - Create referral
- `GET /referrals/{id}` - Get referral details
- `PUT /referrals/{id}/status` - Update referral status

### Facility Service (Port 8082)
- `GET /health` - Health check
- `GET /api/v1/facilities` - List facilities
- `POST /api/v1/facilities` - Create facility
- `GET /api/v1/facilities/{id}` - Get facility details
- `POST /api/v1/facilities/search` - Search facilities

### Messaging Service (Port 8084)
- `GET /health` - Health check
- `GET /conversations` - User conversations
- `GET /messages/{conversationId}` - Conversation messages
- `POST /messages` - Send message
- `WebSocket /socket.io/*` - Real-time messaging

### Audit Service (Port 8085)
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics
- `GET /api/v1/audit/logs` - Audit logs
- `POST /api/v1/audit/logs` - Create audit log
- `GET /api/v1/audit/compliance-report` - Compliance reports

## 🔧 Configuration

### Environment Variables

#### Global Settings
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://user:password@localhost:5432/afyalink
REDIS_URL=redis://localhost:6379
```

#### Service-Specific Settings
```env
# Auth Service
AUTH_SERVICE_PORT=8081
BCRYPT_ROUNDS=12

# Patient Service
PATIENT_SERVICE_PORT=8080
MAX_FILE_SIZE=10MB

# Referral Service
REFERRAL_SERVICE_PORT=8083
DEFAULT_REFERRAL_URGENCY=medium

# Messaging Service
MESSAGING_SERVICE_PORT=8084
MAX_MESSAGE_LENGTH=5000

# Facility Service
FACILITY_SERVICE_PORT=8082
ELASTICSEARCH_URL=http://localhost:9200

# Audit Service
AUDIT_SERVICE_PORT=8085
AUDIT_RETENTION_DAYS=2555
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific service tests
cd afyalink/referral-service && npm test
cd afyalink/messaging-service && npm test

# Run Python tests
cd afyalink/patient-service && python manage.py test

# Run Go tests
cd afyalink/auth-service && go test ./...
cd afyalink/facility-service && go test ./...
cd afyalink/audit-service && go test ./...
```

### Test Coverage
- Unit tests for all services
- Integration tests for API endpoints
- Security testing and penetration testing
- Performance testing with load testing
- End-to-end testing for critical workflows

## 📱 Frontend Applications

### Web Application (React.js)
```bash
cd frontend/web-app
npm install
npm start
```

### Admin Portal (Angular)
```bash
cd frontend/admin-portal
npm install
npm start
```

### Mobile Application (React Native)
```bash
cd frontend/mobile-app
npm install
npm run ios  # or npm run android
```

## 📊 Monitoring & Analytics

### Health Monitoring
- **Prometheus** - Metrics collection
- **Grafana** - Dashboard visualization
- **Health Checks** - Service availability monitoring

### Logging
- **Structured Logging** - JSON format across all services
- **Centralized Logging** - ELK stack integration
- **Audit Trails** - Comprehensive activity tracking

### Performance Monitoring
- **Response Times** - API performance metrics
- **Error Rates** - Service error tracking
- **Resource Usage** - CPU, memory, disk monitoring

## 🔒 Security

### Authentication & Authorization
- JWT tokens with short expiration times
- Role-based access control (RBAC)
- Two-factor authentication (2FA)
- Session management and timeout

### Data Protection
- End-to-end encryption for sensitive data
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Compliance
- HIPAA compliance for healthcare data
- GDPR compliance for data protection
- Audit logging for regulatory requirements
- Data retention policies

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database connectivity
   docker-compose exec postgres psql -U postgres -d afyalink
   ```

2. **Service Dependencies**
   ```bash
   # Ensure all services are running
   docker-compose ps
   # Restart specific service
   docker-compose restart [service-name]
   ```

3. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :808
   # Use different ports in .env files
   ```

### Debug Mode
Enable debug logging by setting:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- **Email**: support@afyalink.com
- **Documentation**: [docs.afyalink.com](https://docs.afyalink.com)
- **Issues**: [GitHub Issues](https://github.com/afyalink/issues)

## 🙏 Acknowledgments

- Healthcare professionals who provided domain expertise
- Open source community for excellent tools and libraries
- Development team for their dedication and hard work

---

**AfyaLink** - Connecting healthcare, improving lives. 🏥💙