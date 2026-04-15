# Project Workflow Implementation Guide

## Overview

Complete project lifecycle workflow system for MERN stack project management application. This system manages the state transitions of projects from **open** → **submitted** → **completed** → **closed**, with role-based access control and mutual rating system.

## Architecture

### Backend Stack
- **Node.js + Express.js** - Server framework
- **MongoDB + Mongoose** - Database
- **JWT Authentication** - Request validation
- **Port**: 5000

### Frontend Stack
- **React 18+ (Vite)** - UI framework
- **Axios** - HTTP client
- **Port**: 5173

---

## Database Schema Changes

### ProjectRequest Model Updates

```javascript
{
  // Existing fields
  customer: ObjectId,
  acceptedProposal: ObjectId,
  title: String,
  
  // Status Workflow (8-state enum)
  status: {
    enum: ["pending", "accepted", "shortlisted", "rejected", 
           "in_progress", "submitted", "completed", "closed"]
  },
  
  // Workflow Timestamps
  submittedAt: Date,        // Set when contractor submits work
  completedAt: Date,        // Set when customer approves completion
  closedAt: Date,          // Set when both parties have rated
  
  // Rating Tracking
  contractorRated: Boolean, // Tracks if contractor submitted rating
  customerRated: Boolean,   // Tracks if customer submitted rating
  
  // Metadata
  updatedAt: Date,
  createdAt: Date
}
```

---

## Backend API Endpoints

### 1. **GET** `/workflow/projects/:projectId/details`

Fetch complete project details with permissions for current user.

**Authentication:** Required (JWT)

**Response:**
```json
{
  "project": {
    "_id": "...",
    "status": "in_progress",
    "customer": { "name": "John", "email": "..." },
    "submittedAt": null,
    "completedAt": null,
    "contractorRated": false,
    "customerRated": false
  },
  "acceptedProposal": { "contractor": { "name": "...", "rating": 4.5 } },
  "userRole": "contractor|customer|guest",
  "permissions": {
    "canSubmit": true|false,
    "canClose": true|false,
    "canRate": true|false
  }
}
```

---

### 2. **PATCH** `/workflow/projects/:projectId/submit`

**Contractor marks work as submitted** (in_progress → submitted)

**Authentication:** Required (Contractor only)

**Logic:**
- Verify contractor has accepted proposal for project
- Validate project status is `"in_progress"`
- Update status to `"submitted"`
- Set `submittedAt` timestamp

**Request Body:** (empty)

**Response:**
```json
{
  "success": true,
  "message": "Work submitted successfully. Waiting for customer approval.",
  "project": { /* updated project */ },
  "status": "submitted"
}
```

**Error Cases:**
- `400`: "Cannot submit. Project status must be 'in_progress'"
- `403`: "You don't have an accepted proposal for this project"
- `401`: "Not authenticated"

---

### 3. **PATCH** `/workflow/projects/:projectId/close`

**Customer closes/approves project** (submitted → completed)

**Authentication:** Required (Customer only)

**Logic:**
- Verify customer is project owner
- Validate project status is `"submitted"`
- Update status to `"completed"`
- Set `completedAt` timestamp

**Request Body:** (empty)

**Response:**
```json
{
  "success": true,
  "message": "Project closed successfully. You can now submit ratings and reviews.",
  "project": { /* updated project */ },
  "status": "completed"
}
```

**Error Cases:**
- `400`: "Cannot close. Project status must be 'submitted'"
- `403`: "Only project owner can close the project"
- `401`: "Not authenticated"

---

### 4. **PATCH** `/workflow/projects/:projectId/rate`

**Both roles submit ratings** (completed → closed when both rated)

**Authentication:** Required (Both contractor and customer)

**Request Body:**
```json
{
  "rating": 1-5,              // Required: 1-5 stars
  "comment": "string",        // Optional: 10-1000 characters
  "ratedBy": "contractor|customer"  // Set by backend from auth
}
```

**Logic:**
- Verify user is contractor or customer in project
- Validate rating is 1-5 and comment is 10-1000 chars
- Create Review record
- Update `contractorRated` or `customerRated` flag
- **If both have rated**: Auto-transition status to `"closed"` and set `closedAt`
- Update contractor's average rating if customer rated

**Response:**
```json
{
  "success": true,
  "message": "Rating submitted. Project fully closed!|Waiting for other party...",
  "review": { /* created review */ },
  "project": { /* updated project */ },
  "projectStatus": "completed|closed"
}
```

**Error Cases:**
- `400`: "Rating must be between 1 and 5"
- `400`: "Comment must be between 10 and 1000 characters"
- `400`: "Cannot rate. Project status must be 'completed'"
- `400`: "Contractor has already submitted a rating"
- `400`: "Customer has already submitted a rating"
- `403`: "You are not authorized to rate this project"
- `401`: "Not authenticated"

---

### 5. **GET** `/workflow/projects/:projectId/workflow-status`

Get current workflow status and available actions for UI rendering.

**Authentication:** Required

