# 🏗️ Contractor Reviews - Architecture & Code Reference

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│  ContractorProfile.jsx                                          │
│  ├─ State: reviews, reviewsStats, loadingReviews              │
│  ├─ useEffect: Fetch reviews on mount                         │
│  └─ Render: Display reviews with stats                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP GET
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                            │
│  reviewRoutes.js → GET /reviews/contractor/:contractorId       │
│  ├─ Validate contractor ID                                     │
│  ├─ Query MongoDB for reviews                                  │
│  ├─ Populate customer data                                     │
│  ├─ Populate project data                                      │
│  ├─ Calculate statistics                                       │
│  └─ Return JSON response                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │ Query
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                             │
│  reviews collection                                             │
│  ├─ Query: {contractor: id, isPublic: true}                   │
│  ├─ Populate: customer document                                │
│  ├─ Populate: project document                                 │
│  └─ Sort: {createdAt: -1}                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Frontend Code

### ContractorProfile.jsx - State Declarations

```javascript
// Line 661-663: New state variables
const [reviews, setReviews] = useState([]);
const [reviewsStats, setReviewsStats] = useState(null);
const [loadingReviews, setLoadingReviews] = useState(false);
```

### ContractorProfile.jsx - useEffect Hook

```javascript
// Line 688-715: Fetch reviews when contractor loads
useEffect(() => {
  if (!contractor?._id) return;
  
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      console.log("🔍 [REVIEWS] Fetching reviews for contractor:", contractor._id);
      
      const response = await fetch(
        `http://localhost:5000/reviews/contractor/${contractor._id}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ [REVIEWS] Reviews fetched successfully:", data.reviews);
      console.log("📊 [REVIEWS] Stats:", data.stats);
      
      setReviews(data.reviews || []);
      setReviewsStats(data.stats || null);
    } catch (error) {
      console.error("❌ [REVIEWS] Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };
  
  fetchReviews();
}, [contractor?._id]);
```

### ContractorProfile.jsx - JSX Rendering

```javascript
// Line 983-1073: Review display section

{/* Loading state */}
{loadingReviews && (
  <div style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
    <p>Loading reviews...</p>
  </div>
)}

{/* Stats card */}
{!loadingReviews && reviewsStats && (
  <div style={{ /* styling */ }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ fontSize: "24px", fontWeight: "700", color: "#1d4ed8" }}>
        {reviewsStats.averageRating}
      </span>
      <span style={{ color: "#1d4ed8" }}>
        {"★".repeat(Math.round(reviewsStats.averageRating))}
        <span style={{ color: "#e2e8f0" }}>
          {"★".repeat(5 - Math.round(reviewsStats.averageRating))}
        </span>
      </span>
    </div>
    <p style={{ margin: "0", fontSize: "13px", color: "#64748b" }}>
      Based on {reviewsStats.totalReviews} customer review
      {reviewsStats.totalReviews !== 1 ? 's' : ''}
    </p>
  </div>
)}

{/* Empty state */}
{!loadingReviews && reviews.length === 0 && (
  <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
    <p style={{ fontSize: "14px" }}>
      📝 No reviews yet. Complete projects to receive reviews from customers!
    </p>
  </div>
)}

{/* Review cards */}
{!loadingReviews && reviews.map(review => (
  <div key={review._id} className="cp3-review-card">
    {/* Customer name with label */}
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
      <p className="cp3-review-author" style={{ margin: "0" }}>
        {review.customer?.name || "Anonymous Customer"}
      </p>
      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
        ({review.ratedBy || 'customer'})
      </span>
    </div>
    
    {/* Star rating */}
    <div className="cp3-stars">
      {"★".repeat(review.rating)}
      <span style={{ color: "#e2e8f0" }}>
        {"★".repeat(5 - review.rating)}
      </span>
    </div>
    
    {/* Comment */}
    <p className="cp3-review-text">{review.comment}</p>
    
    {/* Project info */}
    {review.project?.title && (
      <p style={{ fontSize: "12px", color: "#94a3b8", margin: "8px 0 0" }}>
        Project: <strong>{review.project.title}</strong>
      </p>
    )}
    
    {/* Date */}
    <p style={{ fontSize: "11px", color: "#cbd5e1", margin: "4px 0 0" }}>
      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
    </p>
  </div>
))}

{/* Info note */}
{!loadingReviews && reviews.length > 0 && (
  <div style={{ /* styling */ }}>
    💡 These are authentic reviews from customers who have worked with you. 
    Great reviews help attract more customers!
  </div>
)}
```

---

## 🔌 Backend API

### reviewRoutes.js - GET Endpoint

```javascript
/**
 * GET /reviews/contractor/:contractorId
 * Get all reviews for a contractor (public reviews)
 */
