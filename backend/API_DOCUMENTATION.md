# Portfolio Backend API Documentation

Production-ready REST API for the Iliyas Patel Portfolio website.

---

## Base URLs

- **Local Development**: `http://localhost:5000/api`
- **Hostinger Production**: `https://yourdomain.com/api` (or configured subdomain / Node.js application path)

---

## Security & Middlewares

1. **Helmet**: Adds secure HTTP response headers against XSS, clickjacking, etc.
2. **CORS**: Restricts origins according to `FRONTEND_URL` in production; permits non-browser server calls.
3. **express-rate-limit**:
   - General API: Max 100 requests per 15 minutes per IP.
   - Contact form (`POST /api/contact`): Max 5 submissions per 15 minutes per IP to eliminate spam and bot flooding.
4. **Input Sanitization & Validation**:
   - All fields sanitized against HTML injection.
   - Strict length and email format constraints.
   - Parameterized SQL queries using `mysql2/promise` against SQL injection.
5. **Duplicate Submission Protection**:
   - Queries within a 2-minute window preventing the same email and subject from submitting duplicate entries.

---

## Endpoints

### 1. Health Check

Checks service status and MySQL database connectivity.

- **Route**: `GET /api/health`
- **Auth**: None
- **Rate Limit**: General limiter (100 req / 15 min)

#### Successful Response (Database Connected)
- **Status Code**: `200 OK`
```json
{
  "success": true,
  "status": "healthy",
  "service": "portfolio-backend-api",
  "timestamp": "2026-11-05T07:15:00.000Z",
  "database": {
    "status": "connected"
  },
  "uptime": 124.5
}
```

#### Degraded Response (Database Connection Issue)
- **Status Code**: `503 Service Unavailable`
```json
{
  "success": false,
  "status": "degraded",
  "service": "portfolio-backend-api",
  "timestamp": "2026-11-05T07:15:00.000Z",
  "database": {
    "status": "disconnected",
    "error": "Access denied for user ..."
  },
  "uptime": 12.3
}
```

---

### 2. Submit Contact Form

Saves visitor inquiries directly into MySQL `contact_messages` table.

- **Route**: `POST /api/contact`
- **Auth**: None
- **Rate Limit**: Strict contact limiter (5 submissions / 15 min per IP)
- **Headers**:
  ```http
  Content-Type: application/json
  ```

#### Request Body
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "subject": "SEO and Analytics Strategy Inquiry",
  "message": "Hi Iliyas, we would like to consult with you on our Google Search rankings and analytics setup.",
  "phone": "+1-555-0199" // Optional
}
```

#### Field Specifications:
| Field | Type | Required | Max Length | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | 100 chars | Min 2 chars |
| `email` | string | **Yes** | 255 chars | Valid email format |
| `subject` | string | **Yes** | 200 chars | Min 2 chars |
| `message` | string | *No* (optional) | 5000 chars | Escaped & sanitized |
| `phone` | string | *No* (optional) | 50 chars | Valid phone format |

#### Response: Created (201)
```json
{
  "success": true,
  "message": "Thank you for reaching out! Your message has been received successfully.",
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "subject": "SEO and Analytics Strategy Inquiry",
    "createdAt": "2026-11-05T07:15:30.000Z"
  }
}
```

#### Response: Validation Error (400)
```json
{
  "success": false,
  "message": "Please correct the errors in the form.",
  "errors": {
    "email": "Please enter a valid email address.",
    "subject": "Please add a subject."
  }
}
```

#### Response: Duplicate Submission (429)
```json
{
  "success": false,
  "message": "A similar message was recently submitted. Please wait a couple of minutes before submitting again."
}
```

#### Response: Rate Limited (429)
```json
{
  "success": false,
  "message": "Too many contact submissions from this IP. Please wait a few minutes before trying again."
}
```

---

## Error Handling Standards

All API responses follow consistent JSON structure:

```json
{
  "success": false,
  "message": "Human readable error description",
  "errors": { ... } // Optional structured field validation errors
}
```

Internal database queries, passwords, or detailed system stack traces are stripped when `NODE_ENV=production` to guarantee zero information leakage.

