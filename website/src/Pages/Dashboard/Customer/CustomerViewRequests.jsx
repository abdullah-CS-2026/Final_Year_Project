import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt, FaRulerCombined, FaMoneyBillWave,
  FaCalendarAlt, FaTrash, FaTag, FaInfoCircle,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { Images } from "lucide-react";
import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_API_URL;

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cvr-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 56px 28px 72px;
  }

  /* ══ Header ══ */
  .cvr-header {
    text-align: center;
    margin-bottom: 52px;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cvr-eyebrow {
    display: inline-block;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #1d4ed8;
    background: rgba(37,99,235,0.13);
    border: 1.5px solid rgba(37,99,235,0.3);
    padding: 7px 22px;
    border-radius: 999px;
    margin-bottom: 18px;
  }

  .cvr-title {
    font-size: clamp(36px, 6vw, 54px);
    font-weight: 800;
    color: #0a0f1e;
    margin: 0 0 14px;
    line-height: 1.1;
    letter-spacing: -1px;
  }

  .cvr-title span {
    background: linear-gradient(135deg, #1d4ed8 20%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cvr-subtitle {
    font-size: 19px;
    color: #475569;
    font-weight: 600;
    margin: 0;
  }

  .cvr-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 2px solid #93c5fd;
    border-radius: 999px;
    padding: 9px 22px;
    font-size: 16px;
    font-weight: 800;
    color: #1d4ed8;
    margin-top: 20px;
    box-shadow: 0 3px 16px rgba(37,99,235,0.18);
  }

  .cvr-count-dot {
    width: 11px; height: 11px;
    background: #1d4ed8;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  /* ══ Grid ══ */
  .cvr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 28px;
    max-width: 1300px;
    margin: 0 auto;
  }

  /* ══ Card ══ */
  .cvr-card {
    background: #fff;
    border-radius: 22px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 6px 24px rgba(37,99,235,0.09);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
  }

  .cvr-card:hover {
    transform: translateY(-10px) scale(1.015);
    box-shadow: 0 24px 56px rgba(37,99,235,0.18);
    border-color: #93c5fd;
  }

  .cvr-card:nth-child(1) { animation-delay: 0.06s; }
  .cvr-card:nth-child(2) { animation-delay: 0.12s; }
  .cvr-card:nth-child(3) { animation-delay: 0.18s; }
  .cvr-card:nth-child(4) { animation-delay: 0.24s; }
  .cvr-card:nth-child(5) { animation-delay: 0.30s; }
  .cvr-card:nth-child(6) { animation-delay: 0.36s; }

  /* ══ Banner ══ */
  .cvr-banner {
    background: linear-gradient(135deg, #1d6fdb 0%, #2563eb 55%, #3b82f6 100%);
    padding: 22px 24px 20px;
    position: relative;
    overflow: hidden;
  }

  .cvr-banner::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .cvr-banner::after {
    content: '';
    position: absolute;
    bottom: -30px; left: 20px;
    width: 100px; height: 100px;
    background: radial-gradient(circle, rgba(147,197,253,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .cvr-banner-label {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
    margin-bottom: 6px;
    position: relative; z-index: 1;
  }

  .cvr-banner-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    position: relative; z-index: 1;
  }

  .cvr-project-title {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    margin: 0;
    line-height: 1.3;
    flex: 1;
    text-shadow: 0 1px 8px rgba(0,0,0,0.15);
  }

  /* Status pill in banner */
  .cvr-status-pill {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
  }

  .cvr-status-pill.pending {
    background: rgba(251,191,36,0.22);
    color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.4);
  }

  .cvr-status-pill.active,
  .cvr-status-pill.open {
    background: rgba(34,197,94,0.2);
    color: #4ade80;
    border: 1px solid rgba(34,197,94,0.35);
  }

  .cvr-status-pill.default {
    background: rgba(255,255,255,0.18);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.3);
  }

  /* ══ Card Body ══ */
  .cvr-body {
    padding: 20px 24px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cvr-body-label {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #1d4ed8;
    margin-bottom: 10px;
  }

  /* ══ Detail Row ══ */
  .cvr-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 10px 10px;
    border-radius: 12px;
    transition: background 0.2s;
    cursor: default;
  }

  .cvr-row:hover { background: #eef4ff; }

  .cvr-row-icon {
    width: 46px; height: 46px;
    border-radius: 13px;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(29,78,216,0.3);
  }

  .cvr-row-inner { flex: 1; }

  .cvr-row-key {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #64748b;
    display: block;
    margin-bottom: 3px;
  }

  .cvr-row-val {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.4;
  }

  /* Description block */
  .cvr-desc {
    margin: 8px 0 4px;
    padding: 14px 16px;
    background: #eef4ff;
    border-radius: 12px;
    border-left: 5px solid #3b82f6;
  }

  .cvr-desc-label {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #1d4ed8;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 7px;
  }

  .cvr-desc-text {
    font-size: 15px;
    font-weight: 600;
    color: #334155;
    line-height: 1.7;
    margin: 0;
  }

  /* ══ Attachments ══ */
  .cvr-attachments {
    margin: 10px 0 4px;
    padding: 14px 16px;
    background: #eef4ff;
    border-radius: 14px;
    border: 2px dashed #93c5fd;
  }

  .cvr-att-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: #1d4ed8;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }

  .cvr-att-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cvr-att-img {
    width: 80px; height: 80px;
    border-radius: 10px;
    object-fit: cover;
    border: 2px solid #bfdbfe;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(37,99,235,0.12);
  }

  .cvr-att-img:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 18px rgba(37,99,235,0.28);
  }

  /* ══ Footer / Delete ══ */
  .cvr-footer {
    padding: 14px 24px 20px;
    border-top: 1.5px solid #e0eaff;
  }

  .cvr-delete-btn {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 13px 24px;
    border-radius: 13px;
    border: none;
    background: linear-gradient(135deg, #b91c1c, #ef4444);
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 5px 16px rgba(185,28,28,0.36);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    margin-left: auto;
    letter-spacing: 0.3px;
  }

  .cvr-delete-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(185,28,28,0.46);
  }

  .cvr-delete-btn:active { transform: translateY(0); }

  /* ══ Empty State ══ */
  .cvr-empty {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    padding: 64px 36px;
    background: #fff;
    border-radius: 28px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 10px 40px rgba(37,99,235,0.08);
    animation: fadeUp 0.55s ease both;
  }

  .cvr-empty-icon {
    width: 88px; height: 88px;
    background: linear-gradient(135deg, #dbeafe, #eff6ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 40px;
    box-shadow: 0 4px 16px rgba(37,99,235,0.1);
  }

  .cvr-empty-title {
    font-size: 28px;
    font-weight: 800;
    color: #0a0f1e;
    margin-bottom: 12px;
    letter-spacing: -0.4px;
  }

  .cvr-empty-text {
    font-size: 17px;
    font-weight: 600;
    color: #475569;
    line-height: 1.75;
    margin: 0;
  }

  /* ══ Loader ══ */
  .cvr-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cvr-spinner {
    width: 56px; height: 56px;
    border: 5px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  .cvr-loader-text {
    font-size: 17px;
    font-weight: 600;
    color: #64748b;
  }

  /* ══ Keyframes ══ */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.72); }
  }

  @media (max-width: 520px) {
    .cvr-grid { grid-template-columns: 1fr; gap: 20px; }
    .cvr-root { padding: 36px 16px 56px; }
    .cvr-title { font-size: 26px; }
  }
`;

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="cvr-row">
    <div className="cvr-row-icon">
      <Icon size={22} color="#fff" />
    </div>
    <div className="cvr-row-inner">
      <span className="cvr-row-key">{label}</span>
      <span className="cvr-row-val">{value || "N/A"}</span>
    </div>
  </div>
);

const statusClass = (status) => {
  if (!status) return "default";
  const s = status.toLowerCase();
  if (s === "pending") return "pending";
  if (s === "active" || s === "open") return "active";
  return "default";
};

const RequestCard = ({ req, onDelete }) => (
  <div className="cvr-card">

    {/* Banner */}
    <div className="cvr-banner">
      <p className="cvr-banner-label">Project Request</p>
      <div className="cvr-banner-row">
        <h3 className="cvr-project-title">{req.title}</h3>
        <span className={`cvr-status-pill ${statusClass(req.status)}`}>
          {req.status || "N/A"}
        </span>
      </div>
    </div>

    {/* Body */}
    <div className="cvr-body">
      <p className="cvr-body-label">Project Details</p>

      <DetailRow icon={MdCategory}      label="Category"   value={req.category} />
      <DetailRow icon={FaMapMarkerAlt}  label="Location"   value={req.location} />
      <DetailRow icon={FaRulerCombined} label="Plot Size"  value={req.plotSize} />
      <DetailRow
        icon={FaMoneyBillWave}
        label="Budget"
        value={req.budget ? `Rs. ${Number(req.budget).toLocaleString()}` : "N/A"}
      />
      <DetailRow
        icon={FaCalendarAlt}
        label="Deadline"
        value={req.deadline ? new Date(req.deadline).toLocaleDateString("en-GB") : "N/A"}
      />

      {/* Description */}
      {req.description && (
        <div className="cvr-desc">
          <div className="cvr-desc-label">
            <FaInfoCircle size={13} /> Description
          </div>
          <p className="cvr-desc-text">{req.description}</p>
        </div>
      )}

      {/* Attachments */}
      {req.attachments?.length > 0 && (
        <div className="cvr-attachments">
          <div className="cvr-att-label">
            <Images size={14} /> Attachments ({req.attachments.length})
          </div>
          <div className="cvr-att-grid">
            {req.attachments.map((img, i) => (
              <img
                key={i}
                src={`${BASE_URL}${img}`}
                alt={`attachment-${i + 1}`}
                className="cvr-att-img"
              />
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="cvr-footer">
      <div style={{ display: "flex" }}>
        <button className="cvr-delete-btn" onClick={() => onDelete(req._id)}>
          <FaTrash size={17} />
          Delete Request
        </button>
      </div>
    </div>

  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const CustomerViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchRequests = async () => {
    try {
      const result     = JSON.parse(localStorage.getItem("customer"));
      const customerId = result?.id || result?._id;
      if (!customerId) { setLoading(false); return; }

      const res  = await fetch(`${BASE_URL}/customer/projects/${customerId}`);
      const data = await res.json();
      setRequests(res.ok ? data.projects : []);
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleDelete = async (requestId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res  = await fetch(`${BASE_URL}/customer/projects/${requestId}`, { method: "DELETE" });
          const data = await res.json();
          if (res.ok) {
            Swal.fire("Deleted!", data.message, "success");
            setRequests((prev) => prev.filter((r) => r._id !== requestId));
          } else {
            Swal.fire("Error!", data.message || "Error deleting request", "error");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Something went wrong", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="cvr-loader">
          <div className="cvr-spinner" />
          <p className="cvr-loader-text">Loading your project requests…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cvr-root">

        {/* Header */}
        <div className="cvr-header">
          <span className="cvr-eyebrow">Customer Portal</span>
          <h1 className="cvr-title">Your Project <span>Requests</span></h1>
          <p className="cvr-subtitle">Manage and track all your submitted project requests</p>
          {requests.length > 0 && (
            <div className="cvr-count-badge">
              <span className="cvr-count-dot" />
              {requests.length} active {requests.length === 1 ? "request" : "requests"}
            </div>
          )}
        </div>

        {/* Content */}
        {requests.length === 0 ? (
          <div className="cvr-empty">
            <div className="cvr-empty-icon">🏗️</div>
            <h3 className="cvr-empty-title">No Project Requests Yet</h3>
            <p className="cvr-empty-text">
              You haven't submitted any project requests yet.<br />
              Click "Create New Project" to get started!
            </p>
          </div>
        ) : (
          <div className="cvr-grid">
            {requests.map((req) => (
              <RequestCard key={req._id} req={req} onDelete={handleDelete} />
            ))}
          </div>
        )}

      </div>
    </>
  );
};