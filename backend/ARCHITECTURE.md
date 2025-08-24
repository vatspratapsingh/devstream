# DevStream Backend Architecture

## Overview

DevStream is a modern, production-ready RESTful API for notes management built with Node.js, Express.js, and comprehensive middleware for validation, logging, error handling, and security.

## Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── app.js             # Application configuration
│   └── database.js        # Database configuration
├── middleware/            # Express middleware
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling middleware
│   └── validation.js     # Input validation middleware
├── routes/               # API routes
│   └── notes.js         # Notes API endpoints
├── utils/               # Utility functions
│   ├── helpers.js       # Helper functions
│   ├── logger.js        # Logging utility
│   └── response.js      # Response formatting
├── logs/                # Application logs
├── __tests__/           # Test files
├── app.js              # Express application setup
├── server.js           # Server entry point
└── package.json        # Dependencies and scripts
```

## Core Components

### 1. Configuration (`config/`)

#### `app.js`
- Environment-specific configuration
- CORS settings
- Rate limiting configuration
- Security settings
- Port and host configuration

#### `database.js`
- Database connection settings
- Environment-specific database configs
- Data file paths

### 2. Middleware (`middleware/`)

#### `validation.js`
- Input validation using express-validator
- Custom validation rules for notes
- Query parameter validation
- Error message formatting

**Features:**
- Title and content validation
- UUID and custom ID validation
- Query parameter validation
- Tag and priority validation

#### `errorHandler.js`
- Centralized error handling
- Custom AppError class
- Environment-specific error responses
- Graceful error logging

**Features:**
- Structured error responses
- Development vs production error handling
- Unhandled exception catching
- Request context logging

#### `auth.js`
- JWT-based authentication
- Role-based authorization
- Optional authentication
- Token validation

**Features:**
- Bearer token authentication
- Role-based access control
- Optional auth for public endpoints
- Mock user system (ready for database integration)

### 3. Utilities (`utils/`)

#### `logger.js`
- Winston-based structured logging
- Multiple log levels
- File and console output
- Request logging integration

**Features:**
- Colored console output
- File-based logging
- Error log separation
- Morgan integration

#### `response.js`
- Standardized API responses
- Success and error response wrappers
- Pagination response formatting
- HTTP status code helpers

**Response Format:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "timestamp": "2025-08-24T10:00:00.000Z"
}
```

#### `helpers.js`
- Common utility functions
- Data manipulation helpers
- Validation helpers
- Date and time utilities

**Features:**
- Pagination helpers
- Search functionality
- Sorting utilities
- Data filtering
- String sanitization
- Date formatting

### 4. Routes (`routes/`)

#### `notes.js`
- RESTful notes API
- CRUD operations
- Advanced querying
- Input validation

**Endpoints:**
- `GET /api/notes` - List notes with pagination, search, sorting
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

**Features:**
- Pagination with metadata
- Full-text search
- Multiple sort options
- Partial updates
- Validation and sanitization

## API Features

### 1. Pagination
```bash
GET /api/notes?page=1&limit=10
```

### 2. Search
```bash
GET /api/notes?search=keyword
```

### 3. Sorting
```bash
GET /api/notes?sortBy=title&sortOrder=asc
```

### 4. Advanced Filtering
```bash
GET /api/notes?priority=high&tags=important
```

## Security Features

### 1. Input Validation
- All inputs are validated and sanitized
- SQL injection prevention
- XSS protection
- Input length limits

### 2. Rate Limiting
- Configurable rate limits per environment
- IP-based limiting
- Customizable time windows

### 3. Security Headers
- Helmet.js integration
- CORS configuration
- Trust proxy settings

### 4. Error Handling
- No sensitive information in production errors
- Structured error logging
- Graceful error responses

## Logging

### Log Levels
- `error` - Application errors
- `warn` - Warning messages
- `info` - General information
- `http` - HTTP requests
- `debug` - Debug information (development only)

### Log Outputs
- Console (colored, development)
- File-based logging (production)
- Separate error logs
- Request/response logging

## Testing

### Test Coverage
- Unit tests for all endpoints
- Validation testing
- Error handling tests
- Integration tests

### Test Structure
- Jest testing framework
- Supertest for HTTP testing
- Comprehensive coverage reporting
- Mock data management

## Environment Configuration

### Development
- Detailed error messages
- Debug logging
- Local CORS settings
- Development rate limits

### Production
- Minimal error details
- Production logging
- Restricted CORS
- Strict rate limits

### Testing
- Test-specific configuration
- Mock data
- Isolated test environment

## Dependencies

### Core Dependencies
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `morgan` - HTTP request logging
- `express-rate-limit` - Rate limiting
- `uuid` - Unique ID generation

### Validation & Security
- `express-validator` - Input validation
- `jsonwebtoken` - JWT authentication

### Logging & Utilities
- `winston` - Structured logging

### Development Dependencies
- `jest` - Testing framework
- `supertest` - HTTP testing
- `nodemon` - Development server
- `eslint` - Code linting

## Best Practices

### 1. Error Handling
- Centralized error handling
- Consistent error responses
- Proper HTTP status codes
- Error logging with context

### 2. Validation
- Input validation at middleware level
- Sanitization of user inputs
- Custom validation rules
- Clear error messages

### 3. Logging
- Structured logging
- Appropriate log levels
- Request context preservation
- Performance monitoring

### 4. Security
- Input sanitization
- Rate limiting
- Security headers
- CORS configuration

### 5. Code Organization
- Separation of concerns
- Modular architecture
- Reusable utilities
- Clear file structure

## Future Enhancements

### 1. Database Integration
- PostgreSQL/MongoDB integration
- Connection pooling
- Database migrations
- Data persistence

### 2. Authentication
- User management
- Role-based access
- Session management
- OAuth integration

### 3. Caching
- Redis integration
- Response caching
- Query result caching
- Performance optimization

### 4. Monitoring
- Health checks
- Performance metrics
- Error tracking
- Usage analytics

### 5. API Documentation
- OpenAPI/Swagger integration
- Interactive documentation
- Code examples
- API versioning

## Deployment

### Docker
- Multi-stage builds
- Production optimization
- Health checks
- Environment configuration

### CI/CD
- Automated testing
- Code quality checks
- Deployment automation
- Environment management

This architecture provides a solid foundation for a scalable, maintainable, and secure API with comprehensive features for production use.
