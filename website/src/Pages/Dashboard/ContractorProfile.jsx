import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, FaIdCard, FaStar, FaCertificate } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Shield, FileText, Award, Send } from "lucide-react";
import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_API_URL;
/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cp3-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 56px 28px 80px;
  }

  /* ══ Page Header ══ */
  .cp3-page-header {
    text-align: center;
    margin-bottom: 48px;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cp3-eyebrow {
    display: inline-block;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2.8px;
    text-transform: uppercase;
    color: #1d4ed8;
    background: rgba(37,99,235,0.1);
    border: 1.5px solid rgba(37,99,235,0.25);
    padding: 7px 20px;
    border-radius: 999px;
    margin-bottom: 16px;
  }

  .cp3-page-title {
    font-size: clamp(30px, 5vw, 46px);
    font-weight: 800;
    color: #0a0f1e;
    margin: 0 0 10px;
    line-height: 1.12;
    letter-spacing: -0.6px;
  }

  .cp3-page-title span {
    background: linear-gradient(135deg, #1d4ed8 20%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cp3-page-sub {
    font-size: 17px;
    color: #64748b;
    font-weight: 600;
    margin: 0;
  }

  /* ══ Two-column layout ══ */
  .cp3-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 28px;
    max-width: 1200px;
    margin: 0 auto;
    align-items: start;
  }

  /* ══ Cards ══ */
  .cp3-card {
    background: #fff;
    border-radius: 22px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 6px 24px rgba(37,99,235,0.09);
    overflow: hidden;
    animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cp3-card:nth-child(1) { animation-delay: 0.08s; }
  .cp3-card:nth-child(2) { animation-delay: 0.14s; }
  .cp3-card:nth-child(3) { animation-delay: 0.20s; }

  /* Card banner */
  .cp3-card-banner {
    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #3b82f6 100%);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    overflow: hidden;
  }

  .cp3-card-banner.green {
    background: linear-gradient(135deg, #15803d 0%, #16a34a 55%, #22c55e 100%);
  }

  .cp3-card-banner.teal {
    background: linear-gradient(135deg, #0e7490 0%, #0891b2 55%, #22d3ee 100%);
  }

  .cp3-card-banner::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 130px; height: 130px;
    background: radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .cp3-banner-icon {
    width: 44px; height: 44px;
    background: rgba(255,255,255,0.18);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 20px;
    position: relative; z-index: 1;
  }

  .cp3-banner-title {
    font-size: 19px;
    font-weight: 800;
    color: #fff;
    margin: 0;
    position: relative; z-index: 1;
    text-shadow: 0 1px 6px rgba(0,0,0,0.12);
  }

  .cp3-banner-sub {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.62);
    margin: 2px 0 0;
    position: relative; z-index: 1;
  }

  /* ══ Avatar Section ══ */
  .cp3-avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px 24px 28px;
    border-bottom: 1.5px solid #eef4ff;
    position: relative;
  }

  .cp3-avatar-ring {
    position: relative;
    width: 130px; height: 130px;
    margin-bottom: 16px;
  }

  .cp3-avatar-ring img,
  .cp3-avatar-ring .cp3-avatar-fallback {
    width: 130px; height: 130px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #bfdbfe;
    box-shadow: 0 6px 24px rgba(37,99,235,0.22);
    display: block;
  }

  .cp3-avatar-ring .cp3-avatar-fallback {
    background: linear-gradient(135deg, #e0eaff, #dbeeff);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #60a5fa;
  }

  .cp3-avatar-edit-btn {
    position: absolute;
    bottom: 2px; right: 2px;
    width: 38px; height: 38px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 3px 12px rgba(37,99,235,0.24);
    border: 2px solid #bfdbfe;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    color: #1d4ed8;
  }

  .cp3-avatar-edit-btn:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 18px rgba(37,99,235,0.34);
  }

  .cp3-avatar-del-btn {
    position: absolute;
    bottom: 2px; left: 2px;
    width: 38px; height: 38px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 3px 12px rgba(220,38,38,0.2);
    border: 2px solid #fecaca;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    color: #dc2626;
  }

  .cp3-avatar-del-btn:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 18px rgba(220,38,38,0.3);
  }

  .cp3-contractor-name {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px;
    text-align: center;
  }

  .cp3-contractor-email {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    text-align: center;
  }

  .cp3-unsaved-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(234,179,8,0.12);
    border: 1.5px solid rgba(234,179,8,0.35);
    color: #b45309;
    font-size: 12.5px;
    font-weight: 800;
    padding: 5px 14px;
    border-radius: 999px;
    margin-top: 12px;
    animation: pulseDot 2s infinite;
  }

  .cp3-unsaved-dot {
    width: 8px; height: 8px;
    background: #f59e0b;
    border-radius: 50%;
  }

  /* ══ Form Body ══ */
  .cp3-form-body {
    padding: 28px 28px 24px;
  }

  .cp3-section-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: #1d4ed8;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cp3-section-divider {
    height: 1.5px;
    background: linear-gradient(to right, #bfdbfe, transparent);
    margin: 24px 0;
  }

  /* ══ Field ══ */
  .cp3-field {
    margin-bottom: 18px;
  }

  .cp3-field-label {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 7px;
  }

  .cp3-input-wrap {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1.5px solid #e0eaff;
    border-radius: 13px;
    background: #f8faff;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .cp3-input-wrap:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    background: #fff;
  }

  .cp3-input-icon {
    width: 46px; height: 46px;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cp3-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    outline: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 11px 14px;
  }

  .cp3-input::placeholder { color: #cbd5e1; }

  /* ══ Two-column field grid ══ */
  .cp3-field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  /* ══ Action Buttons ══ */
  .cp3-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 28px 28px;
    border-top: 1.5px solid #eef4ff;
  }

  .cp3-cancel-btn {
    padding: 13px 26px;
    border-radius: 13px;
    border: 2px solid #e0eaff;
    background: #fff;
    color: #64748b;
    font-size: 15px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, transform 0.2s;
  }

  .cp3-cancel-btn:hover:not(:disabled) {
    border-color: #93c5fd;
    color: #1d4ed8;
    transform: translateY(-1px);
  }

  .cp3-cancel-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .cp3-save-btn {
    padding: 13px 30px;
    border-radius: 13px;
    border: none;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    color: #fff;
    font-size: 15px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 5px 16px rgba(29,78,216,0.34);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }

  .cp3-save-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(29,78,216,0.44);
  }

  .cp3-save-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ══ Documents Section ══ */
  .cp3-docs-body {
    padding: 24px 28px 28px;
  }

  .cp3-doc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 18px;
  }

  .cp3-doc-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .cp3-doc-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #64748b;
    text-align: center;
  }

  .cp3-doc-img {
    width: 100%;
    height: 130px;
    object-fit: cover;
    border-radius: 14px;
    border: 2px solid #bfdbfe;
    box-shadow: 0 4px 14px rgba(37,99,235,0.12);
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }

  .cp3-doc-img:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 28px rgba(37,99,235,0.22);
  }

  .cp3-no-docs {
    text-align: center;
    padding: 32px 0;
    font-size: 16px;
    font-weight: 600;
    color: #94a3b8;
  }

  /* ══ Certifications ══ */
  .cp3-cert-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;
  }

  .cp3-cert-img {
    width: 120px; height: 120px;
    object-fit: cover;
    border-radius: 12px;
    border: 2px solid #bfdbfe;
    box-shadow: 0 3px 10px rgba(37,99,235,0.12);
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }

  .cp3-cert-img:hover {
    transform: scale(1.07);
    box-shadow: 0 8px 22px rgba(37,99,235,0.24);
  }

  /* ══ Reviews Sidebar ══ */
  .cp3-reviews-body {
    padding: 20px 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cp3-review-card {
    background: #f8faff;
    border-radius: 14px;
    border: 1.5px solid #e0eaff;
    padding: 14px 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .cp3-review-card:hover {
    border-color: #93c5fd;
    box-shadow: 0 4px 16px rgba(37,99,235,0.1);
  }

  .cp3-review-author {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 5px;
  }

  .cp3-stars {
    color: #f59e0b;
    font-size: 16px;
    margin-bottom: 7px;
    letter-spacing: 1px;
  }

  .cp3-review-text {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    line-height: 1.6;
    margin: 0;
  }

  /* ══ Comment Box ══ */
  .cp3-comment-wrap {
    margin-top: 6px;
    padding-top: 18px;
    border-top: 1.5px solid #e0eaff;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cp3-comment-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #1d4ed8;
  }

  .cp3-comment-textarea {
    width: 100%;
    border: 1.5px solid #e0eaff;
    border-radius: 13px;
    background: #f8faff;
    font-size: 15px;
    font-weight: 500;
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 12px 14px;
    outline: none;
    resize: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .cp3-comment-textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    background: #fff;
  }

  .cp3-comment-textarea::placeholder { color: #cbd5e1; }

  .cp3-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px;
    border-radius: 13px;
    border: none;
    background: linear-gradient(135deg, #15803d, #22c55e);
    color: #fff;
    font-size: 15px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    width: 100%;
  }

  .cp3-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(22,163,74,0.42);
  }

  /* ══ No data states ══ */
  .cp3-no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #64748b;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
  }

  /* ══ Keyframes ══ */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseDot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.55; }
  }

  @media (max-width: 900px) {
    .cp3-layout { grid-template-columns: 1fr; }
  }
  @media (max-width: 520px) {
    .cp3-root { padding: 36px 14px 60px; }
    .cp3-page-title { font-size: 26px; }
    .cp3-field-grid { grid-template-columns: 1fr; }
    .cp3-form-body { padding: 20px 16px 16px; }
    .cp3-actions { padding: 16px; }
  }
