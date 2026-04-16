import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../../../socket";
import { ArrowLeft, Send, Paperclip, ImageIcon } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;
/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cp-chat-root {
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #0f172a;
    position: relative;
    overflow: hidden;
  }

  /* Background orbs */
  .cp-chat-root::before {
    content: '';
    position: fixed;
    top: -100px; right: -100px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .cp-chat-root::after {
    content: '';
    position: fixed;
    bottom: -80px; left: -80px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ══ Header ══ */
  .cp-chat-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(37,99,235,0.12);
    box-shadow: 0 2px 24px rgba(37,99,235,0.14);
    z-index: 10;
    position: relative;
    animation: slideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cp-back-btn {
    width: 42px; height: 42px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 3px 12px rgba(37,99,235,0.36);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }

  .cp-back-btn:hover {
    transform: scale(1.1) translateX(-2px);
    box-shadow: 0 6px 18px rgba(37,99,235,0.46);
  }

  .cp-header-avatar {
    width: 48px; height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid #93c5fd;
    box-shadow: 0 3px 12px rgba(37,99,235,0.2);
    flex-shrink: 0;
  }

  .cp-header-info { flex: 1; }

  .cp-header-name {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 2px;
    line-height: 1.2;
  }

  .cp-header-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
    color: #16a34a;
  }

  .cp-status-dot {
    width: 8px; height: 8px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  /* ══ Message area ══ */
  .cp-chat-box {
    flex: 1;
    overflow-y: auto;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    z-index: 1;
    scroll-behavior: smooth;
    background: #0f172a;
  }

  .cp-chat-box::-webkit-scrollbar { width: 5px; }
  .cp-chat-box::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 4px; }
  .cp-chat-box::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
  .cp-chat-box::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }

  /* ══ Message bubble ══ */
  .cp-msg-wrap {
    display: flex;
    animation: msgIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cp-msg-wrap.me  { justify-content: flex-end; }
  .cp-msg-wrap.them { justify-content: flex-start; }

  .cp-bubble {
    max-width: 72%;
    padding: 12px 16px;
    border-radius: 20px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.25);
    position: relative;
    word-wrap: break-word;
  }

  /* MY messages — vivid emerald green, unmistakably different from dark bg */
  .cp-msg-wrap.me .cp-bubble {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    color: #fff;
    border-bottom-right-radius: 6px;
    box-shadow: 0 4px 20px rgba(5,150,105,0.4);
  }

  /* THEIR messages — light card on dark background */
  .cp-msg-wrap.them .cp-bubble {
    background: #1e293b;
    color: #f1f5f9;
    border-bottom-left-radius: 6px;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }

  .cp-sender-name {
    font-size: 11.5px;
    font-weight: 700;
    color: #60a5fa;
    margin-bottom: 4px;
    letter-spacing: 0.3px;
  }

  .cp-msg-img {
    max-width: 220px;
    border-radius: 12px;
    margin-bottom: 8px;
    display: block;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
    transition: transform 0.2s ease, box-shadow 0.2s;
  }

  .cp-msg-img:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .cp-msg-text {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.5;
  }

  .cp-msg-time {
    font-size: 10.5px;
    text-align: right;
    opacity: 0.6;
    margin-top: 5px;
    font-weight: 500;
  }

  /* ══ Date divider ══ */
  .cp-day-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 6px 0;
  }

  .cp-day-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

  .cp-day-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    padding: 4px 12px;
    background: rgba(255,255,255,0.06);
    border-radius: 999px;
    white-space: nowrap;
  }

  /* ══ Input area ══ */
  .cp-input-area {
    background: #0f172a;
    backdrop-filter: blur(16px);
    padding: 14px 18px;
    border-top: 1px solid rgba(255,255,255,0.07);
    z-index: 10;
    position: relative;
    animation: slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cp-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #1e293b;
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 8px 10px 8px 18px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .cp-input-row:focus-within {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
  }

  .cp-text-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 500;
    color: #f1f5f9;
    outline: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 4px 0;
    line-height: 1.4;
  }

  .cp-text-input::placeholder { color: #475569; }

  .cp-attach-label {
    width: 40px; height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #475569;
    transition: background 0.2s, color 0.2s;
    flex-shrink: 0;
  }

  .cp-attach-label:hover {
    background: rgba(255,255,255,0.08);
    color: #94a3b8;
  }

  .cp-send-btn {
    width: 44px; height: 44px;
    border-radius: 13px;
    border: none;
    background: linear-gradient(135deg, #059669, #10b981);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(5,150,105,0.4);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }

  .cp-send-btn:hover {
    transform: scale(1.1) translateY(-1px);
    box-shadow: 0 7px 20px rgba(5,150,105,0.52);
  }

  .cp-send-btn:active { transform: scale(0.96); }

  /* ══ Image Preview Modal ══ */
  .cp-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 20, 40, 0.82);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.25s ease both;
    gap: 20px;
  }

  .cp-modal-img {
    max-width: 90vw;
    max-height: 75vh;
    border-radius: 18px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    transition: transform 0.2s;
  }

  .cp-modal-img:hover { transform: scale(1.01); }

  .cp-send-image-btn {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 13px 28px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #15803d, #22c55e);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(22,163,74,0.36);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }

  .cp-send-image-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(22,163,74,0.46);
  }

  .cp-modal-close-hint {
    font-size: 13px;
    color: rgba(255,255,255,0.4);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
  }

  /* ══ Empty chat ══ */
  .cp-empty-chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 14px;
    animation: fadeIn 0.5s ease both;
  }

  .cp-empty-icon {
    width: 80px; height: 80px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
  }

  .cp-empty-text {
    font-size: 16px;
    font-weight: 600;
    color: rgba(255,255,255,0.35);
  }

  /* ══ Keyframes ══ */
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes msgIn {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.45; transform: scale(0.72); }
  }

  @media (max-width: 480px) {
    .cp-bubble { max-width: 85%; }
    .cp-chat-header { padding: 12px 14px; }
    .cp-input-area { padding: 12px 14px; }
  }
