# Codebase Analysis - Sistema de Gestão de Ocorrências

## 📋 Overview

Este é um sistema de gestão de ocorrências (ticketing system) desenvolvido para a instituição educacional ESMAD/IPP. É uma API REST construída com Node.js, Express, e Sequelize ORM para gestão de problemas/ocorrências reportados por utilizadores.

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5.2.1
- **ORM**: Sequelize v6.37.8
- **Database**: MySQL (Railway-hosted)
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Password Hashing**: bcrypt v6.0.0
- **Environment**: dotenv v17.4.2

### Project Structure
```
TrabalhoIndividualPW2/
├── index.js                 # Entry point & server setup
├── package.json             # Dependencies & scripts
├── .env                     # Environment variables
└── src/
    ├── config/
    │   └── database.js      # Sequelize connection config
    ├── models/              # Database models (11 models)
    ├── controllers/         # Business logic (10 controllers)
    ├── routes/              # API routes (10 route files)
    ├── middlewares/         # Auth & authorization
    └── associations/       # Model relationships
```

## 🗄️ Database Schema

### Models & Relationships

#### User Model
- **Fields**: id, name, email, password, role, is_suspended, is_validated
- **Roles**: user, employee, admin
- **Relationships**:
  - hasOne Employee
  - hasMany Occurrence (as creator)
  - hasMany Comment

#### Employee Model
- **Fields**: id, user_id
- **Relationships**: belongsTo User

#### Category Model
- **Fields**: id, name, description
- **Relationships**: hasMany Occurrence

#### Status Model
- **Fields**: id, name, is_final
- **Relationships**: hasMany Occurrence (current status)

#### Location Model
- **Fields**: id, building, floor, room, description, latitude, longitude
- **Relationships**: hasMany Occurrence

#### Occurrence Model (Core Entity)
- **Fields**: id, title, description, priority, created_by, category_id, location_id, current_status_id, treatment_description, resolution_date_expected, resolution_date_actual, is_deleted
- **Priorities**: baixa, media, alta, critica
- **Relationships**:
  - belongsTo User (creator)
  - belongsTo Category
  - belongsTo Status
  - belongsTo Location
  - hasMany OccurrencePhoto
  - hasMany OccurrenceStatusHistory
  - hasMany OccurrencePriorityHistory
  - hasMany Comment

#### OccurrencePhoto Model
- **Fields**: id, occurrence_id, url, uploaded_at
- **Relationships**: belongsTo Occurrence

#### OccurrenceStatusHistory Model
- **Fields**: id, occurrence_id, status_id, changed_at
- **Relationships**: belongsTo Occurrence, belongsTo Status

#### OccurrencePriorityHistory Model
- **Fields**: id, occurrence_id, priority, changed_at
- **Relationships**: belongsTo Occurrence

#### Comment Model
- **Fields**: id, text, user_id, occurrence_id, is_deleted
- **Relationships**: belongsTo User, belongsTo Occurrence, hasMany CommentFlag

#### CommentFlag Model
- **Fields**: id, comment_id, user_id, reason, created_at
- **Relationships**: belongsTo Comment

### Entity Relationship Diagram
```
User (1) ----< (1) Employee
  |
  +----< (N) Occurrence
  |
  +----< (N) Comment

Category (1) ----< (N) Occurrence
Status (1) ----< (N) Occurrence
Location (1) ----< (N) Occurrence

Occurrence (1) ----< (N) OccurrencePhoto
Occurrence (1) ----< (N) OccurrenceStatusHistory
Occurrence (1) ----< (N) OccurrencePriorityHistory
Occurrence (1) ----< (N) Comment

Comment (1) ----< (N) CommentFlag
Status (1) ----< (N) OccurrenceStatusHistory
```

## 🔐 Authentication & Authorization

### Registration Flow
1. User provides name, email, password
2. Email must be institutional (@esmad.ipp.pt)
3. Role auto-detection:
   - Numeric prefix (e.g., 12345@esmad.ipp.pt) → "user"
   - Letter prefix (e.g., joao@esmad.ipp.pt) → "employee"
4. Password hashed with bcrypt (10 rounds)
5. Users auto-validated, employees require admin validation
6. Employees get Employee record created

### Login Flow
1. User provides email, password
2. Password verified with bcrypt
3. Check if account is suspended
4. Check if employee is validated
5. JWT token generated (15min expiry)
6. Token contains: { sub: user_id, role: user_role }

