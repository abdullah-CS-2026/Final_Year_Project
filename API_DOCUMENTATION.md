# Project Closing & Review System - API Documentation

## Base URL
```
http://localhost:3001
```

## Authentication
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer {token}
```

---

## Project Routes (`/projects`)

### 1. Get Project Details
```http
GET /projects/:projectId/details
```

**Authentication:** ✅ Required

**Response:**
```json
{
  "project": {
    "_id": "project_id",
    "title": "Build a 5 Marla House",
    "customer": { ... },
    "status": "completed",
    "completedAt": "2024-04-11T10:30:00Z",
    "createdAt": "2024-04-01T10:30:00Z"
  },
  "proposal": {
    "_id": "proposal_id",
    "contractor": { ... },
    "status": "completed",
    "price": 500000
  }
}
```

---

### 2. Mark Project as Completed
```http
POST /projects/:projectId/complete
```

**Authentication:** ✅ Required (Contractor)

**Request Body:**
```json
{
  "contractorId": "contractor_id"
}
```

**Success Response (201):**
```json
{
  "message": "Project marked as completed",
  "proposal": { ... },
  "project": {
    "status": "completed",
    "completedAt": "2024-04-11T10:30:00Z"
  }
}
```

**Error Responses:**
- `400` - No accepted proposal found
- `403` - Contractor not authorized for this project
- `404` - Project not found

---

### 3. Close Project
```http
POST /projects/:projectId/close
```

**Authentication:** ✅ Required (Customer)

**Request Body:**
```json
{
  "customerId": "customer_id"
}
```

**Success Response (200):**
```json
{
  "message": "Project closed successfully",
  "project": {
    "status": "closed",
    "closedAt": "2024-04-11T11:30:00Z"
  },
  "proposal": { ... }
}
```

**Error Responses:**
- `400` - Project not in "completed" status
- `403` - Only project owner can close
- `404` - Project not found

---

### 4. Submit Review
```http
POST /projects/:projectId/review
```

**Authentication:** ✅ Required (Customer)

**Request Body:**
```json
{
  "customerId": "customer_id",
  "rating": 5,
  "comment": "Excellent contractor, highly professional work...",
  "isPublic": true
}
```

**Success Response (201):**
```json
{
  "message": "Review submitted successfully",
  "review": {
    "_id": "review_id",
    "rating": 5,
    "comment": "Excellent contractor...",
    "isPublic": true,
    "createdAt": "2024-04-11T11:45:00Z"
  }
}
```

**Validation Errors:**
- `400` - Rating not 1-5
- `400` - Comment too short (< 10 chars)
- `400` - Project not closed
- `400` - Review already submitted
- `403` - Only project owner can review

---

### 5. Get Review Status
```http
GET /projects/:projectId/review-status?customerId={customerId}
```

**Authentication:** ✅ Required

**Query Parameters:**
- `customerId` - Customer ID (required)

**Response:**
```json
{
  "projectStatus": "closed",
  "canReview": true,
  "reviewSubmitted": false,
  "review": null
}
```

When review submitted:
```json
{
  "projectStatus": "closed",
  "canReview": false,
  "reviewSubmitted": true,
  "review": {
    "_id": "review_id",
    "rating": 5,
    "comment": "...",
    "isPublic": true,
    "createdAt": "2024-04-11T11:45:00Z"
  }
}
```

---

## Review Routes (`/reviews`)

### 1. Get Contractor Reviews
```http
GET /reviews/contractor/:contractorId
```

**Authentication:** ❌ Not required (public)

**Query Parameters (Optional):**
- `includePrivate=true` - Include private reviews (if authenticated as contractor)

**Response:**
```json
{
  "contractor": {
    "id": "contractor_id",
    "name": "John Contractor",
    "profilePic": "john.jpg",
    "totalProjects": 23,
    "currentRating": 4.5
  },
  "reviews": [
    {
      "_id": "review_id",
      "rating": 5,
      "comment": "Excellent work...",
      "isPublic": true,
      "createdAt": "2024-04-11T11:45:00Z",
      "customer": {
        "name": "Ahmed Khan",
        "profilePic": "ahmed.jpg"
      },
      "project": {
        "title": "Build a 5 Marla House",
        "category": "house"
      }
    }
  ],
  "stats": {
    "totalReviews": 15,
    "averageRating": 4.5,
    "ratingDistribution": {
      "5": 12,
      "4": 2,
      "3": 1,
      "2": 0,
      "1": 0
    }
  }
}
```

---

### 2. Get Contractor Summary
```http
GET /reviews/contractor/:contractorId/summary
```

**Authentication:** ❌ Not required (public)

**Response:**
```json
{
  "contractorId": "contractor_id",
  "contractorName": "John Contractor",
  "totalReviews": 15,
  "averageRating": 4.5,
  "totalCompletedProjects": 23,
  "ratingDistribution": {
    "5": 12,
    "4": 2,
    "3": 1,
    "2": 0,
    "1": 0
  }
}
```

---

### 3. Get Single Review
```http
GET /reviews/:reviewId
```

**Authentication:** ❌ Not required (public reviews)

**Response:**
```json
{
  "_id": "review_id",
  "rating": 5,
  "comment": "Excellent work...",
  "isPublic": true,
  "createdAt": "2024-04-11T11:45:00Z",
  "customer": {
    "_id": "customer_id",
    "name": "Ahmed Khan",
    "profilePic": "ahmed.jpg"
  },
  "contractor": {
    "_id": "contractor_id",
    "name": "John Contractor",
    "profilePic": "john.jpg"
  },
  "project": {
    "_id": "project_id",
    "title": "Build a 5 Marla House",
    "category": "house"
  }
}
```

---

### 4. Update Review Visibility
```http
PUT /reviews/:reviewId/visibility
```

**Authentication:** ✅ Required (Contractor who owns review)

**Request Body:**
```json
{
  "isPublic": false,
  "contractorId": "contractor_id"
}
```

**Success Response (200):**
```json
{
  "message": "Review visibility updated",
  "review": { ... }
}
```

**Error Responses:**
- `403` - Only contractor can change visibility
- `404` - Review not found

---

### 5. Delete Review
```http
DELETE /reviews/:reviewId
```

**Authentication:** ✅ Required (Customer who submitted review)

**Request Body:**
```json
{
  "customerId": "customer_id"
}
```

**Success Response (200):**
```json
{
  "message": "Review deleted successfully"
}
```

**Error Responses:**
- `403` - Only review author can delete
- `404` - Review not found

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not authorized for this resource)
- `404` - Not Found
- `500` - Server Error

---

## Request/Response Examples

### Example 1: Complete Flow

**Step 1: Contractor Marks Completion**
```bash
curl -X POST http://localhost:3001/projects/proj123/complete \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{"contractorId": "cont456"}'
```

**Step 2: Customer Closes Project**
```bash
curl -X POST http://localhost:3001/projects/proj123/close \
  -H "Authorization: Bearer token789" \
  -H "Content-Type: application/json" \
  -d '{"customerId": "cust123"}'
