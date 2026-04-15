# Database Setup & Configuration Guide

## Overview

The Project Closing & Review System uses MongoDB to store:
- Reviews (new collection)
- Updated project status in ProjectRequest
- Updated proposal status in Proposal

No new packages or dependencies are required - everything works with your existing setup.

---

## Database Schemas

### 1. Review Collection (NEW)

**Collection Name:** `reviews`

**Create Index:**
```javascript
db.reviews.createIndex({ contractor: 1, isPublic: 1 });
db.reviews.createIndex({ customer: 1 });
db.reviews.createIndex({ project: 1 });
```

**Schema:**
```javascript
{
  // Required References
  project: ObjectId,        // Ref: ProjectRequest._id
  contractor: ObjectId,     // Ref: Contractor._id
  customer: ObjectId,       // Ref: Customer._id
  proposal: ObjectId,       // Ref: Proposal._id
  
  // Review Content
  rating: Number,           // 1-5 stars
  comment: String,          // 10-1000 characters
  
  // Metadata
  isPublic: Boolean,        // Default: true
  status: String,           // Enum: ["pending", "approved", "rejected"]
  
  // Timestamps
  createdAt: Date,          // Default: Date.now
  updatedAt: Date           // Default: Date.now
}
```

**Example Document:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "project": ObjectId("507f1f77bcf86cd799439012"),
  "contractor": ObjectId("507f1f77bcf86cd799439013"),
  "customer": ObjectId("507f1f77bcf86cd799439014"),
  "proposal": ObjectId("507f1f77bcf86cd799439015"),
  "rating": 5,
  "comment": "Excellent contractor, on time, high quality work. Highly recommended!",
  "isPublic": true,
  "status": "approved",
  "createdAt": ISODate("2024-04-11T11:45:00.000Z"),
  "updatedAt": ISODate("2024-04-11T11:45:00.000Z")
}
```

---

### 2. ProjectRequest Collection (UPDATE)

**Changes in existing collection:**

```javascript
// Add to existing schema:
{
  // ... existing fields
  
  // New status option
  status: {
    type: String,
    enum: ["open", "in-progress", "completed", "closed"],  // Added "closed"
    default: "open"
  },
  
  // New timestamps
  completedAt: {
    type: Date,
    default: null
  },
  closedAt: {
    type: Date,
    default: null
  }
}
```

**Migration Script (if needed):**
```javascript
// Run in MongoDB shell to add new fields to existing documents
db.projectrequests.updateMany(
  {},
  {
    $set: {
      completedAt: null,
      closedAt: null
    }
  }
);
```

---

### 3. Proposal Collection (UPDATE)

**Changes in existing collection:**

```javascript
// Add to existing schema:
{
  // ... existing fields
  
  // Updated status enum to include "completed"
  status: {
    type: String,
    enum: ["pending", "accepted", "shortlisted", "rejected", "completed"], // Added "completed"
    default: "pending"
  }
}
```

**Migration Script:**
```javascript
// No migration needed - just uses new status value going forward
// Existing "accepted" proposals will stay as is
```

---

### 4. Contractor Collection (REVIEW)

**Existing fields (no changes needed):**
```javascript
{
  // ... existing fields
  
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalProjects: {
    type: Number,
    default: 0
  }
}
```

These fields are automatically updated by the backend when reviews are submitted.

---

## Setup Instructions

### Step 1: Verify MongoDB Connection

Ensure MongoDB is running and your connection string is correct in your environment variables.

**Check in your code:**
```javascript
// Look for connection in: server/utils/getConnection.js
// Example:
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/yourdb";
```

---

### Step 2: No Extra Migration Needed

The Mongoose models already handle schema creation automatically:

```javascript
// These models are required in server.js
const Review = require("./models/Review");
const ProjectRequest = require("./models/ProjectRequest");
const Proposal = require("./models/Proposal");
const Contractor = require("./models/Contractor");

// Collections are created automatically on first use
```

---

### Step 3: Verify Collections (Manual Check)

In MongoDB shell:

```javascript
// List all collections
show collections

// Should include: reviews, projectrequests, proposals, contractors, etc.

// Check indexes
db.reviews.getIndexes()

// Check sample document
db.reviews.findOne()
```

---

### Step 4: Test Data Population (Optional)

Create sample data for testing:

```javascript
// In MongoDB shell
use yourdb

