import {
  House,
  User,
  Map,
  Upload,
  ClipboardCheck,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { FileText } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router";

export const CustomerSidebar = ({ showSidebar, setShowSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    navigate("/home");
  };

  return (
    <>
      {/* Sidebar for large screens (always visible) */}
      <aside
        className="d-none d-lg-flex flex-column text-white p-3 vh-100"
        style={{
          width: "220px",
          background: "#3B6D8A",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <SidebarContent handleLogout={handleLogout} />
      </aside>

      {/* Sidebar for small screens (toggleable) */}
      <aside
        className="d-lg-none text-white p-3 vh-100"
        style={{
          width: "220px",
          background: "#3B6D8A",
          position: "fixed",
          top: 0,
          left: showSidebar ? "0" : "-220px",
          transition: "left 0.3s ease",
          zIndex: 1050,
        }}
      >
        <SidebarContent handleLogout={handleLogout} />
      </aside>
    </>
  );
};

// ✅ Extracted sidebar items into reusable component
const SidebarContent = ({ handleLogout }) => (
  <>
    <div className="mb-4">
      <h5 className="mb-0">Smart House</h5>
      <small>Construction</small>
    </div>

    <ul className="nav flex-column gap-2 flex-grow-1">
      <li className="nav-item">
        <NavLink to="/home" className="nav-link text-white d-flex align-items-center gap-2">
          <House size={18} /> Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="customer-profile" className="nav-link text-white d-flex align-items-center gap-2">
          <User size={18} /> Profile
        </NavLink>
      </li>
            <li className="nav-item">
        <NavLink to="/customer/projects" className="nav-link text-white d-flex align-items-center gap-2">
          <MessageCircle size={18} /> Make Request
        </NavLink>
      </li>
            <li className="nav-item">
        <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
          <Map size={18} /> 2D Map Predict
        </a>
      </li>
      <li className="nav-item">
        <NavLink to="/customer/see-request" className="nav-link text-white d-flex align-items-center gap-2">
          <MessageCircle size={18} /> View Request
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/customer/proposals" className="nav-link text-white d-flex align-items-center gap-2">
          <FileText size={18} /> Project Proposals
        </NavLink>
      </li>

      <li className="nav-item">
        <NavLink to="/customer-project-track" className="nav-link text-white d-flex align-items-center gap-2">
          <ClipboardCheck size={18} /> Project Tracking
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/customer-chat-list" className="nav-link text-white d-flex align-items-center gap-2">
          <MessageCircle size={18} /> Chat
        </NavLink>
      </li>

      <li className="nav-item">
        <NavLink to="/customer/shortlisted-proposals" className="nav-link text-white d-flex align-items-center gap-2">
          <FileText size={18} /> Shortlisted Proposals
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/customer/accepted-proposals" className="nav-link text-white d-flex align-items-center gap-2">
          <FileText size={18} /> Accepted Proposals
        </NavLink>
      </li>



      <li className="nav-item mt-auto">
        <button
          onClick={handleLogout}
          className="btn btn-link nav-link text-white d-flex align-items-center gap-2 p-0"
        >
          <LogOut size={18} /> Logout
        </button>
      </li>
    </ul>
  </>
);
