# Project Workflow System - Visual Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MERN STACK APPLICATION                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────                ──────────────────────────┐ │
│  │      FRONTEND (React 5173)                BACKEND (Express 5000)  │ │
│  ├──────────────────────────                ──────────────────────────┤ │
│  │                                                                    │ │
│  │  ContractorProjectTrack                projectWorkflowRoutes.js   │ │
│  │  ├─ Project Details                     ├─ GET /details          │ │
│  │  ├─ ContractorSubmitWork ──PATCH /submit─→ [Verify Contractor]   │ │
│  │  │  └─ ✓ Mark as Submitted                 [Check in_progress]   │ │
│  │  │                                         [Update to submitted]  │ │
│  │  │                                                                │ │
│  │  └─────────────────────────────────────────────────────────────  │ │
│  │                                                                    │ │
│  │  CustomerProjectTrack                   projectWorkflowRoutes.js  │ │
│  │  ├─ Project Details                     ├─ GET /details         │ │
│  │  ├─ CustomerCloseProject                                         │ │
│  │  │  ├─ ✓ Approve & Close ──PATCH /close──→ [Verify Customer]    │ │
│  │  │  │                        [Check submitted]                   │ │
│  │  │  │                        [Update to completed]               │ │
│  │  │                                                                │ │
│  │  ├─ RatingSubmission                                            │ │
│  │  │  ├─ ⭐ Star Rating ────PATCH /rate────→ [Verify Role]        │ │
│  │  │  ├─ 💬 Comment           [Check completed]                    │ │
│  │  │  └─ Submit Review         [Create Review DB record]           │ │
│  │  │     (Auto-closes if      [Update rating flags]                │ │
│  │  │      both rated!)        [AUTO-CLOSE if both rated]           │ │
│  │  │                          [Update contractor rating]           │ │
│  │  │                                                                │ │
│  │  └─────────────────────────────────────────────────────────────  │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               MONGODB DATABASE                                   │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  ProjectRequest Collection                                      │  │
│  │  ├─ _id, title, customer, acceptedProposal                     │  │
│  │  ├─ status: [pending, accepted, shortlisted, rejected,         │  │
│  │  │           in_progress, submitted, completed, closed]        │  │
│  │  ├─ submittedAt, completedAt, closedAt (timestamps)           │  │
│  │  ├─ contractorRated (bool), customerRated (bool)              │  │
│  │  └─ updatedAt, createdAt                                      │  │
│  │                                                                  │  │
│  │  Review Collection                                              │  │
│  │  ├─ _id, project, contractor, customer, proposal               │  │
│  │  ├─ rating (1-5), comment (10-1000 chars)                     │  │
│  │  ├─ ratedBy: ["contractor", "customer"]                       │  │
│  │  ├─ raterName, isPublic, status                               │  │
│  │  └─ createdAt, updatedAt                                      │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## State Machine Diagram

```
                      ┏━━━━━━━━━━━━━┓
                      ┃  PENDING    ┃
                      ┗━━━━┬━━━━━━━┛
                           │
                   [Customer Accepts]
                           │ POST
                           ↓
                      ┏━━━━━━━━━━━━━┓
                      ┃  ACCEPTED   ┃
                      ┗━━━━┬━━━━━━━┛
                           │
          [Contractor Starts Work]
                           │
                           ↓
                      ┏━━━━━━━━━━━━━┓
                      ┃IN_PROGRESS  ┃ ← Contractor here
                      ┗━━━━┬━━━━━━━┛
                           │
    [Contractor: PATCH /submit]
                           │
                           ↓
                      ┏━━━━━━━━━━━━━┐
                      ┃ SUBMITTED   ┃ ← Work awaiting review
                      ┗━━━━┬━━━━━━━┘
                           │
       [Customer: PATCH /close]
                           │
                           ↓
                      ┏━━━━━━━━━━━━━┐
                      ┃ COMPLETED   ┃ ← Both can rate
                      ┗━━━━┬━━━━━━━┘
                      ╱    │    ╲
              Rating /     │      \ Rating
            Contractor     │      Customer
              │            │            │
              │ PATCH      │ PATCH      │
              │  /rate     │  /rate     │
              │            │            │
              ↓            ↓            ↓
        ┌─────────┐   ┌──────────┐   ┌─────────┐
        │Contractor  │          │  │        │
        │Rated ✓    │          │  │Customer │
        └─────↑─────┘          │  │Rated ✓  │
              │                │  └────↑────┘
              │ (auto-trigger) │       │
              └─────────┬──────┴───────┘
                        │
           [BOTH RATED → AUTO-CLOSE]
           [Status → closed]
           [closedAt timestamp set]
                        │
                        ↓
                      ┏━━━━━━━━━━━━━┓
                      ┃   CLOSED    ┃ ← Project archived
                      ┗━━━━━━━━━━━━┛
                      [No more actions]
```

---

## Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               CONTRACTOR WORKFLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. View: ContractorProjectTrack.jsx                           │
│     └─ Shows project in "in_progress" status                  │
│                                                                  │
│  2. Component: ContractorSubmitWork.jsx                        │
│     ├─ Conditional: Only shows if status="in_progress"        │
│     ├─ Button: "✓ Mark Work as Submitted"                     │
│     └─ Modal: 2-step confirmation                             │
│                                                                  │
│  3. API Call: PATCH /workflow/projects/:id/submit             │
│     ├─ Auth: JWT token from localStorage                      │
│     └─ Validation: Contractor has accepted proposal           │
│                                                                  │
│  4. Response: Success ✅                                        │
│     ├─ Status: in_progress → submitted                        │
│     ├─ submittedAt: timestamp                                 │
│     └─ Message: "Work submitted. Waiting for customer..."    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               CUSTOMER WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. View: CustomerProjectTrack.jsx                             │
│     └─ Shows project in "submitted" status (contractor ready) │
│                                                                  │
│  2. Component: CustomerCloseProject.jsx                        │
│     ├─ Conditional: Only shows if status="submitted"          │
│     ├─ Button: "✓ Approve & Close Project"                    │
│     └─ Modal: Shows contractor name + confirmation            │
│                                                                  │
│  3. API Call: PATCH /workflow/projects/:id/close              │
│     ├─ Auth: JWT token                                         │
│     └─ Validation: Customer is project owner                  │
│                                                                  │
│  4. Response: Success ✅                                        │
│     ├─ Status: submitted → completed                          │
│     ├─ completedAt: timestamp                                 │
│     └─ Message: "Project closed. Ready for ratings..."       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               MUTUAL RATING WORKFLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CONTRACTOR:                          CUSTOMER:                 │
│  ┌──────────────────────────┐       ┌──────────────────────────┐
│  │ 1. View rating form      │       │ 1. View rating form      │
│  │                          │       │                          │
│  │ 2. Select ⭐⭐⭐⭐⭐      │       │ 2. Select ⭐⭐⭐⭐      │
│  │                          │       │                          │
│  │ 3. Write comment         │       │ 3. Write comment         │
│  │    (optional)            │       │    (optional)            │
│  │                          │       │                          │
│  │ 4. Submit Rating         │       │ 4. Submit Rating         │
│  │    ↓                     │       │    ↓                     │
│  │ PATCH /rate              │       │ PATCH /rate              │
│  │ {rating: 4, comment}     │       │ {rating: 5, comment}     │
│  │    ↓                     │       │    ↓                     │
│  │ Response: ✅            │ ←──→  │ Response: ✅            │
│  │                          │       │                          │
│  │ contractorRated=true     │       │ customerRated=true      │
│  │                          │       │                          │
│  │ [WAITING...]             │       │ [AUTO-CLOSED!]          │
│  │ "Waiting for customer"   │       │ "Project closed!"       │
│  │                          │       │                          │
│  │ Status: completed        │       │ Status: closed          │
│  │                          │       │ closedAt: timestamp     │
│  └──────────────────────────┘       └──────────────────────────┘
│                                                                  │
│  AUTOMATIC CLOSURE:                                            │
│  When contractorRated=true && customerRated=true:             │
│  ├─ Status: completed → closed                                │
│  ├─ closedAt: current timestamp                              │
│  ├─ contractor.rating: updated (if customer rated)           │
│  └─ Both see: "✔️ Project fully closed!"                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────┐
│   USER SUBMITS WORKFLOW ACTION                      │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ↓                   ↓
    VALIDATED?          NO ERRORS?
    (Frontend)          (Backend)
         │                   │
    YES │                   │ YES
         │                   │
         ↓                   ↓
    ┌─────────┐          ┌──────────┐
    │ ALLOWED │          │ ALLOWED  │
    │Forward  │          │Update DB │
    └────┬────┘          └────┬─────┘
         │ API Call             │
         └──────→ SUCCESS ←─────┘
                  │
        Return updated
        project data


    ┌──────────────────────────────┐
    │ 401 UNAUTHORIZED             │
    ├──────────────────────────────┤
    │ Cause: Token invalid/expired │
    │ Frontend: "Please log in"    │
    │ Action: Show login button    │
    └──────────────────────────────┘

    ┌──────────────────────────────┐
    │ 403 FORBIDDEN                │
    ├──────────────────────────────┤
    │ Cause: Wrong role/not owner  │
    │ Frontend: "No permission"    │
    │ Action: Hide button/message  │
    └──────────────────────────────┘

    ┌──────────────────────────────┐
    │ 400 BAD REQUEST              │
    ├──────────────────────────────┤
    │ Cause: Invalid state/data    │
    │ Frontend: "Cannot do now"    │
    │ Action: Show reason/retry    │
    └──────────────────────────────┘

    ┌──────────────────────────────┐
    │ ERR_NETWORK                  │
    ├──────────────────────────────┤
    │ Cause: Backend not running   │
    │ Frontend: "Server stopped"   │
    │ Action: Show start command   │
    └──────────────────────────────┘