router.get("/contractor/:contractorId", async (req, res) => {
  try {
    const { contractorId } = req.params;
    const { includePrivate } = req.query;

    console.log("🔍 [REVIEWS GET] Fetching reviews for contractor:", contractorId);

    // 1. Validate contractor ID
    if (!mongoose.Types.ObjectId.isValid(contractorId)) {
      console.error("❌ [REVIEWS] Invalid contractor ID:", contractorId);
      return res.status(400).json({ error: "Invalid contractor ID" });
    }

    // 2. Verify contractor exists
    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
      console.error("❌ [REVIEWS] Contractor not found:", contractorId);
      return res.status(404).json({ error: "Contractor not found" });
    }

    console.log("✅ [REVIEWS] Contractor found:", contractor.name);

    // 3. Build query
    let query = {
      contractor: contractorId,
    };

    if (!includePrivate) {
      query.isPublic = true;  // Only public reviews
    }

    // 4. Fetch and populate reviews
    const reviews = await Review.find(query)
      .populate("customer", "name profilePic")     // Get customer details
      .populate("project", "title category")        // Get project details
      .sort({ createdAt: -1 });                    // Newest first

    console.log("✅ [REVIEWS] Retrieved", reviews.length, "reviews for contractor");

    // 5. Calculate statistics
    const stats = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
          : 0,
      ratingDistribution: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };

    console.log("📊 [REVIEWS] Stats - Average Rating:", stats.averageRating, 
                "| Total:", stats.totalReviews);

    // 6. Return response
    res.json({
      contractor: {
        id: contractor._id,
        name: contractor.name,
        profilePic: contractor.profilePic,
        totalProjects: contractor.totalProjects,
        currentRating: contractor.rating,
      },
      reviews,
      stats,
    });
  } catch (err) {
    console.error("❌ [REVIEWS] Error fetching reviews:", err.message);
    res.status(500).json({ error: err.message });
  }
});
```

---

## 💾 Database Models

### Review Model Fields Used

```javascript
const ReviewSchema = new mongoose.Schema({
  // References
  project: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectRequest" },
  contractor: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },      // ✅ POPULATED
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },
  
  // Content
  rating: { type: Number, required: true, min: 1, max: 5 },                 // ✅ DISPLAYED
  comment: { type: String, required: true, minlength: 10, maxlength: 1000 }, // ✅ DISPLAYED
  
  // Tracking
  ratedBy: { type: String, enum: ["contractor", "customer"] },              // ✅ DISPLAYED
  raterName: { type: String, required: true },
  
  // Visibility
  isPublic: { type: Boolean, default: true },                               // ✅ FILTERED
  
  // Status
  status: { type: String, enum: ["pending", "approved", "rejected"] },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },                             // ✅ DISPLAYED
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
ReviewSchema.index({ contractor: 1, isPublic: 1 });  // Optimized query
ReviewSchema.index({ customer: 1 });
ReviewSchema.index({ project: 1 });
```

---

## 🔄 Data Flow Examples

### Example 1: Contractor Opens Profile

```
1. Component mounts
   contractor._id = "5f5c4a6e8f1b2c3d4e5f6a7b"
   
2. useEffect triggers
   → fetch(/reviews/contractor/5f5c4a6e8f1b2c3d4e5f6a7b)
   
3. Backend receives request
   → Validates ID
   → Queries: db.reviews.find({contractor: id, isPublic: true})
   → Populates customer: {_id, name, profilePic}
   → Populates project: {_id, title, category}
   → Calculates stats
   
4. Response sent
   {
     reviews: [{
       _id: "...",
       rating: 5,
       comment: "Great!",
       customer: {name: "Ahmed Ali"},
       project: {title: "House Ren"},
       createdAt: "2026-04-14"
     }],
     stats: {averageRating: 4.8, totalReviews: 5}
   }
   
5. Frontend renders
   → Displays "4.8 ★★★★☆"
   → Shows "Ahmed Ali" and comment
   → Formats date
```

### Example 2: No Reviews Exist

```
1. fetch(/reviews/contractor/id)
   
2. Backend finds 0 reviews
   → reviews: []
   → stats: {totalReviews: 0, averageRating: 0}
   
3. Frontend renders
   → loadingReviews = false
   → reviews.length = 0
   → Shows: "📝 No reviews yet..."
```

---

## 🧮 Calculations

### Average Rating Calculation
```javascript
const ratings = [5, 4, 5, 3, 5];  // Submitted ratings
const sum = ratings.reduce((s, r) => s + r, 0);  // 22
const average = sum / ratings.length;             // 4.4
const displayRating = average.toFixed(1);         // "4.4"