**Response:**
```json
{
  "currentStatus": "submitted",
  "submittedAt": "2024-01-15T10:30:00Z",
  "completedAt": null,
  "closedAt": null,
  "contractorRated": false,
  "customerRated": false,
  "contractor": { "name": "Ahmed", "hasRated": false },
  "customer": { "name": "Fatima", "hasRated": false },
  "availableActions": {
    "contractorCanSubmit": false,
    "customerCanClose": true,
    "contractorCanRate": false,
    "customerCanRate": false
  },
  "messages": {
    "status": "✅ Work submitted. Waiting for customer approval.",
    "nextAction": "→ Review and close the project"
  }
}
```

---

## Frontend Components

### 1. **ContractorSubmitWork.jsx**

Allows contractor to mark work as submitted.

**Location:** `website/src/Pages/Dashboard/ContractorSubmitWork.jsx`

**Props:**
- `projectId` (string): Project ID
- `onSuccess` (function): Callback when successfully submitted

**Features:**
- Shows only when `status === "in_progress"`
- 2-step confirmation modal
- Proper error handling for 401, 403, 400
- Loading state during submission
- Success message display

**Usage:**
```jsx
import ContractorSubmitWork from "./ContractorSubmitWork";

<ContractorSubmitWork 
  projectId={projectId}
  onSuccess={(project) => {
    // Refresh project data or navigate
  }}
/>
```

---

### 2. **CustomerCloseProject.jsx**

Allows customer to approve and close the project.

**Location:** `website/src/Pages/Dashboard/CustomerCloseProject.jsx`

**Props:**
- `projectId` (string): Project ID
- `onSuccess` (function): Callback when successfully closed

**Features:**
- Shows only when `status === "submitted"`
- 2-step confirmation modal with contractor name
- Proper error handling
- Loading state
- Success message

**Usage:**
```jsx
import CustomerCloseProject from "./CustomerCloseProject";

<CustomerCloseProject 
  projectId={projectId}
  onSuccess={(project) => {
    // Refresh project data
    setProjectStatus("completed");
  }}
/>
```

---

### 3. **RatingSubmission.jsx**

Mutual rating and review system for both contractor and customer.

**Location:** `website/src/Pages/Dashboard/RatingSubmission.jsx`

**Props:**
- `projectId` (string): Project ID
- `userRole` (string): "contractor" or "customer"
- `onSuccess` (function): Callback when rating submitted

**Features:**
- 5-star interactive rating
- Comment textarea with character counter (10-1000 chars)
- Shows only when `status === "completed"` and user hasn't rated
- Validation for required fields
- Proper error handling
- Success notification with auto-closure message

**Usage:**
```jsx
import RatingSubmission from "./RatingSubmission";

const userRole = user.type === "contractor" ? "contractor" : "customer";

<RatingSubmission 
  projectId={projectId}
  userRole={userRole}
  onSuccess={(project) => {
    // Auto-refresh or navigate if project now closed
    if (project.status === "closed") {
      // Show completion message
    }
  }}
/>
```

---

## Complete Workflow Example

### **Scenario: Contractor → Customer → Mutual Ratings → Auto-Close**

```
1. Project Status: "in_progress"
   ├─ Contractor clicks "Mark Work as Submitted"
   │  └─ Backend: status → "submitted", submittedAt set
   └─ Component: ContractorSubmitWork triggers

2. Project Status: "submitted"
   ├─ Customer receives notification
   ├─ Customer clicks "Approve & Close Project"
   │  └─ Backend: status → "completed", completedAt set
   └─ Component: CustomerCloseProject triggers

3. Project Status: "completed"
   ├─ Both parties see RatingSubmission component
   ├─ Contractor submits 4-star rating + comment
   │  └─ Backend: contractorRated = true, Review created
   ├─ Customer submits 5-star rating + comment
   │  └─ Backend: customerRated = true, Review created
   │  └─ AUTO-TRIGGER: Both rated! Status → "closed", closedAt set
   └─ Both see success message: "Project fully closed!"

4. Project Status: "closed"
   ├─ Contractor's average rating updated
   ├─ Project archived
   ├─ No further action possible
   └─ Both can view submitted reviews
```

---

## Integration Checklist

### Backend
- ✅ ProjectRequest model updated with new fields
- ✅ projectWorkflowRoutes.js created with 5 endpoints
- ✅ server.js updated to include workflow routes
- ✅ Review model exists and working
- ✅ Error handling and validation implemented

### Frontend - Contractor
- ✅ ContractorSubmitWork component created
- ✅ Integrated into ContractorProjectTrack.jsx
- ✅ Token retrieval logic working
- ✅ 401 error handling

### Frontend - Customer
- ✅ CustomerCloseProject component created
- ✅ Integrated into CustomerProjectTrack.jsx
- ✅ Token retrieval logic working
- ✅ 401 error handling

### Frontend - Both
- ✅ RatingSubmission component created
- ✅ Star rating and comment validation
- ✅ Auto-closure when both rated
- ✅ CSS styling complete

---

## Integration Instructions

### 1. Add Workflow Components to Project Tracking Pages

