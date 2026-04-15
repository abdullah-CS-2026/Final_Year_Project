# ⚠️ Backend Setup Required

## Current Issue
The frontend is trying to connect to the backend server on `http://localhost:3001`, but:
1. **Backend server is not running**
2. **Backend routes don't exist yet**

## What You Need to Do

### Step 1: Start the Backend Server
Open a terminal in the `server` folder and run:
```bash
cd server
npm start
```

The server should start on `http://localhost:3001`

You should see output like:
```
✅ Server started on port 3001
Connected to MongoDB
```

### Step 2: Create Backend Routes & Models

The frontend is calling these endpoints that don't exist yet:

**Endpoints needed:**
- `GET /projects/:projectId/details` - Get project details
- `GET /projects/:projectId/review-status` - Check if customer can review
- `POST /projects/:projectId/close` - Close a project
- `POST /projects/:projectId/review` - Submit a review

**You need to create these files in the `server` folder:**

#### 1. Create `server/models/Review.js`
```javascript
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectRequest", required: true },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },
  contractor: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, minlength: 10, maxlength: 1000 },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("Review", reviewSchema);
```

#### 2. Create `server/routes/projectRoutes.js`
```javascript
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ProjectRequest = require("../models/ProjectRequest");
const Proposal = require("../models/Proposal");
const Review = require("../models/Review");

// Get project details
router.get("/:projectId/details", authMiddleware, async (req, res) => {
  try {
    const project = await ProjectRequest.findById(req.params.projectId);
    const proposal = await Proposal.findOne({ project: req.params.projectId });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ project, proposal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Close a project
router.post("/:projectId/close", authMiddleware, async (req, res) => {
  try {
    const project = await ProjectRequest.findByIdAndUpdate(
      req.params.projectId,
      { status: "closed", closedAt: new Date() },
      { new: true }
    );

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a review
router.post("/:projectId/review", authMiddleware, async (req, res) => {
  try {
    const { rating, comment, isPublic } = req.body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1-5" });
    }
    if (!comment || comment.length < 10 || comment.length > 1000) {
      return res.status(400).json({ error: "Comment must be 10-1000 characters" });
    }

    // Check if review already exists
    let review = await Review.findOne({ project: req.params.projectId, customer: req.body.customerId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment;
      review.isPublic = isPublic;
      review.updatedAt = new Date();
      await review.save();
    } else {
      // Create new review
      review = new Review({
        project: req.params.projectId,
        contractor: req.body.contractorId,
        customer: req.body.customerId,
        rating,
        comment,
        isPublic,
      });
      await review.save();
    }

    // Update contractor's average rating
    const avg = await Review.aggregate([
      { $match: { contractor: review.contractor, isDeleted: false } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    if (avg.length > 0) {
      await require("../models/Contractor").findByIdAndUpdate(
        review.contractor,
        { rating: Math.round(avg[0].avgRating * 10) / 10 }
      );
    }

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check review status
router.get("/:projectId/review-status", authMiddleware, async (req, res) => {
  try {
    const project = await ProjectRequest.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const review = await Review.findOne({
      project: req.params.projectId,
      customer: req.query.customerId
    });

    res.json({
      canReview: project.status === "closed",
      reason: project.status === "closed" ? "" : "Project must be closed first",
      review: review || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

#### 3. Update `server/models/ProjectRequest.js`
Add these fields to the schema (if not present):
```javascript
status: { 
  type: String, 
  enum: ["open", "in-progress", "completed", "closed"], 
  default: "open" 
},
closedAt: Date,
```

#### 4. Update `server/server.js`
Add these routes (around line where you register other routes):
```javascript
const projectRoutes = require("./routes/projectRoutes");

// ... other route registrations ...

app.use("/projects", projectRoutes);
```

### Step 3: Test the Backend

Once everything is set up:

1. **Start the backend**
```bash
cd server
npm start
```

2. **Start the frontend** (in another terminal)
```bash
cd website
npm run dev
```

3. **Visit the app**
```
http://localhost:5173
```

4. **Login and test:**
   - Login as Customer
   - Go to Project Track
   - Scroll down to see "🔒 Close & Review Project"
   - Click the button to test the flow

## Checklist

- ✅ Frontend components fixed (already done)
- ⬜ Create Review.js model
- ⬜ Create projectRoutes.js 
- ⬜ Update ProjectRequest.js model
- ⬜ Update server.js with routes
- ⬜ Start backend server with `npm start`
- ⬜ Test the components

## Expected Behavior After Setup

**Without Backend:**
- Page loads but shows "Backend server is not running" messages
- Components render with default state
- No functionality works

**With Backend:**
- ✅ Components fetch project details
- ✅ Customer can close project
- ✅ Customer can submit review
- ✅ Contractor rating updates automatically
- ✅ Reviews persist in database

---

**Questions?** Check the DATABASE_SETUP.md and API_DOCUMENTATION.md for more details.
