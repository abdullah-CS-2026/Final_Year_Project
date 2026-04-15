import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronRight, Search } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .ccl-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 56px 28px 72px;
  }

  /* ══ Header ══ */
  .ccl-header {
    text-align: center;
    margin-bottom: 44px;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .ccl-eyebrow {
    display: inline-block;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2.8px;
    text-transform: uppercase;
    color: #2563eb;
    background: rgba(37,99,235,0.1);
    border: 1px solid rgba(37,99,235,0.2);
    padding: 6px 18px;
    border-radius: 999px;
    margin-bottom: 18px;
  }

  .ccl-title {
    font-size: clamp(30px, 5vw, 46px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }

  .ccl-title span {
    background: linear-gradient(135deg, #2563eb 30%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ccl-subtitle {
    font-size: 18px;
    color: #64748b;
    font-weight: 500;
    margin: 0;
  }

  .ccl-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #bfdbfe;
    border-radius: 999px;
    padding: 8px 20px;
    font-size: 15px;
    font-weight: 700;
    color: #2563eb;
    margin-top: 20px;
    box-shadow: 0 2px 12px rgba(37,99,235,0.12);
  }

  .ccl-count-dot {
    width: 10px; height: 10px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  /* ══ Search bar ══ */
  .ccl-search-wrap {
    max-width: 560px;
    margin: 0 auto 32px;
    position: relative;
    animation: fadeUp 0.5s ease both;
    animation-delay: 0.1s;
  }

  .ccl-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #93c5fd;
    pointer-events: none;
  }

  .ccl-search {
    width: 100%;
    padding: 14px 18px 14px 50px;
    border-radius: 14px;
    border: 1.5px solid #e0eaff;
    background: #fff;
    font-size: 16px;
    font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1e293b;
    outline: none;
    box-shadow: 0 4px 16px rgba(37,99,235,0.08);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .ccl-search:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1), 0 4px 16px rgba(37,99,235,0.1);
  }

  .ccl-search::placeholder { color: #cbd5e1; }

  /* ══ List wrapper ══ */
  .ccl-list {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ══ Chat row card ══ */
  .ccl-item {
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 4px 18px rgba(37,99,235,0.08);
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 22px;
    cursor: pointer;
    animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                border-color 0.25s ease;
  }

  .ccl-item:hover {
    transform: translateX(6px) scale(1.012);
    box-shadow: 0 12px 36px rgba(37,99,235,0.18);
    border-color: #93c5fd;
  }

  .ccl-item:nth-child(1) { animation-delay: 0.08s; }
  .ccl-item:nth-child(2) { animation-delay: 0.14s; }
  .ccl-item:nth-child(3) { animation-delay: 0.20s; }
  .ccl-item:nth-child(4) { animation-delay: 0.26s; }
  .ccl-item:nth-child(5) { animation-delay: 0.32s; }
  .ccl-item:nth-child(6) { animation-delay: 0.38s; }

  /* ══ Avatar ══ */
  .ccl-avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .ccl-avatar {
    width: 62px; height: 62px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid #bfdbfe;
    box-shadow: 0 3px 12px rgba(37,99,235,0.18);
    display: block;
  }

  .ccl-avatar-fallback {
    width: 62px; height: 62px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 3px 12px rgba(37,99,235,0.22);
    flex-shrink: 0;
  }

  .ccl-online-dot {
    position: absolute;
    bottom: 2px; right: 2px;
    width: 14px; height: 14px;
    background: #22c55e;
    border-radius: 50%;
    border: 2.5px solid #fff;
    box-shadow: 0 1px 4px rgba(34,197,94,0.5);
  }

  /* ══ Info ══ */
  .ccl-info { flex: 1; min-width: 0; }

  .ccl-name {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ccl-project {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ccl-project strong {
    color: #2563eb;
    font-weight: 600;
  }

  /* ══ CTA button area ══ */
  .ccl-action {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .ccl-open-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(37,99,235,0.32);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.25s ease;
    white-space: nowrap;
  }

  .ccl-open-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(37,99,235,0.44);
  }

  .ccl-open-btn:active { transform: translateY(0); }

  .ccl-chevron {
    color: #bfdbfe;
    transition: transform 0.2s ease, color 0.2s;
  }

  .ccl-item:hover .ccl-chevron {
    transform: translateX(4px);
    color: #60a5fa;
  }

  /* ══ Empty State ══ */
  .ccl-empty {
    max-width: 480px;
    margin: 0 auto;
    text-align: center;
    padding: 64px 36px;
    background: #fff;
    border-radius: 28px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 10px 40px rgba(37,99,235,0.08);
    animation: fadeUp 0.55s ease both;
  }

  .ccl-empty-icon {
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

  .ccl-empty-title {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }

  .ccl-empty-text {
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
    line-height: 1.75;
    margin: 0;
  }

  /* ══ Loader ══ */
  .ccl-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .ccl-spinner {
    width: 56px; height: 56px;
    border: 5px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  .ccl-loader-text {
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
    .ccl-root { padding: 36px 16px 56px; }
    .ccl-title { font-size: 26px; }
    .ccl-open-btn span { display: none; }
    .ccl-item { padding: 14px 16px; gap: 14px; }
  }
`;

/* ═══════════════════════════════════════════
   AVATAR with fallback
═══════════════════════════════════════════ */
const Avatar = ({ src, name }) => {
  const [err, setErr] = useState(false);

  if (!src || err) {
    return (
      <div className="ccl-avatar-fallback">
        <FaUserCircle size={32} />
      </div>
    );
  }

  return (
    <img
      className="ccl-avatar"
      src={src}
      alt={name}
      onError={() => setErr(true)}
    />
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const CustomerChatList = () => {
  const [acceptedProposals, setAcceptedProposals] = useState([]);
  const [loading, setLoading]                      = useState(true);
  const [query, setQuery]                          = useState("");
  const navigate                                   = useNavigate();

  useEffect(() => {
    const fetchAcceptedProposals = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem("customer"));
        if (!customer) return;
        const customerId = customer._id || customer.id;
        const response   = await fetch(`http://localhost:5000/proposals/customer/${customerId}/accepted`);
        const data       = await response.json();
        if (response.ok) setAcceptedProposals(data);
        else console.error(data.message || "Failed to fetch proposals");
      } catch (err) {
        console.error("Error fetching accepted proposals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcceptedProposals();
  }, []);

  const openChat = (proposalId) => {
    fetch("http://localhost:5000/chat/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
      },
      body: JSON.stringify({ proposalId }),
    })
      .then(res  => res.json())
      .then(room => navigate(`/chat/${room._id}`))
      .catch(console.error);
  };

  const filtered = acceptedProposals.filter(p =>
    p.contractor?.name?.toLowerCase().includes(query.toLowerCase()) ||
    p.project?.title?.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="ccl-loader">
          <div className="ccl-spinner" />
          <p className="ccl-loader-text">Loading your chats…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ccl-root">

        {/* ── Header ── */}
        <div className="ccl-header">
          <span className="ccl-eyebrow">Messaging</span>
          <h1 className="ccl-title">Chats with <span>Contractors</span></h1>
          <p className="ccl-subtitle">Open a conversation with your confirmed contractors</p>
          {acceptedProposals.length > 0 && (
            <div className="ccl-count-badge">
              <span className="ccl-count-dot" />
              {acceptedProposals.length} active {acceptedProposals.length === 1 ? "conversation" : "conversations"}
            </div>
          )}
        </div>

        {acceptedProposals.length === 0 ? (
          <div className="ccl-empty">
            <div className="ccl-empty-icon">💬</div>
            <h3 className="ccl-empty-title">No Chats Yet</h3>
            <p className="ccl-empty-text">
              You have no accepted proposals yet.<br />
              Accept a contractor's proposal to start chatting.
            </p>
          </div>
        ) : (
          <>
            {/* ── Search ── */}
            <div className="ccl-search-wrap">
              <Search size={20} className="ccl-search-icon" />
              <input
                className="ccl-search"
                placeholder="Search contractor or project…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            {/* ── List ── */}
            <div className="ccl-list">
              {filtered.length === 0 ? (
                <div className="ccl-empty" style={{ marginTop: 0 }}>
                  <div className="ccl-empty-icon">🔍</div>
                  <h3 className="ccl-empty-title">No Results</h3>
                  <p className="ccl-empty-text">No conversations match your search.</p>
                </div>
              ) : (
                filtered.map(proposal => (
                  <div key={proposal._id} className="ccl-item" onClick={() => openChat(proposal._id)}>

                    {/* Avatar */}
                    <div className="ccl-avatar-wrap">
                      <Avatar
                        src={proposal.contractor?.profilePic
                          ? `http://localhost:5000${proposal.contractor.profilePic}`
                          : null}
                        name={proposal.contractor?.name}
                      />
                      <span className="ccl-online-dot" />
                    </div>

                    {/* Info */}
                    <div className="ccl-info">
                      <p className="ccl-name">{proposal.contractor?.name || "Contractor"}</p>
                      <p className="ccl-project">
                        Project: <strong>{proposal.project?.title || "N/A"}</strong>
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="ccl-action">
                      <button className="ccl-open-btn" onClick={e => { e.stopPropagation(); openChat(proposal._id); }}>
                        <MessageCircle size={17} />
                        <span>Open Chat</span>
                      </button>
                      <ChevronRight size={22} className="ccl-chevron" />
                    </div>

                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </>
  );
};