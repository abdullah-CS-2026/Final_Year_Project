import { Search, Bell, User, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import socket, {
  subscribeToNotifications,
  unsubscribeFromNotifications
} from "../../socket";


export const ContractorHeader = ({ setShowSidebar }) => {

  const contractor = JSON.parse(localStorage.getItem("contractor"));
  console.log("Contractor from localStorage:", contractor);

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // ✅ JOIN PERSONAL ROOM
useEffect(() => {
  if (!contractor?._id) return;

  // join room once
  socket.emit("joinUser", contractor._id);
  console.log("📡 Joining room:", contractor._id);

  const handleNotification = (data) => {
    console.log("🔔 Component received:", data);
    setNotifications(prev => [data, ...prev]);
  };

  // subscribe to global listener
  subscribeToNotifications(handleNotification);

  return () => {
    unsubscribeFromNotifications(handleNotification);
  };
}, [contractor?._id]);


  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">

      <button
        className="btn d-lg-none"
        onClick={() => setShowSidebar(prev => !prev)}
      >
        <Menu size={22} />
      </button>

      <h5 className="mb-0 ms-3 fw-semibold d-none d-lg-block">
        Dashboard
      </h5>

      <div className="d-flex align-items-center gap-3">

        {/* SEARCH */}
        <div className="position-relative">
          <Search size={16}
            className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
          />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="search"
            style={{ width: "250px" }}
          />
        </div>

        {/* 🔔 NOTIFICATION */}
        <div className="position-relative">

          <Bell
            size={20}
            className="text-muted cursor-pointer"
            onClick={() => setOpen(!open)}
          />

          {/* RED BADGE */}
          {notifications.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {notifications.length}
            </span>
          )}

          {/* DROPDOWN */}
          {open && (
            <div
              className="position-absolute end-0 mt-2 bg-white shadow rounded"
              style={{ width: "300px", zIndex: 999 }}
            >
              {notifications.length === 0 ? (
                <p className="p-2 text-muted">No notifications</p>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} className="p-2 border-bottom small">
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <User size={22} className="text-muted cursor-pointer" />
      </div>
    </header>
  );
};