`;

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const ChatPage = () => {
  const { roomId } = useParams();
  const navigate   = useNavigate();

  const [messages,     setMessages]     = useState([]);
  const [text,         setText]         = useState("");
  const [imageFile,    setImageFile]    = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const customer   = JSON.parse(localStorage.getItem("customer"));
  const contractor = JSON.parse(localStorage.getItem("contractor"));
  const user       = customer || contractor;
  const senderId   = user?._id || user?.id;

  const token = customer
    ? localStorage.getItem("customerToken")
    : localStorage.getItem("token");

  const [chatUser, setChatUser] = useState({
    name:  "Chat",
    image: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });

  /* JOIN SOCKET ROOM */
  useEffect(() => {
    if (!roomId) return;
    socket.emit("joinRoom", roomId);
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off("message");
  }, [roomId]);

  /* LOAD OLD MESSAGES */
  useEffect(() => {
    if (!roomId) return;
    fetch(`${BASE_URL}/chat/messages/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []));
  }, [roomId]);

  /* LOAD CHAT HEADER USER */
  useEffect(() => {
    if (!roomId || !senderId) return;
    fetch(`${BASE_URL}/chat/room/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.contractor === senderId) {
          setChatUser({
            name:  data.customerName,
            image: data.customerProfilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          });
        } else {
          setChatUser({
            name:  data.contractorName,
            image: data.contractorProfilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          });
        }
      })
      .catch(() => {});
  }, [roomId, senderId]);

  /* AUTO SCROLL */
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  /* SEND MESSAGE */
  const sendMessage = () => {
    if (!text.trim() || !senderId) return;
    socket.emit("chatMessage", { roomId, senderId, senderName: user.name, message: text });
    setText("");
  };

  /* IMAGE UPLOAD */
  const handleImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image",      file);
    formData.append("roomId",     roomId);
    formData.append("senderId",   senderId);
    formData.append("senderName", user.name);

    const res  = await fetch(`${BASE_URL}/chat/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    setMessages((prev) => [...prev, data]);
    setPreviewImage(null);
    setImageFile(null);
  };

  /* IMAGE SELECT & PREVIEW */
  const handleImageSelect = (file) => {
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  /* FORMAT TIME */
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <style>{styles}</style>

      <div className="cp-chat-root">

        {/* ── Header ── */}
        <div className="cp-chat-header">
          <button className="cp-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>

          <img
            src={chatUser.image}
            alt={chatUser.name}
            className="cp-header-avatar"
            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
          />

          <div className="cp-header-info">
            <p className="cp-header-name">{chatUser.name}</p>
            <div className="cp-header-status">
              <span className="cp-status-dot" /> Online
            </div>
          </div>
        </div>

        {/* ── Messages ── */}
        <div id="chat-box" className="cp-chat-box">
          {messages.length === 0 ? (
            <div className="cp-empty-chat">
              <div className="cp-empty-icon">💬</div>
              <p className="cp-empty-text">No messages yet — say hello!</p>
            </div>
          ) : (
            messages.map((m, i) => {
              const isMe = m.senderId === senderId;
              return (
                <div key={i} className={`cp-msg-wrap ${isMe ? "me" : "them"}`}>
                  <div className="cp-bubble">
                    {!isMe && <div className="cp-sender-name">{m.senderName}</div>}
                    {m.image && (
                      <img
                        src={`${BASE_URL}${m.image}`}
                        alt="sent"
                        className="cp-msg-img"
                        onClick={() => setPreviewImage(`${BASE_URL}${m.image}`)}
                      />
                    )}
                    {m.message && <div className="cp-msg-text">{m.message}</div>}
                    <div className="cp-msg-time">{formatTime(m.timestamp)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Input ── */}
        <div className="cp-input-area">
          <div className="cp-input-row">
            <input
              className="cp-text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <label className="cp-attach-label">
              <Paperclip size={20} />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageSelect(e.target.files[0])}
              />
            </label>

            <button className="cp-send-btn" onClick={sendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* ── Image Preview Modal ── */}
        {previewImage && (
          <div className="cp-modal-overlay" onClick={() => setPreviewImage(null)}>
            <img
              src={previewImage}
              alt="preview"
              className="cp-modal-img"
              onClick={(e) => e.stopPropagation()}
            />
            {imageFile && (
              <button
                className="cp-send-image-btn"
                onClick={(e) => { e.stopPropagation(); handleImageUpload(imageFile); }}
              >
                <ImageIcon size={18} />
                Send Image
              </button>
            )}
            <p className="cp-modal-close-hint">Click outside to close</p>
          </div>
        )}

      </div>
    </>
  );
};