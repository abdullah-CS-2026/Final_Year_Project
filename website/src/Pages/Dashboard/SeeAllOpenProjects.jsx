import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt, FaRulerCombined, FaMoneyBillWave,
  FaCalendarAlt, FaExclamationCircle, FaPaperclip
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .sap-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 48px 24px 64px;
  }

  /* ── Page header ── */
  .sap-page-header {
    text-align: center;
    margin-bottom: 48px;
    animation: fadeDown 0.6s ease both;
  }

  .sap-page-eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #2563eb;
    background: rgba(37,99,235,0.1);
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 14px;
  }

  .sap-page-title {
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px;
    line-height: 1.2;
  }

  .sap-page-title span {
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sap-page-sub {
    font-size: 16px;
    color: #64748b;
    margin: 0;
  }

  .sap-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 1.5px solid #bfdbfe;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 600;
    color: #2563eb;
    margin-top: 16px;
    box-shadow: 0 2px 8px rgba(37,99,235,0.1);
  }

  .sap-count-dot {
    width: 8px; height: 8px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
  }

  /* ── Grid ── */
  .sap-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    max-width: 1280px;
    margin: 0 auto;
  }

  /* ── Card ── */
  .sap-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 4px 20px rgba(37,99,235,0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
    animation: fadeUp 0.5s ease both;
  }

  .sap-card:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 48px rgba(37,99,235,0.18);
    border-color: #93c5fd;
  }

  /* Staggered card animation */
  .sap-card:nth-child(1)  { animation-delay: 0.05s; }
  .sap-card:nth-child(2)  { animation-delay: 0.10s; }
  .sap-card:nth-child(3)  { animation-delay: 0.15s; }
  .sap-card:nth-child(4)  { animation-delay: 0.20s; }
  .sap-card:nth-child(5)  { animation-delay: 0.25s; }
  .sap-card:nth-child(6)  { animation-delay: 0.30s; }
  .sap-card:nth-child(7)  { animation-delay: 0.35s; }
  .sap-card:nth-child(8)  { animation-delay: 0.40s; }
  .sap-card:nth-child(9)  { animation-delay: 0.45s; }

  /* ── Card header bar ── */
  .sap-card-top {
    background: linear-gradient(135deg, #1d6fdb 0%, #2563eb 60%, #3b82f6 100%);
    padding: 18px 20px 16px;
    position: relative;
    overflow: hidden;
  }

  .sap-card-top::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 120px; height: 120px;
    background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
  }

  .sap-urgency-pill {
    position: absolute;
    top: 14px; right: 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
    z-index: 1;
  }

  .sap-urgency-urgent {
    background: rgba(239,68,68,0.2);
    color: #fca5a5;
    border: 1px solid rgba(239,68,68,0.4);
  }

  .sap-urgency-normal {
    background: rgba(34,197,94,0.2);
    color: #86efac;
    border: 1px solid rgba(34,197,94,0.4);
  }

  .sap-card-title {
    font-size: 17px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    padding-right: 80px;
    position: relative; z-index: 1;
    line-height: 1.3;
  }

  /* ── Customer info strip ── */
  .sap-customer-strip {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: #f8faff;
    border-bottom: 1px solid #e0eaff;
  }

  .sap-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid #93c5fd;
    box-shadow: 0 2px 10px rgba(37,99,235,0.2);
    flex-shrink: 0;
  }

  .sap-customer-name {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 2px;
  }

  .sap-customer-meta {
    font-size: 12.5px;
    color: #64748b;
    margin: 0;
  }

  /* ── Details body ── */
  .sap-card-body {
    padding: 18px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sap-detail-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 10px;
    transition: background 0.2s;
  }

  .sap-detail-row:hover {
    background: #f0f7ff;
  }

  .sap-detail-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .sap-detail-inner {
    flex: 1;
  }

  .sap-detail-key {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #94a3b8;
    display: block;
    margin-bottom: 1px;
  }

  .sap-detail-val {
    font-size: 14.5px;
    font-weight: 600;
    color: #1e293b;
  }

  /* ── Description ── */
  .sap-desc {
    margin: 10px 0 0;
    padding: 12px 14px;
    background: #f8fafc;
    border-radius: 10px;
    border-left: 3px solid #93c5fd;
  }

  .sap-desc-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #2563eb;
    margin-bottom: 4px;
    display: block;
  }

  .sap-desc-text {
    font-size: 13.5px;
    color: #475569;
    line-height: 1.6;
    margin: 0;
  }

  /* ── Attachments ── */
  .sap-attachments {
    padding: 0 20px 14px;
  }

  .sap-attach-label {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 8px;
    display: block;
  }

  .sap-attach-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    font-weight: 600;
    color: #2563eb;
    background: rgba(37,99,235,0.08);
    border: 1px solid rgba(37,99,235,0.2);
    border-radius: 20px;
    padding: 4px 12px;
    text-decoration: none;
    transition: all 0.2s;
  }

  .sap-attach-link:hover {
    background: rgba(37,99,235,0.15);
    color: #1d4ed8;
    transform: translateY(-1px);
  }

  /* ── Footer / CTA ── */
  .sap-card-footer {
    padding: 16px 20px 20px;
    border-top: 1px solid #e0eaff;
  }

  .sap-btn-proposal {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #1d6fdb, #3b82f6);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.25s ease;
    letter-spacing: 0.3px;
  }

  .sap-btn-proposal:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(37,99,235,0.45);
  }

  .sap-btn-proposal:active {
    transform: translateY(0);
  }

  .sap-btn-arrow {
    transition: transform 0.2s ease;
  }

  .sap-btn-proposal:hover .sap-btn-arrow {
    transform: translateX(4px);
  }

  /* ── Empty state ── */
  .sap-empty {
    max-width: 480px;
    margin: 0 auto;
    text-align: center;
    padding: 60px 32px;
    background: #ffffff;
    border-radius: 24px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 8px 32px rgba(37,99,235,0.08);
    animation: fadeUp 0.5s ease both;
  }

  .sap-empty-icon {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, #dbeafe, #eff6ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 32px;
  }

  .sap-empty-title {
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 10px;
  }

  .sap-empty-sub {
    font-size: 15px;
    color: #64748b;
    line-height: 1.6;
  }

  /* ── Loader ── */
  .sap-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 18px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
  }

  .sap-loader-ring {
    width: 52px;
    height: 52px;
    border: 4px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .sap-loader-text {
    font-size: 15px;
    font-weight: 600;
    color: #64748b;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ── Keyframes ── */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.8); }
  }

  @media (max-width: 480px) {
    .sap-grid { grid-template-columns: 1fr; }
    .sap-root { padding: 32px 16px 48px; }
  }
`;

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="sap-detail-row">
    <div className="sap-detail-icon">
      <Icon size={14} color="#fff" />
    </div>
    <div className="sap-detail-inner">
      <span className="sap-detail-key">{label}</span>
      <span className="sap-detail-val">{value}</span>
    </div>
  </div>
);

const ProjectCard = ({ project, contractorId, navigate }) => {
  const isUrgent = project.urgency === "urgent";
  const avatar = project.customer?.profilePic
    ? `http://localhost:5000${project.customer.profilePic}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(project.customer?.name || "U")}&background=dbeafe&color=2563eb&bold=true`;

  return (
    <div className="sap-card">
      {/* Top bar */}
      <div className="sap-card-top">
        <span className={`sap-urgency-pill ${isUrgent ? "sap-urgency-urgent" : "sap-urgency-normal"}`}>
          {isUrgent ? "🔥 Urgent" : "✓ Normal"}
        </span>
        <h3 className="sap-card-title">{project.title}</h3>
      </div>

      {/* Customer strip */}
      <div className="sap-customer-strip">
        <img src={avatar} alt={project.customer?.name} className="sap-avatar" />
        <div>
          <p className="sap-customer-name">{project.customer?.name || "N/A"}</p>
          <p className="sap-customer-meta">{project.customer?.email || "N/A"}</p>
          <p className="sap-customer-meta">📞 {project.customer?.phone || "N/A"}</p>
        </div>
      </div>

      {/* Details */}
      <div className="sap-card-body">
        <DetailRow icon={MdCategory}        label="Category"  value={project.category} />
        <DetailRow icon={FaMapMarkerAlt}    label="Location"  value={project.location} />
        <DetailRow icon={FaRulerCombined}   label="Plot Size" value={project.plotSize} />
        <DetailRow icon={FaMoneyBillWave}   label="Budget"    value={project.budget ? `Rs. ${Number(project.budget).toLocaleString()}` : "Not specified"} />
        <DetailRow icon={FaCalendarAlt}     label="Deadline"  value={new Date(project.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />

        {project.description && (
          <div className="sap-desc">
            <span className="sap-desc-label">Description</span>
            <p className="sap-desc-text">{project.description}</p>
          </div>
        )}
      </div>

      {/* Attachments */}
      {project.attachments?.length > 0 && (
        <div className="sap-attachments">
          <span className="sap-attach-label">Attachments</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {project.attachments.map((file, i) => (
              <a
                key={i}
                href={`http://localhost:5000/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sap-attach-link"
              >
                <FaPaperclip size={11} /> File {i + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="sap-card-footer">
        <button
          className="sap-btn-proposal"
          onClick={() => navigate(`/contractor/projects/${project._id}/proposal`, { state: { contractorId } })}
        >
          Send Proposal
          <span className="sap-btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export const SeeAllOpenProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const contractor = JSON.parse(localStorage.getItem("contractor"));
  const contractorId = contractor?._id || contractor?.id;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("🔍 [FETCH PROJECTS] Starting...");
        console.log("   - contractorId:", contractorId);
        console.log("   - Full contractor data:", contractor);

        if (!contractorId) {
          console.error("❌ [FETCH PROJECTS] No contractor ID found");
          setProjects([]);
          setLoading(false);
          return;
        }

        const url = `http://localhost:5000/contractor/projects/${contractorId}`;
        console.log("🔍 [FETCH PROJECTS] Fetching from:", url);

        const res = await fetch(url);
        console.log("🔍 [FETCH PROJECTS] Response status:", res.status);

        const data = await res.json();
        console.log("🔍 [FETCH PROJECTS] Response data:", data);
        console.log("   - Is array:", Array.isArray(data));
        console.log("   - Count:", Array.isArray(data) ? data.length : 0);

        if (Array.isArray(data)) {
          data.forEach((p, idx) => {
            console.log(`   ${idx + 1}. ${p.title} - Status: ${p.status} - Location: ${p.location}`);
          });
        }

        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ [FETCH PROJECTS] Error:", err);
        console.error("   - Error message:", err.message);
        console.error("   - Stack:", err.stack);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [contractorId]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="sap-loader">
          <div className="sap-loader-ring" />
          <p className="sap-loader-text">Fetching available projects…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="sap-root">

        {/* Page Header */}
        <div className="sap-page-header">
          <span className="sap-page-eyebrow">Contractor Portal</span>
          <h1 className="sap-page-title">
            Available <span>Projects</span>
          </h1>
          <p className="sap-page-sub">Browse open projects and send your best proposal</p>
          {projects.length > 0 && (
            <div className="sap-count-badge">
              <span className="sap-count-dot" />
              {projects.length} open {projects.length === 1 ? "project" : "projects"} available
            </div>
          )}
        </div>

        {/* Content */}
        {projects.length === 0 ? (
          <div className="sap-empty">
            <div className="sap-empty-icon">📭</div>
            <h3 className="sap-empty-title">No Open Projects</h3>
            <p className="sap-empty-sub">
              There are currently no open projects available.<br />
              Check back soon — new projects are posted regularly.
            </p>
          </div>
        ) : (
          <div className="sap-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                contractorId={contractorId}
                navigate={navigate}
              />
            ))}
          </div>
        )}

      </div>
    </>
  );
};