```

**Step 3: Customer Submits Review**
```bash
curl -X POST http://localhost:3001/projects/proj123/review \
  -H "Authorization: Bearer token789" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust123",
    "rating": 5,
    "comment": "Excellent contractor, highly recommended!",
    "isPublic": true
  }'
```

**Step 4: Get Contractor Reviews**
```bash
curl http://localhost:3001/reviews/contractor/cont456
```

---

## Data Validation Rules

### Rating
- Type: `Number`
- Range: `1-5`
- Required: ✅

### Comment
- Type: `String`
- Min Length: `10 characters`
- Max Length: `1000 characters`
- Required: ✅

### isPublic
- Type: `Boolean`
- Default: `true`
- Required: ❌

### customerId/contractorId
- Type: `String` (MongoDB ObjectId)
- Required: ✅
- Validation: Must be valid MongoDB ObjectId

### projectId
- Type: `String` (MongoDB ObjectId)
- Required: ✅
- Validation: Must be valid MongoDB ObjectId

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production:
- 100 requests per minute per IP
- 10 reviews per day per user

---

## CORS Configuration

Currently allows all origins (`*`). For production, update in `server.js`:

```javascript
app.use(cors({
  origin: "https://yourdomain.com",
  credentials: true
}));
```

---

## Pagination (Future Enhancement)

Current implementation returns all results. Consider adding:

```
GET /reviews/contractor/:contractorId?page=1&limit=10
```

Response would include:
```json
{
  "reviews": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

## Caching Headers (Recommended)

Add to production deployment:

```javascript
app.get('/reviews/contractor/:contractorId', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  // ...
});
```

---

## WebSocket Integration (Optional)

For real-time review notifications, emit events:

```javascript
io.to(contractorId).emit('new-review', review);
```

Listen on frontend:
```javascript
socket.on('new-review', (review) => {
  // Refresh reviews list
});
```

---

## Testing with Postman

1. Import collection
2. Set `{{base_url}}` = `http://localhost:3001`
3. Set `{{token}}` in Authorization
4. Test endpoints in order

---

**API Version:** 1.0
**Last Updated:** 2024
**Status:** ✅ Production Ready