`;

/* ═══════════════════════════════════════════
   FIELD COMPONENT
═══════════════════════════════════════════ */
const Field = ({ icon: Icon, label, name, type = "text", value, onChange }) => (
  <div className="cp3-field">
    <div className="cp3-field-label">
      <Icon size={12} /> {label}
    </div>
    <div className="cp3-input-wrap">
      <div className="cp3-input-icon">
        <Icon size={18} color="#fff" />
      </div>
      <input
        className="cp3-input"
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={label}
      />
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MOCK REVIEWS
═══════════════════════════════════════════ */
const REVIEWS = [
  { id: 1, author: "Client A", rating: 5, comment: "Excellent work, very professional and efficient!" },
  { id: 2, author: "Client B", rating: 4, comment: "Good communication and quality service." },
  { id: 3, author: "Client C", rating: 5, comment: "Highly recommended! Will definitely hire again." },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const ContractorProfile = () => {
  const [contractor,    setContractor]    = useState(null);
  const [originalData,  setOriginalData]  = useState(null);
  const [isChanged,     setIsChanged]     = useState(false);
  const [selectedFile,  setSelectedFile]  = useState(null);
  const [preview,       setPreview]       = useState(null);
  const [removeProfile, setRemoveProfile] = useState(false);
  const [reviews,       setReviews]       = useState([]);
  const [reviewsStats,  setReviewsStats]  = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);

  /* Load from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("contractor");
    if (stored) {
      const parsed = JSON.parse(stored);
      setContractor(parsed);
      setOriginalData(parsed);
    }
  }, []);

  /* Fetch fresh data */
  useEffect(() => {
    if (!contractor?._id) return;
    const fetchFreshData = async () => {
      const res  = await fetch(`${BASE_URL}/contractor/${contractor._id}`);
      const data = await res.json();
      localStorage.setItem("contractor", JSON.stringify(data));
      setOriginalData(data);
    };
    fetchFreshData();
  }, [contractor?._id]);

  /* Fetch contractor reviews */
  useEffect(() => {
    if (!contractor?._id) return;
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        console.log("🔍 [REVIEWS] Fetching reviews for contractor:", contractor._id);
        const response = await fetch(
          `${BASE_URL}/reviews/contractor/${contractor._id}`
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

  if (!contractor) {
    return (
      <>
        <style>{styles}</style>
        <div className="cp3-no-data">No contractor data found. Please login again.</div>
      </>
    );
  }

  /* ── Handlers (unchanged) ── */
  const handleChange = (e) => {
    const updated = { ...contractor, [e.target.name]: e.target.value };
    setContractor(updated);
    setIsChanged(JSON.stringify(updated) !== JSON.stringify(originalData));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setRemoveProfile(false);
      setIsChanged(true);
    }
  };

  const handleDeleteProfile = () => {
    Swal.fire({
      title: "Remove profile picture?",
      text: "Your current profile picture will be replaced by a default icon.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        setPreview(null);
        setSelectedFile(null);
        setRemoveProfile(true);
        setIsChanged(true);
        Swal.fire({ icon: "info", title: "Profile picture removed", text: "Click 'Save Changes' to apply this update.", timer: 2000, showConfirmButton: false });
      }
    });
  };

  const handleCancel = () => {
    setContractor(originalData);
    setPreview(null);
    setSelectedFile(null);
    setRemoveProfile(false);
    setIsChanged(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmUpdate = await Swal.fire({
      title: "Save changes?", text: "Your profile will be updated.", icon: "question",
      showCancelButton: true, confirmButtonText: "Yes, save it!", cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
    });
    if (!confirmUpdate.isConfirmed) return;

    try {
      const contractorId = contractor._id || contractor.id;
      if (!contractorId) throw new Error("Contractor ID missing. Please login again.");

      const body = new FormData();
      body.append("name",    contractor.name);
      body.append("email",   contractor.email);
      body.append("phone",   contractor.phone);
      body.append("address", contractor.address);
      body.append("gender",  contractor.gender);
      if (selectedFile)   body.append("profilePic",    selectedFile);
      if (removeProfile)  body.append("removeProfile", true);

      const res  = await fetch(`${BASE_URL}/contractor/update/${contractorId}`, { method: "PUT", body });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("contractor", JSON.stringify(data.contractor));
        setContractor(data.contractor);
        setOriginalData(data.contractor);
        setSelectedFile(null);
        setPreview(null);
        setRemoveProfile(false);
        setIsChanged(false);
        Swal.fire({ icon: "success", title: "Profile updated successfully ✅", timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Update failed", text: data.message, confirmButtonColor: "#d33" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error updating profile", text: err.message, confirmButtonColor: "#d33" });
    }
  };

  /* Avatar src */
  const avatarSrc = preview
    ? preview
    : contractor.profilePic
      ? `${BASE_URL}${contractor.profilePic}`
      : null;

  const hasDocs = contractor.cnicFront || contractor.cnicBack ||
    contractor.verificationImage || contractor.certifications?.length > 0;

  return (
    <>
      <style>{styles}</style>
      <div className="cp3-root">

        {/* ── Page header ── */}
        <div className="cp3-page-header">
          <span className="cp3-eyebrow">Contractor Portal</span>
          <h1 className="cp3-page-title">My <span>Profile</span></h1>
          <p className="cp3-page-sub">Manage your personal info, documents, and reputation</p>
        </div>

        <div className="cp3-layout">

          {/* ══ LEFT COLUMN ══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Profile Card */}
            <div className="cp3-card">
              <div className="cp3-card-banner">
                <div className="cp3-banner-icon">👷</div>
                <div>
                  <p className="cp3-banner-title">Contractor Profile</p>
                  <p className="cp3-banner-sub">Edit your personal & contact info</p>
                </div>
              </div>

              {/* Avatar */}
              <div className="cp3-avatar-section">
                <div className="cp3-avatar-ring">
                  {removeProfile ? (
                    <div className="cp3-avatar-fallback">
                      <IoPersonCircleSharp size={72} />
                    </div>
                  ) : avatarSrc ? (
                    <img src={avatarSrc} alt="Contractor" />
                  ) : (
                    <div className="cp3-avatar-fallback">
                      <IoPersonCircleSharp size={72} />
                    </div>
                  )}

                  {/* Edit button */}
                  <label htmlFor="profileUpload" className="cp3-avatar-edit-btn" title="Edit Profile Picture">
                    <FaEdit size={15} />
                  </label>

                  {/* Delete button */}
                  {!removeProfile && (preview || contractor.profilePic) && (
                    <span className="cp3-avatar-del-btn" title="Remove Profile Picture" onClick={handleDeleteProfile}>
                      <FaTrash size={14} />
                    </span>
                  )}

                  <input type="file" id="profileUpload" accept="image/*" hidden onChange={handleFileChange} />
                </div>

                <p className="cp3-contractor-name">{contractor.name || "Your Name"}</p>
                <p className="cp3-contractor-email">{contractor.email || ""}</p>

                {isChanged && (
                  <div className="cp3-unsaved-badge">
                    <span className="cp3-unsaved-dot" />
                    Unsaved changes
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="cp3-form-body">

                  {/* Personal Info */}
                  <p className="cp3-section-label"><FaUser size={13} /> Personal Information</p>
                  <div className="cp3-field-grid">
                    <Field icon={FaUser}       label="Full Name" name="name"   value={contractor.name}   onChange={handleChange} />
                    <Field icon={FaVenusMars}  label="Gender"    name="gender" value={contractor.gender} onChange={handleChange} />
                  </div>

                  <div className="cp3-section-divider" />

                  {/* Contact Info */}
                  <p className="cp3-section-label"><FaEnvelope size={13} /> Contact Information</p>
                  <div className="cp3-field-grid">
                    <Field icon={FaEnvelope} label="Email"   name="email" type="email" value={contractor.email} onChange={handleChange} />
                    <Field icon={FaPhone}    label="Phone"   name="phone"              value={contractor.phone} onChange={handleChange} />
                  </div>
                  <Field icon={FaMapMarkerAlt} label="Address" name="address" value={contractor.address} onChange={handleChange} />

                </div>

                {/* Actions */}
                <div className="cp3-actions">
                  <button type="button" className="cp3-cancel-btn" onClick={handleCancel} disabled={!isChanged}>
                    Cancel
                  </button>
                  <button type="submit" className="cp3-save-btn" disabled={!isChanged}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Documents Card */}
            <div className="cp3-card">
              <div className="cp3-card-banner teal">
                <div className="cp3-banner-icon"><Shield size={22} color="#fff" /></div>
                <div>
                  <p className="cp3-banner-title">Verification Documents</p>
                  <p className="cp3-banner-sub">CNIC, photo & certifications</p>
                </div>
              </div>

              <div className="cp3-docs-body">
                {!hasDocs ? (
                  <div className="cp3-no-docs">📂 No documents uploaded yet.</div>
                ) : (
                  <>
                    <div className="cp3-doc-grid">
                      {contractor.cnicFront && (
                        <div className="cp3-doc-item">
                          <span className="cp3-doc-label"><FaIdCard size={11} /> CNIC Front</span>
                          <img src={`${BASE_URL}${contractor.cnicFront}`} alt="CNIC Front" className="cp3-doc-img" />
                        </div>
                      )}
                      {contractor.cnicBack && (
                        <div className="cp3-doc-item">
                          <span className="cp3-doc-label"><FaIdCard size={11} /> CNIC Back</span>
                          <img src={`${BASE_URL}${contractor.cnicBack}`} alt="CNIC Back" className="cp3-doc-img" />
                        </div>
                      )}
                      {contractor.verificationImage && (
                        <div className="cp3-doc-item">
                          <span className="cp3-doc-label"><FaUser size={11} /> Verification Photo</span>
                          <img src={`${BASE_URL}${contractor.verificationImage}`} alt="Verification" className="cp3-doc-img" />
                        </div>
                      )}
                    </div>

                    {contractor.certifications?.length > 0 && (
                      <>
                        <div className="cp3-section-divider" style={{ margin: "20px 0 14px" }} />
                        <p className="cp3-section-label"><Award size={13} /> Certifications</p>
                        <div className="cp3-cert-grid">
                          {contractor.certifications.map((cert, i) => (
                            <img key={i} src={`${BASE_URL}${cert}`} alt={`Certificate-${i}`} className="cp3-cert-img" />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ══ RIGHT COLUMN — Reviews ══ */}
          <div className="cp3-card" style={{ alignSelf: "start" }}>
            <div className="cp3-card-banner green">
              <div className="cp3-banner-icon"><FaStar size={20} color="#fff" /></div>
              <div>
                <p className="cp3-banner-title">Reviews & Comments</p>
                <p className="cp3-banner-sub">What customers are saying</p>
              </div>
            </div>

            <div className="cp3-reviews-body">
              {/* Loading state */}
              {loadingReviews && (
                <div style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                  <p>Loading reviews...</p>
                </div>
              )}

              {/* Reviews stats */}
              {!loadingReviews && reviewsStats && (
                <div style={{ 
                  padding: "16px 14px", 
                  backgroundColor: "#f8fafc", 
                  borderRadius: "12px", 
                  marginBottom: "16px", 
                  borderLeft: "4px solid #f59e0b"
                }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px", 
                    marginBottom: "8px"
                  }}>
                    <span style={{ fontSize: "24px", fontWeight: "700", color: "#1d4ed8" }}>
                      {reviewsStats.averageRating}
                    </span>
                    <span style={{ color: "#1d4ed8" }}>
                      {"★".repeat(Math.round(reviewsStats.averageRating))}
                      <span style={{ color: "#e2e8f0" }}>{"★".repeat(5 - Math.round(reviewsStats.averageRating))}</span>
                    </span>
                  </div>
                  <p style={{ margin: "0", fontSize: "13px", color: "#64748b" }}>
                    Based on {reviewsStats.totalReviews} customer review{reviewsStats.totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* No reviews message */}
              {!loadingReviews && reviews.length === 0 && (
                <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                  <p style={{ fontSize: "14px" }}>📝 No reviews yet. Complete projects to receive reviews from customers!</p>
                </div>
              )}

              {/* Display reviews */}
              {!loadingReviews && reviews.map(review => (
                <div key={review._id} className="cp3-review-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <p className="cp3-review-author" style={{ margin: "0" }}>
                      {review.customer?.name || "Anonymous Customer"}
                    </p>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      ({review.ratedBy || 'customer'})
                    </span>
                  </div>
                  <div className="cp3-stars">
                    {"★".repeat(review.rating)}
                    <span style={{ color: "#e2e8f0" }}>{"★".repeat(5 - review.rating)}</span>
                  </div>
                  <p className="cp3-review-text">{review.comment}</p>
                  {review.project?.title && (
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "8px 0 0" }}>
                      Project: <strong>{review.project.title}</strong>
                    </p>
                  )}
                  <p style={{ fontSize: "11px", color: "#cbd5e1", margin: "4px 0 0" }}>
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              ))}

              {/* Info note - for contractor viewing their own profile */}
              {!loadingReviews && reviews.length > 0 && (
                <div style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#eff6ff",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#0369a1",
                  borderLeft: "3px solid #0284c7"
                }}>
                  💡 These are authentic reviews from customers who have worked with you. Great reviews help attract more customers!
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};