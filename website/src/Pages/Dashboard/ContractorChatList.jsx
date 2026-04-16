import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronRight, Search } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_API_URL;
/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .ccl2-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 56px 28px 72px;
  }

  /* ══ Header ══ */
  .ccl2-header {
    text-align: center;
    margin-bottom: 44px;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .ccl2-eyebrow {
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
    margin-bottom: 18px;
  }

  .ccl2-title {
    font-size: clamp(30px, 5vw, 46px);
    font-weight: 800;
    color: #0a0f1e;
    margin: 0 0 12px;
    line-height: 1.12;
    letter-spacing: -0.6px;
  }

  .ccl2-title span {
    background: linear-gradient(135deg, #1d4ed8 20%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ccl2-subtitle {
    font-size: 18px;
    color: #475569;
    font-weight: 600;
    margin: 0;
  }

  .ccl2-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 2px solid #bfdbfe;
    border-radius: 999px;
    padding: 9px 22px;
    font-size: 16px;
    font-weight: 800;
    color: #1d4ed8;
    margin-top: 20px;
    box-shadow: 0 3px 16px rgba(37,99,235,0.14);
  }

  .ccl2-count-dot {
    width: 11px; height: 11px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  /* ══ Search ══ */
  .ccl2-search-wrap {
    max-width: 560px;
    margin: 0 auto 32px;
    position: relative;
    animation: fadeUp 0.5s ease both;
    animation-delay: 0.1s;
  }

  .ccl2-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #93c5fd;
    pointer-events: none;
  }

  .ccl2-search {
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

  .ccl2-search:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1), 0 4px 16px rgba(37,99,235,0.1);
  }

  .ccl2-search::placeholder { color: #cbd5e1; }

  /* ══ List ══ */
  .ccl2-list {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ══ Chat row card ══ */
  .ccl2-item {
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
                box-shadow 0.3s ease, border-color 0.25s ease;
  }

  .ccl2-item:hover {
    transform: translateX(6px) scale(1.012);
    box-shadow: 0 12px 36px rgba(37,99,235,0.18);
    border-color: #93c5fd;
  }

  .ccl2-item:nth-child(1) { animation-delay: 0.08s; }
  .ccl2-item:nth-child(2) { animation-delay: 0.14s; }
  .ccl2-item:nth-child(3) { animation-delay: 0.20s; }
  .ccl2-item:nth-child(4) { animation-delay: 0.26s; }
  .ccl2-item:nth-child(5) { animation-delay: 0.32s; }
  .ccl2-item:nth-child(6) { animation-delay: 0.38s; }

  /* ══ Avatar ══ */
  .ccl2-avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .ccl2-avatar {
    width: 62px; height: 62px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid #bfdbfe;
    box-shadow: 0 3px 12px rgba(37,99,235,0.18);
    display: block;
  }

  .ccl2-avatar-fallback {
    width: 62px; height: 62px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1d4ed8, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 3px 12px rgba(37,99,235,0.22);
  }

  .ccl2-online-dot {
    position: absolute;
    bottom: 2px; right: 2px;
    width: 14px; height: 14px;
    background: #22c55e;
    border-radius: 50%;
    border: 2.5px solid #fff;
    box-shadow: 0 1px 4px rgba(34,197,94,0.5);
  }

  /* ══ Info ══ */
  .ccl2-info { flex: 1; min-width: 0; }

  .ccl2-name {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ccl2-project {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ccl2-project strong {
    color: #1d4ed8;
    font-weight: 700;
  }

  /* ══ Action ══ */
  .ccl2-action {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .ccl2-open-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    color: #fff;
    font-size: 15px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(29,78,216,0.32);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.25s ease;
    white-space: nowrap;
  }

  .ccl2-open-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(29,78,216,0.44);
  }

  .ccl2-open-btn:active { transform: translateY(0); }

  .ccl2-chevron {
    color: #bfdbfe;
    transition: transform 0.2s ease, color 0.2s;
  }

  .ccl2-item:hover .ccl2-chevron {
    transform: translateX(4px);
    color: #60a5fa;
  }

  /* ══ Empty State ══ */
  .ccl2-empty {
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

  .ccl2-empty-icon {
    width: 88px; height: 88px;
    background: linear-gradient(135deg, #dbeafe, #eff6ff);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    font-size: 40px;
    box-shadow: 0 4px 16px rgba(37,99,235,0.1);
  }

  .ccl2-empty-title {
    font-size: 26px;
    font-weight: 800;
    color: #0a0f1e;
    margin-bottom: 12px;
  }

  .ccl2-empty-text {
    font-size: 17px;
    font-weight: 600;
    color: #64748b;
    line-height: 1.75;
    margin: 0;
  }

  /* ══ Loader ══ */
  .ccl2-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .ccl2-spinner {
    width: 56px; height: 56px;
    border: 5px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  .ccl2-loader-text {
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
    .ccl2-root { padding: 36px 16px 56px; }
    .ccl2-title { font-size: 26px; }
    .ccl2-open-btn span { display: none; }
    .ccl2-item { padding: 14px 16px; gap: 14px; }
  }
`;

/* ═══════════════════════════════════════════
   AVATAR with fallback
═══════════════════════════════════════════ */
const Avatar = ({ src, name }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="ccl2-avatar-fallback">
        <FaUserCircle size={32} />
      </div>
    );
  }
  return (
    <img
      className="ccl2-avatar"
      src={src}
      alt={name}
      onError={() => setErr(true)}
    />
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const ContractorChatList = () => {
  const [acceptedProposals, setAcceptedProposals] = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [query,             setQuery]             = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAcceptedProposals = async () => {
      try {
        const contractor = JSON.parse(localStorage.getItem("contractor"));
        if (!contractor) return;

        const contractorId = contractor.id || contractor._id;
        if (!contractorId) { console.error("No contractor ID found"); return; }

        const response = await fetch(`${BASE_URL}/contractor/${contractorId}/accepted`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = await response.json();
        if (Array.isArray(data))               setAcceptedProposals(data);
        else if (Array.isArray(data.proposals)) setAcceptedProposals(data.proposals);
        else                                    setAcceptedProposals([]);
      } catch (error) {
        console.error("Error fetching accepted proposals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAcceptedProposals();
  }, []);

  const openChat = (proposalId) => {
    const token = localStorage.getItem("token");
    if (!token) { console.error("Contractor token missing"); return; }

    fetch(`${BASE_URL}/chat/room`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ proposalId }),
    })
      .then(res => res.json())
      .then(chatRoom => {
        if (!chatRoom?._id) { console.error("chatRoom._id missing", chatRoom); return; }
        navigate(`/chat/${chatRoom._id}`);
      })
      .catch(console.error);
  };

  const filtered = acceptedProposals.filter(p =>
    p.customer?.name?.toLowerCase().includes(query.toLowerCase()) ||
    p.project?.title?.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="ccl2-loader">
          <div className="ccl2-spinner" />
          <p className="ccl2-loader-text">Loading your chats…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ccl2-root">

        {/* ── Header ── */}
        <div className="ccl2-header">
          <span className="ccl2-eyebrow">Messaging</span>
          <h1 className="ccl2-title">Chats with <span>Customers</span></h1>
          <p className="ccl2-subtitle">Open a conversation with your confirmed customers</p>
          {acceptedProposals.length > 0 && (
            <div className="ccl2-count-badge">
              <span className="ccl2-count-dot" />
              {acceptedProposals.length} active {acceptedProposals.length === 1 ? "conversation" : "conversations"}
            </div>
          )}
        </div>

        {acceptedProposals.length === 0 ? (
          <div className="ccl2-empty">
            <div className="ccl2-empty-icon">💬</div>
            <h3 className="ccl2-empty-title">No Chats Yet</h3>
            <p className="ccl2-empty-text">
              You have no accepted proposals yet.<br />
              Once a customer accepts your proposal, you can start chatting.
            </p>
          </div>
        ) : (
          <>
            {/* ── Search ── */}
            <div className="ccl2-search-wrap">
              <Search size={20} className="ccl2-search-icon" />
              <input
                className="ccl2-search"
                placeholder="Search customer or project…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            {/* ── List ── */}
            <div className="ccl2-list">
              {filtered.length === 0 ? (
                <div className="ccl2-empty" style={{ marginTop: 0 }}>
                  <div className="ccl2-empty-icon">🔍</div>
                  <h3 className="ccl2-empty-title">No Results</h3>
                  <p className="ccl2-empty-text">No conversations match your search.</p>
                </div>
              ) : (
                filtered.map(proposal => (
                  <div
                    key={proposal._id}
                    className="ccl2-item"
                    onClick={() => openChat(proposal._id)}
                  >
                    {/* Avatar */}
                    <div className="ccl2-avatar-wrap">
                      <Avatar
                        src={proposal.customer?.profilePic
                          ? `${BASE_URL}${proposal.customer.profilePic}`
                          : null}
                        name={proposal.customer?.name}
                      />
                      <span className="ccl2-online-dot" />
                    </div>

                    {/* Info */}
                    <div className="ccl2-info">
                      <p className="ccl2-name">{proposal.customer?.name || "Customer"}</p>
                      <p className="ccl2-project">
                        Project: <strong>{proposal.project?.title || "N/A"}</strong>
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="ccl2-action">
                      <button
                        className="ccl2-open-btn"
                        onClick={e => { e.stopPropagation(); openChat(proposal._id); }}
                      >
                        <MessageCircle size={17} />
                        <span>Open Chat</span>
                      </button>
                      <ChevronRight size={22} className="ccl2-chevron" />
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