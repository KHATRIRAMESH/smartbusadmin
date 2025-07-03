# SmartBus Admin - Architecture & Implementation Guide

## **Project Overview**
This is a comprehensive admin system for managing school bus transportation with two distinct user roles:
- **Super Admin**: Manages schools and school administrators
- **School Admin**: Manages buses, routes, children, and parents for their assigned school

## **Recommended Architecture Approach**

### **1. Role-Based Dashboard Structure**
```
/                           # Authentication page
/dashboard                  # Super Admin Dashboard
/school-admin/dashboard     # School Admin Dashboard
```

### **2. User Authentication Flow**
- **Unified Login**: Single login form that tries both super admin and school admin endpoints
- **Role-Based Redirects**: Automatically redirects to appropriate dashboard based on user role
- **Session Management**: JWT-based authentication with proper token storage

### **3. Super Admin Features (Priority 1)**
✅ **Completed**:
- School creation and management
- School admin creation (with school selection)
- Dashboard statistics
- School and admin listing

**API Endpoints Needed**:
```
POST /super-admin/login
POST /super-admin/register
POST /super-admin/create-school
POST /super-admin/create-school-admin
GET /super-admin/schools
GET /super-admin/school-admins
GET /super-admin/stats
```

### **4. School Admin Features (Priority 2)**
🔄 **In Progress**:
- Bus management (create, list, edit)
- Route management (create, list, edit)
- Parent management (create, list, edit)
- Child management (create, list, edit)

**API Endpoints Needed**:
```
POST /school-admin/login
GET /school-admin/buses
POST /school-admin/buses
GET /school-admin/routes
POST /school-admin/routes
GET /school-admin/parents
POST /school-admin/parents
GET /school-admin/children
POST /school-admin/children
```

## **Database Schema Recommendations**

### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'school_admin') NOT NULL,
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Schools Table**
```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  contact VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Buses Table**
```sql
CREATE TABLE buses (
  id UUID PRIMARY KEY,
  bus_number VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL,
  driver_name VARCHAR(255) NOT NULL,
  driver_contact VARCHAR(50) NOT NULL,
  school_id UUID REFERENCES schools(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Routes Table**
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_point VARCHAR(255) NOT NULL,
  end_point VARCHAR(255) NOT NULL,
  bus_id UUID REFERENCES buses(id),
  school_id UUID REFERENCES schools(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Parents Table**
```sql
CREATE TABLE parents (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Children Table**
```sql
CREATE TABLE children (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  grade VARCHAR(50) NOT NULL,
  parent_id UUID REFERENCES parents(id),
  school_id UUID REFERENCES schools(id),
  route_id UUID REFERENCES routes(id),
  pickup_location VARCHAR(255),
  drop_location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## **Implementation Priority**

### **Phase 1: Core Authentication & Super Admin (Week 1-2)**
1. ✅ Complete authentication system
2. ✅ Super admin dashboard
3. ✅ School management
4. ✅ School admin creation
5. 🔄 Backend API development

### **Phase 2: School Admin Features (Week 3-4)**
1. 🔄 Bus management system
2. 🔄 Route management system
3. 🔄 Parent management system
4. 🔄 Child management system
5. 🔄 School admin dashboard completion

### **Phase 3: Advanced Features (Week 5-6)**
1. 📋 Route assignment to children
2. 📋 Bus capacity management
3. 📋 Reporting and analytics
4. 📋 Notifications system
5. 📋 Mobile app integration

## **Security Considerations**

### **Authentication & Authorization**
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- School isolation for school admins
- Password hashing with bcrypt
- Session timeout management

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting

## **API Design Patterns**

### **Response Format**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "error": null
}
```

### **Error Handling**
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "error": "Email is required"
}
```

## **Frontend Architecture**

### **State Management**
- Zustand for global state
- React Query for server state
- Local state for component-specific data

### **Component Structure**
```
components/
├── ui/                    # Reusable UI components
├── auth-screen.tsx        # Authentication interface
├── CreateSchool.tsx       # School creation
├── CreateSchoolAdmin.tsx  # Admin creation
├── BusList.tsx           # Bus management
├── RouteList.tsx         # Route management
├── ParentList.tsx        # Parent management
└── ChildList.tsx         # Child management
```

## **Testing Strategy**

### **Frontend Testing**
- Unit tests for components
- Integration tests for user flows
- E2E tests for critical paths

### **Backend Testing**
- Unit tests for API endpoints
- Integration tests for database operations
- Load testing for performance

## **Deployment Considerations**

### **Environment Variables**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

### **Production Setup**
- Docker containerization
- Nginx reverse proxy
- SSL/TLS certificates
- Database backups
- Monitoring and logging

## **Next Steps**

1. **Complete Backend API**: Implement all required endpoints
2. **Finish School Admin Components**: Create remaining CRUD components
3. **Add Form Validation**: Implement proper validation
4. **Error Handling**: Add comprehensive error handling
5. **Testing**: Write tests for all components
6. **Documentation**: Create API documentation
7. **Deployment**: Set up production environment

## **Technology Stack**

### **Frontend**
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- Zustand for state management

### **Backend (Recommended)**
- Node.js with Express
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing
- Joi for validation

### **DevOps**
- Docker
- GitHub Actions for CI/CD
- Vercel for frontend deployment
- Railway/Render for backend deployment

This architecture provides a scalable, secure, and maintainable solution for the SmartBus admin system. 