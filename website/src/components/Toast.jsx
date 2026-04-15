import React, { useEffect, useState } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

const toastStyles = `
  .toast-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    max-width: 90vw;
    width: 100%;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 22px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    border-left: 4px solid;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 15px;
    font-weight: 500;
    animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    pointer-events: auto;
    max-width: 420px;
    min-width: 300px;
  }

  .toast.success {
    border-left-color: #10b981;
    background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  }

  .toast.success .toast-icon {
    color: #10b981;
  }

  .toast.error {
    border-left-color: #ef4444;
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
  }

  .toast.error .toast-icon {
    color: #ef4444;
  }

  .toast.info {
    border-left-color: #3b82f6;
    background: linear-gradient(135deg, #f0f9ff, #eff6ff);
  }

  .toast.info .toast-icon {
    color: #3b82f6;
  }

  .toast-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-message {
    flex: 1;
    color: #1f2937;
  }

  .toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }

  .toast-close:hover {
    color: #4b5563;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -70%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -30%);
    }
  }

  .toast.closing {
    animation: slideOut 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @media (max-width: 480px) {
    .toast-container {
      width: 100%;
      padding: 0 12px;
    }

    .toast {
      width: 100%;
      max-width: none;
      min-width: auto;
    }
  }
`;

let toastId = 0;

// Global state for multiple toasts
let toastQueue = [];
let setToastQueueGlobal = null;

// Toast trigger function
export const showToast = (message, type = "success", duration = 2500) => {
  const id = toastId++;
  const toastItem = { id, message, type };

  toastQueue = [...toastQueue, toastItem];

  if (setToastQueueGlobal) {
    setToastQueueGlobal([...toastQueue]);
  }

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
};

const removeToast = (id) => {
  toastQueue = toastQueue.filter((t) => t.id !== id);
  if (setToastQueueGlobal) {
    setToastQueueGlobal([...toastQueue]);
  }
};

// Toast Provider Component (add to App.jsx)
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  React.useEffect(() => {
    setToastQueueGlobal = setToasts;
    setToasts([...toastQueue]);
  }, []);

  return (
    <>
      <style>{toastStyles}</style>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};

// Individual Toast Component
const Toast = ({ id, message, type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "info":
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast ${type} ${isClosing ? "closing" : ""}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose}>
        <X size={16} />
      </button>
    </div>
  );
};