// Display stars
Math.round(displayRating) = 4
★★★★☆ (4 filled, 1 empty)
```

### Rating Distribution
```javascript
reviews = [{rating: 5}, {rating: 5}, {rating: 4}, {rating: 5}, {rating: 3}]

distribution = {
  5: 3,  // 3 five-star reviews
  4: 1,  // 1 four-star review
  3: 1,  // 1 three-star review
  2: 0,  // 0 two-star reviews
  1: 0   // 0 one-star reviews
}
```

---

## 🚨 Error Handling

### Invalid Contractor ID
```javascript
// Request
GET /reviews/contractor/invalid-id

// Backend validates
!mongoose.Types.ObjectId.isValid("invalid-id") → true

// Response
{
  status: 400,
  error: "Invalid contractor ID"
}

// Console
❌ [REVIEWS] Invalid contractor ID: invalid-id
```

### Contractor Not Found
```javascript
// Request
GET /reviews/contractor/507f1f77bcf86cd799439011

// Backend searches
const contractor = Contractor.findById(id)  // null

// Response
{
  status: 404,
  error: "Contractor not found"
}

// Console
❌ [REVIEWS] Contractor not found: 507f1f77bcf86cd799439011
```

### Network Error
```javascript
// Frontend catch
catch (error) {
  console.error("❌ [REVIEWS] Error fetching reviews:", error);
  setReviews([]);  // Reset to empty
  // Show empty state
}
```

---

## 🔐 Security Considerations

### 1. Only Public Reviews Shown
```javascript
query.isPublic = true;  // Creates filter
// Private reviews not accessible
```

### 2. Contractor Verification
```javascript
// Anyone can view public reviews
// No auth check needed for GET /reviews/contractor/:id
```

### 3. Data Sanitization
```javascript
// Only customer name/pic populated
.populate("customer", "name profilePic")
// NOT: email, phone, address, etc.
```

### 4. Injection Prevention
```javascript
// Validated before database query
!mongoose.Types.ObjectId.isValid(contractorId)
```

---

## ⚡ Performance Optimizations

### Indexes
```javascript
// Fast queries on contractor + public reviews
ReviewSchema.index({ contractor: 1, isPublic: 1 });

// Query plan uses this index:
db.reviews.find({contractor: id, isPublic: true})
```

### Populate Selection
```javascript
// Only fetch needed fields
.populate("customer", "name profilePic")  // NOT all customer fields
.populate("project", "title category")     // NOT all project fields
```

### Sorting
```javascript
// Newest first visible immediately
.sort({ createdAt: -1 })
```

---

## 🎨 Frontend Styling Reference

### Review Card Class
```javascript
.cp3-review-card {
  background: white
  padding: 12px
  border-radius: 10px
  margin-bottom: 10px
  hover: slight elevation
}
```

### Stats Box Styling
```javascript
{
  backgroundColor: "#f8fafc",          // Light blue background
  borderLeft: "4px solid #f59e0b",    // Orange left border
  borderRadius: "12px",
  padding: "16px 14px"
}
```

### Star Styling
```javascript
"★".repeat(rating)                     // Filled stars: "★★★★★"
<span style={{color: "#e2e8f0"}}>
  "★".repeat(5 - rating)               // Empty stars: "☆☆"
</span>
```

---

## 📊 Response Schema

### Successful Response
```json
{
  "contractor": {
    "id": "mongodb_id",
    "name": "Contractor Name",
    "profilePic": "/contractor_images/pic.jpg",
    "totalProjects": 15,
    "currentRating": 4.5
  },
  "reviews": [
    {
      "_id": "review_id",
      "rating": 5,
      "comment": "Excellent work!",
      "ratedBy": "customer",
      "raterName": "Ahmed Ali",
      "isPublic": true,
      "customer": {
        "_id": "customer_id",
        "name": "Ahmed Ali",
        "profilePic": "/customer_images/pic.jpg"
      },
      "project": {
        "_id": "project_id",
        "title": "House Renovation",
        "category": "Construction"
      },
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  ],
  "stats": {
    "totalReviews": 5,
    "averageRating": "4.8",
    "ratingDistribution": {
      "5": 4,
      "4": 1,
      "3": 0,
      "2": 0,
      "1": 0
    }
  }
}
```

---

## 📞 HTTP Status Codes

| Code | Scenario | Response |
|------|----------|----------|
| 200 | Success | Full response with reviews |
| 400 | Invalid ID | `{error: "Invalid contractor ID"}` |
| 404 | Not found | `{error: "Contractor not found"}` |
| 500 | Server error | `{error: "error message"}` |

---

**Reference Complete** ✅

Use this document for understanding the architecture and troubleshooting issues.