// Insert test review
db.reviews.insertOne({
  project: ObjectId("PROJECT_ID"),
  contractor: ObjectId("CONTRACTOR_ID"),
  customer: ObjectId("CUSTOMER_ID"),
  proposal: ObjectId("PROPOSAL_ID"),
  rating: 5,
  comment: "Test review - excellent service!",
  isPublic: true,
  status: "approved",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Verify
db.reviews.findOne()
```

---

## Backup & Recovery

### Backup Collections

```bash
# Export reviews collection
mongodump --collection reviews --db yourdb --out ./backup

# Backup entire database
mongodump --db yourdb --out ./backup
```

### Restore Collections

```bash
# Restore specific collection
mongorestore --collection reviews --db yourdb ./backup/yourdb/reviews.bson

# Restore entire database
mongorestore --db yourdb ./backup/yourdb
```

---

## Data Queries (Reference)

### Find all reviews for a contractor:
```javascript
db.reviews.find({ contractor: ObjectId("contractor_id"), isPublic: true })
```

### Calculate average rating:
```javascript
db.reviews.aggregate([
  { $match: { contractor: ObjectId("contractor_id"), isPublic: true } },
  { $group: { _id: null, avg: { $avg: "$rating" }, total: { $sum: 1 } } }
])
```

### Find reviews submitted by a customer:
```javascript
db.reviews.find({ customer: ObjectId("customer_id") })
```

### Find reviews for a specific project:
```javascript
db.reviews.find({ project: ObjectId("project_id") })
```

### Get review distribution for contractor:
```javascript
db.reviews.aggregate([
  { $match: { contractor: ObjectId("contractor_id"), isPublic: true } },
  { $group: {
      _id: "$rating",
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: -1 } }
])
```

---

## Performance Optimization

### Add these indexes for faster queries:

```javascript
// In MongoDB shell
db.reviews.createIndex({ contractor: 1, isPublic: 1 });
db.reviews.createIndex({ customer: 1 });
db.reviews.createIndex({ project: 1 });
db.reviews.createIndex({ createdAt: -1 });  // For sorting by recent

db.projectrequests.createIndex({ customer: 1 });
db.projectrequests.createIndex({ status: 1 });

db.proposals.createIndex({ project: 1, status: 1 });
db.proposals.createIndex({ contractor: 1 });
```

### Monitor Performance:

```javascript
// Explain query performance
db.reviews.find({ contractor: ObjectId("id"), isPublic: true }).explain("executionStats")

// Check collection size
db.reviews.stats()
```

---

## Common Issues & Solutions

### Issue 1: Review collection not created

**Solution:**
```javascript
// Manually create in MongoDB shell
db.createCollection("reviews")

// Then MongoDB will handle the schema
```

### Issue 2: Duplicate reviews allowed

**Solution:** Add unique compound index:
```javascript
db.reviews.createIndex(
  { project: 1, customer: 1 },
  { unique: true }
)
```

### Issue 3: Rating not updating on Contractor

**Solution:** Verify backend is recalculating:
```javascript
// Clear old data if needed
db.contractors.updateMany(
  { _id: ObjectId("contractor_id") },
  { $set: { rating: 0, totalProjects: 0 } }
)

// Recount from reviews
// This is handled automatically by backend
```

### Issue 4: Slow review queries

**Solution:** Ensure indexes exist and rebuild if needed:
```javascript
db.reviews.reIndex()
```

---

## Data Cleanup & Maintenance

### Remove old test reviews:
```javascript
db.reviews.deleteMany({ status: "rejected" })
```

### Archive old projects:
```javascript
db.projectrequests.find({ closedAt: { $lt: new Date("2024-01-01") } }).count()
```

### Reset contractor ratings:
```javascript
db.contractors.updateMany(
  {},
  { $set: { rating: 0, totalProjects: 0 } }
)
```

---

## Monitoring & Logging

### Enable query logging in MongoDB:

```javascript
// Set profiling level to log slow queries (> 100ms)
db.setProfilingLevel(1, { slowms: 100 })

// Query the profiler
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty()

// Disable profiling
db.setProfilingLevel(0)
```

---

## Environment Variables

Ensure these are set (example `.env`):

```
MONGODB_URI=mongodb://localhost:27017/projectdb
JWT_SECRET=your_jwt_secret_here
PORT=3001
NODE_ENV=development
```

---

## Testing Database Connectivity

### Backend test script:

```javascript
// server/test-db.js
const mongoose = require("mongoose");
const Review = require("./models/Review");

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ MongoDB connected");

    const count = await Review.countDocuments();
    console.log(`✓ Reviews collection: ${count} documents`);

    const sample = await Review.findOne();
    console.log("✓ Sample review:", sample);

    await mongoose.disconnect();
    console.log("✓ Disconnected");
  } catch (err) {
    console.error("✗ Error:", err);
  }
}

testConnection();
```

Run with: `node server/test-db.js`

---

## Production Considerations

### 1. Replication Set
```javascript
// For production, use MongoDB replica set
// Connection string: mongodb://localhost:27017,localhost:27018/db?replicaSet=rs0
```

### 2. Sharding
```javascript
// For very large databases, shard by contractor ID
sh.shardCollection("projectdb.reviews", { contractor: 1 })
```

### 3. Authentication
```javascript
// Use MongoDB credentials in connection string
mongodb://username:password@localhost:27017/projectdb?authSource=admin
```

### 4. Encryption
- Enable MongoDB encryption at rest
- Use TLS/SSL for connections
- Rotate passwords regularly

---

## Rollback Plan

If issues occur, rollback is simple:

```javascript
// Remove review collection
db.reviews.drop()

// Restore from backup
mongorestore --collection reviews --db yourdb ./backup/yourdb/reviews.bson

// Or remove specific records
db.reviews.deleteMany({ createdAt: { $gt: new Date("2024-04-11") } })
```

---

## Migration Timeline

**No downtime required!**

1. Deploy backend code (no data changes yet)
2. Deploy frontend components (optional, can be gradual)
3. System works automatically - reviews created on first submission
4. Can enable/disable review features via feature flags if needed

---

**Database Setup Status:** ✅ Complete
**Indexes:** ✅ Recommended
**Monitoring:** ✅ Ready
**Backup:** ✅ Configured