### Middleware Functions
- **verifyToken**: Validates JWT token, sets req.user
- **requireAdmin**: Requires admin role
- **requireRole(role)**: Requires specific role
- **requireAnyRole(roles)**: Requires any of specified roles
- **requireSelfOrAdmin**: Allows access to own resources or admin

## 🌐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login and get JWT token

### Users (`/api/users`) - Admin only (except getById)
- `POST /` - Create user (admin)
- `GET /` - List all users (admin)
- `GET /:id` - Get user by ID (self or admin)
- `PUT /:id` - Update user (self or admin)
- `DELETE /:id` - Delete user (admin)
- `PATCH /:id` - Suspend/unsuspend user (admin)

### Employees (`/api/employees`)
- CRUD operations for employee management

### Categories (`/api/categories`) - Admin only
- `POST /` - Create category
- `GET /` - List categories
- `GET /:id` - Get category by ID
- `PUT /:id` - Update category
- `DELETE /:id` - Delete category

### Statuses (`/api/statuses`) - Admin only
- CRUD operations for status management

### Locations (`/api/locations`) - Admin only
- CRUD operations for location management

### Occurrences (`/api/occurrences`)
- `POST /` - Create occurrence (user role)
- `GET /` - List occurrences (all authenticated)
- `GET /:id` - Get occurrence by ID
- `PUT /:id` - Update occurrence
- `DELETE /:id` - Soft delete occurrence
- `POST /:id/status` - Update status (employee/admin)
- `PATCH /:id/priority` - Update priority (employee/admin)
- `POST /:id/comments` - Add comment to occurrence
- `GET /:id/comments` - Get occurrence comments

### Comments (`/api/comments`)
- CRUD operations for comments
- Flagging system for inappropriate comments

### Statistics (`/api/statistics`) - Admin only
- `GET /occurrences-by-category` - Occurrences grouped by category
- `GET /occurrences-by-status` - Occurrences grouped by status
- `GET /occurrences-by-building` - Occurrences grouped by building
- `GET /average-resolution-time` - Average resolution time in days
- `GET /monthly-evolution` - Monthly occurrence evolution (optional year filter)

## 🔑 Key Features

### Occurrence Lifecycle
1. **Creation**: Users create occurrences with title, description, priority, category, location
2. **Initial Status**: Occurrences start with initial status
3. **Status Updates**: Employees/admin can update status (tracked in history)
4. **Priority Updates**: Employees/admin can update priority (tracked in history)
5. **Comments**: Users can comment on occurrences
6. **Resolution**: When status is final (resolvida/rejeitada), resolution date is set
7. **Soft Delete**: Occurrences are soft deleted (is_deleted flag)

### Access Control
- **Users**: Can create occurrences, view their own, comment
- **Employees**: Can view all, update status/priority, comment
- **Admins**: Full access to all resources, user management, statistics

### Business Rules
- Users can only edit/delete their own occurrences before treatment
- Users cannot view closed occurrences (resolvida/rejeitada)
- Employees require admin validation before login
- Final statuses cannot be changed once set
- Password minimum 10 characters
- Institutional email required for registration

## 📊 Data Flow

### Request Flow
```
Client Request → Express Router → Auth Middleware → Controller → Model → Database
```

### Example: Create Occurrence
1. POST /api/occurrences with JWT token
2. verifyToken middleware validates JWT
3. requireRole("user") ensures user role
4. OccurrenceController.create() handles business logic
5. Creates Occurrence record
6. Creates initial OccurrenceStatusHistory
7. Creates initial OccurrencePriorityHistory
8. Creates OccurrencePhoto records if provided
9. Returns created occurrence

## 🔧 Configuration

### Environment Variables
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret

### Database Connection
- Sequelize configured for MySQL
- Auto-sync enabled (alter: true)
- Logging disabled for production

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start server
npm start

# Run migrations (if using migrations)
npm run migrate
```

Server runs on port 3000 (or PORT env var)

## 📝 Notes

- Uses ES Modules (type: "module" in package.json)
- Soft delete pattern for Occurrence and Comment
- History tracking for status and priority changes
- Institutional email validation for ESMAD/IPP
- Role-based access control throughout
- Pagination support in occurrence listing
- HATEOAS-style links in API responses