**For Contractor** (`ContractorProjectTrack.jsx`):
```jsx
import ContractorSubmitWork from "../ContractorSubmitWork";

export const ContractorProjectTrack = () => {
  return (
    <>
      {/* Your existing project details */}
      
      {/* Add submission workflow */}
      <ContractorSubmitWork 
        projectId={projectId}
        onSuccess={() => {
          // Refresh project details
          fetchProjectDetails();
        }}
      />
    </>
  );
};
```

**For Customer** (`CustomerProjectTrack.jsx`):
```jsx
import CustomerCloseProject from "../CustomerCloseProject";
import RatingSubmission from "../RatingSubmission";

export const CustomerProjectTrack = () => {
  return (
    <>
      {/* Your existing project details */}
      
      {/* Add close/approval workflow */}
      <CustomerCloseProject 
        projectId={projectId}
        onSuccess={() => {
          fetchProjectDetails();
        }}
      />
      
      {/* Add rating workflow */}
      <RatingSubmission 
        projectId={projectId}
        userRole="customer"
        onSuccess={() => {
          fetchProjectDetails();
        }}
      />
    </>
  );
};
```

### 2. Update Dashboard Status Displays

Show appropriate messages based on status:
```jsx
const getStatusDisplay = (project) => {
  const statusMap = {
    "pending": "⏳ Awaiting Acceptance",
    "accepted": "✅ Accepted",
    "in_progress": "🔨 In Progress",
    "submitted": "👀 Under Review",
    "completed": "🎉 Completed",
    "closed": "✔️ Closed"
  };
  return statusMap[project.status];
};
```

### 3. Testing Complete Workflow

1. **Start Backend:**
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd website
   npm run dev
   ```

3. **Test Flow:**
   - Log in as contractor
   - Navigate to project with status "in_progress"
   - Click "Mark Work as Submitted"
   - Log in as customer
   - Navigate to same project with status "submitted"
   - Click "Approve & Close Project"
   - Both log in and submit ratings
   - Verify status changes to "closed"

---

## Error Handling Guide

### Common Issues & Solutions

**401 Unauthorized**
- **Cause:** Token expired or invalid
- **Solution:** 
  - Check localStorage for valid token
  - User should log in again
  - Backend will return 401, frontend displays message

**403 Forbidden**
- **Cause:** Wrong role trying action (contractor closing, customer submitting)
- **Solution:** 
  - Only show button for correct role
  - Backend validates and rejects if wrong
  - Check `permissions.canSubmit` from details endpoint

**400 Bad Request**
- **Cause:** Wrong project status or validation failure
- **Solution:**
  - Check project status from details endpoint
  - Validate form inputs before submission
  - Show helpful error message to user

**ERR_NETWORK**
- **Cause:** Backend server not running
- **Solution:**
  - Ensure `npm start` in server directory
  - Check port 5000 is accessible
  - Display helpful error message

---

## Security Considerations

✅ **Implemented:**
- JWT authentication on all endpoints
- Role-based access control
- Ownership verification for projects
- Duplicate rating prevention
- Input validation (rating 1-5, comment length)
- Contractor average rating update protection

❌ **Future Enhancements:**
- Rate limiting on endpoints
- Audit logging
- Blockchain certification of completion
- 2FA for sensitive operations
- Email notifications

---

## Database Queries Performance

```javascript
// Optimized queries with field selection
ProjectRequest.findById(projectId)
  .populate("customer", "name email")
  .populate("acceptedProposal");

// Aggregate for contractor rating
Review.aggregate([
  { $match: { contractor: contractorId, ratedBy: "customer" } },
  { $group: { _id: null, avgRating: { $avg: "$rating" } } }
]);
```

---

## State Transition Diagram

```
                    ┌──────────────┐
                    │   Pending    │
                    └──────────────┘
                           │
                    [Customer accepts]
                           │
                    ┌──────────────┐
                    │   Accepted   │─────────────┐
                    └──────────────┘             │
              [Contractor starts work]           │
              [Status: in_progress]              │
                                                 │
                    ┌──────────────┐             │
                    │ In Progress  │◄────────────┘
                    └──────────────┘
                           │
                [Contractor submits work]
                           │
                    ┌──────────────┐
                    │  Submitted   │
                    └──────────────┘
                           │
                [Customer approves]
                           │
                    ┌──────────────┐
                    │  Completed   │
                    └──────────────┘
                           │
              [Both submit ratings]/
          [Contractor rates + Customer rates]
                           │
                    ┌──────────────┐
                    │    Closed    │
                    └──────────────┘
```

---

## Support & Troubleshooting

For issues:
1. Check browser console for errors
2. Check server logs: `tail -f server.log`
3. Verify token in localStorage is valid
4. Ensure both services running (backend:5000, frontend:5173)
5. Check database connection in MongoDB Atlas

---

## Version History

- **v1.0** (Current): Initial complete workflow system
  - 8-status enum
  - PATCH endpoints for state transitions
  - Mutual rating with auto-closure
  - Role-based access control
  - Frontend components and styling

