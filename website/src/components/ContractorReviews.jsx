import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ContractorReviews.css";

const ContractorReviews = ({ contractorId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetchContractorReviews();
  }, [contractorId]);

  const fetchContractorReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/reviews/contractor/${contractorId}`
      );

      setReviews(response.data.reviews || []);
      setStats(response.data.stats || null);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  if (error) {
    return <div className="reviews-error">{error}</div>;
  }

  // Filter reviews
  let filteredReviews = reviews;
  if (filterRating !== "all") {
    filteredReviews = reviews.filter(
      (r) => r.rating === parseInt(filterRating)
    );
  }

  // Sort reviews
  if (sortBy === "recent") {
    filteredReviews = [...filteredReviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (sortBy === "highest") {
    filteredReviews = [...filteredReviews].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "lowest") {
    filteredReviews = [...filteredReviews].sort((a, b) => a.rating - b.rating);
  }

  return (
    <div className="contractor-reviews-container">
      <div className="reviews-header">
        <h2 className="reviews-title">Customer Reviews</h2>
      </div>

      {stats && reviews.length > 0 && (
        <div className="reviews-summary">
          <div className="summary-card">
            <div className="average-rating">
              <div className="rating-number">{stats.averageRating}</div>
              <div className="stars">
                {"★".repeat(Math.round(stats.averageRating))}
                {"☆".repeat(5 - Math.round(stats.averageRating))}
              </div>
              <div className="rating-count">
                Based on {stats.totalReviews} review
                {stats.totalReviews !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="rating-bar">
                  <div className="rating-label">{rating}★</div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${
                          stats.totalReviews > 0
                            ? (stats.ratingDistribution[rating] /
                                stats.totalReviews) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="rating-count-small">
                    {stats.ratingDistribution[rating]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <div className="no-reviews-icon">📝</div>
          <p>No reviews yet. Reviews will appear here as projects are completed.</p>
        </div>
      ) : (
        <>
          <div className="reviews-controls">
            <div className="filter-group">
              <label htmlFor="filter-rating">Filter by Rating:</label>
              <select
                id="filter-rating"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="sort-group">
              <label htmlFor="sort-by">Sort by:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          <div className="reviews-list">
            {filteredReviews.length === 0 ? (
              <div className="no-filtered-reviews">
                No reviews match the selected filter.
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header-item">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.customer?.profilePic ? (
                          <img
                            src={`http://localhost:3001/customer_images/${review.customer.profilePic}`}
                            alt={review.customer?.name}
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {review.customer?.name?.charAt(0) || "C"}
                          </div>
                        )}
                      </div>
                      <div className="reviewer-details">
                        <div className="reviewer-name">
                          {review.customer?.name || "Anonymous Customer"}
                        </div>
                        <div className="review-date">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="review-rating">
                      <span className="stars">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <span className="rating-label">{review.rating}/5</span>
                    </div>
                  </div>

                  <div className="review-content-item">
                    <p className="review-text">{review.comment}</p>
                  </div>

                  <div className="review-footer">
                    <span
                      className={`visibility-badge ${
                        review.isPublic ? "public" : "private"
                      }`}
                    >
                      {review.isPublic ? "🔓 Public" : "🔒 Private"}
                    </span>
                    {review.project && (
                      <span className="project-link">
                        For project: {review.project.title}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ContractorReviews;