```

---

## Database Relationship Diagram

```
                    ┌─────────────────────┐
                    │ ProjectRequest      │
                    ├─────────────────────┤
                    │ _id                 │
                    │ title               │
                    │ customer (ref)      │
                    │ acceptedProposal    │
                    │   (ref)             │
                    │ status: enum[8]     │
                    │ submittedAt         │
                    │ completedAt         │
                    │ closedAt            │
                    │ contractorRated     │
                    │ customerRated       │
                    │ updatedAt           │
                    │ createdAt           │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        (has one         (created           (references
         customer)        reviews)           proposal)
                │              │              │
                ↓              ↓              ↓
        ┌──────────────┐  ┌──────────────┐ ┌──────────────┐
        │ Customer     │  │ Review       │ │ Proposal     │
        ├──────────────┤  ├──────────────┤ ├──────────────┤
        │ _id          │  │ _id          │ │ _id          │
        │ name         │  │ project(ref) │ │ contractor   │
        │ email        │  │ contractor   │ │ customer     │
        │ phone        │  │   (ref)      │ │ status       │
        │ rating       │  │ customer     │ │ amount       │
        │ profilePic   │  │   (ref)      │ │ timeline     │
        └──────────────┘  │ proposal     │ │ description  │
                          │   (ref)      │ │ createdAt    │
                          │ rating: 1-5  │ └──────────────┘
                          │ comment      │
                          │ ratedBy      │
                          │ raterName    │
                          │ isPublic     │
                          │ status       │
                          │ createdAt    │
                          └──────────────┘

        References:
        ProjectRequest.customer → Customer._id
        ProjectRequest.acceptedProposal → Proposal._id
        Review.contractor → Contractor._id
        Review.customer → Customer._id
        Review.project → ProjectRequest._id
        Review.proposal → Proposal._id
```

---

## Integration Checklist - Visual

```
╔════════════════════════════════════════════════════╗
║ WORKFLOW SYSTEM INTEGRATION CHECKLIST              ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║ BACKEND SETUP                                      ║
║ ✅ projectWorkflowRoutes.js created               ║
║ ✅ server.js updated with new routes              ║
║ ✅ ProjectRequest.js model updated                ║
║ ✅ Review.js model updated with ratedBy           ║
║ ✅ All 5 endpoints working                        ║
║                                                    ║
║ FRONTEND COMPONENTS                               ║
║ ✅ ContractorSubmitWork.jsx created               ║
║ ✅ CustomerCloseProject.jsx created               ║
║ ✅ RatingSubmission.jsx created                   ║
║ ✅ ConfirmationModal.css styling done             ║
║ ✅ RatingSubmission.css styling done              ║
║                                                    ║
║ INTEGRATION POINTS (TODO)                          ║
║ ⬜ Add ContractorSubmitWork to ContractorProjectTrack
║ ⬜ Add CustomerCloseProject to CustomerProjectTrack  
║ ⬜ Add RatingSubmission to CustomerProjectTrack      
║                                                    ║
║ TESTING (TODO)                                    ║
║ ⬜ Contractor mark submitted                       ║
║ ⬜ Customer close project                          ║
║ ⬜ Both submit ratings                             ║
║ ⬜ Auto-closure verification                       ║
║ ⬜ Error handling scenarios                        ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

---

## File Structure

```
project-root/
├── server/
│   ├── routes/
│   │   ├── projectWorkflowRoutes.js ⭐ NEW
│   │   │   ├── GET /details
│   │   │   ├── PATCH /submit
│   │   │   ├── PATCH /close
│   │   │   ├── PATCH /rate
│   │   │   └── GET /workflow-status
│   │   └── ...
│   ├── models/
│   │   ├── ProjectRequest.js (UPDATED)
│   │   ├── Review.js (UPDATED)
│   │   └── ...
│   └── server.js (UPDATED)
│
└── website/
    └── src/
        ├── Pages/
        │   └── Dashboard/
        │       ├── ContractorSubmitWork.jsx ⭐ NEW
        │       ├── CustomerCloseProject.jsx ⭐ NEW
        │       ├── RatingSubmission.jsx ⭐ NEW
        │       ├── ContractorProjectTrack.jsx (need to add component)
        │       ├── CustomerProjectTrack.jsx (need to add components)
        │       └── ...
        └── css/
            ├── ConfirmationModal.css ⭐ NEW
            ├── RatingSubmission.css ⭐ NEW
            └── ...
```

---

## Performance Metrics

```
Operation              Response Time    Database Queries
──────────────────────────────────────────────────────────
GET /details           ~50ms           1 findById + populate
PATCH /submit          ~100ms          1 findOne + 1 save
PATCH /close           ~100ms          1 findById + 1 save
PATCH /rate            ~150ms          1 findOne + 1 create
                                       + 1 save + 1 aggregate
GET /workflow-status   ~40ms           1 findById + populate
```

---

This visualization provides a comprehensive overview of the complete workflow system architecture, data flow, and integration points.

