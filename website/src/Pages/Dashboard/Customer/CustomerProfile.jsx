import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { User, Phone, Mail, MapPin, Users, FileText } from "lucide-react";
import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_API_URL;
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .cp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #e8f4ff 0%, #dbeeff 100%);
    padding: 40px 20px;
  }

  .cp-card {
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(29, 111, 219, 0.15);
    overflow: hidden;
    max-width: 680px;
    margin: 0 auto;
    border: none;
  }

  .cp-card-header {
    background: linear-gradient(135deg, #1d6fdb 0%, #2563eb 50%, #3b82f6 100%);
    padding: 32px 40px 24px;
    position: relative;
    overflow: hidden;
  }

  .cp-card-header::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%);
  }

  .cp-card-header::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 20px;
    width: 120px; height: 120px;
    background: radial-gradient(circle, rgba(147,197,253,0.25) 0%, transparent 70%);
  }

  .cp-header-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin-bottom: 4px;
    position: relative;
    z-index: 1;
  }

  .cp-header-name {
    font-size: 26px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    position: relative;
    z-index: 1;
  }

  /* Avatar section */
  .cp-avatar-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 40px 20px;
    border-bottom: 1px solid #f0f4f8;
  }

  .cp-avatar-ring {
    position: relative;
    display: inline-block;
  }

  .cp-avatar-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #93c5fd;
    box-shadow: 0 4px 20px rgba(37,99,235,0.2);
  }

  .cp-avatar-edit {
    position: absolute;
    bottom: 4px;
    right: -2px;
    width: 30px;
    height: 30px;
    background: #2563eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(37,99,235,0.5);
    transition: transform 0.2s;
    border: 2px solid #fff;
  }

  .cp-avatar-edit:hover { transform: scale(1.1); }

  .cp-avatar-delete {
    position: absolute;
    bottom: 4px;
    left: -2px;
    width: 30px;
    height: 30px;
    background: #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(239,68,68,0.4);
    transition: transform 0.2s;
    border: 2px solid #fff;
  }

  .cp-avatar-delete:hover { transform: scale(1.1); }

  .cp-avatar-hint {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 10px;
    font-weight: 500;
  }

  /* Form */
  .cp-form-body {
    padding: 24px 40px 32px;
  }

  .cp-section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 16px;
  }

  .cp-field {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 16px;
    margin-bottom: 12px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .cp-field:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    background: #ffffff;
  }

  .cp-field-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cp-field-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .cp-field-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 1px;
  }

  .cp-field-input {
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    padding: 0;
    outline: none;
    width: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cp-field-input::placeholder { color: #cbd5e1; }

  /* Buttons */
  .cp-btn-row {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 28px;
    flex-wrap: wrap;
  }

  .cp-btn-cancel {
    padding: 10px 22px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    background: transparent;
    font-size: 13.5px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cp-btn-cancel:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .cp-btn-cancel:disabled { opacity: 0.4; cursor: not-allowed; }

  .cp-btn-save {
    padding: 10px 28px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    font-size: 13.5px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(37,99,235,0.4);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cp-btn-save:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37,99,235,0.5);
  }

  .cp-btn-save:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .cp-btn-proposals {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 24px;
    border-radius: 10px;
    background: linear-gradient(135deg, #059669, #10b981);
    color: #fff;
    font-size: 13.5px;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(16,185,129,0.3);
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cp-btn-proposals:hover {
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(16,185,129,0.4);
  }

  .cp-proposals-row {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f0f4f8;
  }

  .cp-changed-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(37,99,235,0.1);
    color: #2563eb;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 20px;
    margin-bottom: 12px;
  }

  .cp-changed-dot {
    width: 6px; height: 6px;
    background: #2563eb;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const fieldConfig = [
  { name: "name",    label: "Full Name", icon: User,    type: "text"  },
  { name: "phone",   label: "Phone",     icon: Phone,   type: "text"  },
  { name: "email",   label: "Email",     icon: Mail,    type: "email" },
  { name: "address", label: "Address",   icon: MapPin,  type: "text"  },
  { name: "gender",  label: "Gender",    icon: Users,   type: "text"  },
];

export const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeProfile, setRemoveProfile] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("customer");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCustomer(parsed);
      setOriginalData(parsed);
    }
  }, []);

  if (!customer) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>No customer data found. Please login again.</h4>
      </div>
    );
  }

  const handleChange = (e) => {
    const updated = { ...customer, [e.target.name]: e.target.value };
    setCustomer(updated);
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
        Swal.fire({ icon: "info", title: "Profile picture removed", text: "Click 'Save Changes' to apply.", timer: 2000, showConfirmButton: false });
      }
    });
  };

  const handleCancel = () => {
    setCustomer(originalData);
    setPreview(null);
    setSelectedFile(null);
    setRemoveProfile(false);
    setIsChanged(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmUpdate = await Swal.fire({
      title: "Save changes?",
      text: "Your profile will be updated.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });
    if (!confirmUpdate.isConfirmed) return;

    try {
      const customerId = customer._id || customer.id;
      if (!customerId) throw new Error("Customer ID missing. Please login again.");
      const body = new FormData();
      body.append("name", customer.name);
      body.append("email", customer.email);
      body.append("phone", customer.phone);
      body.append("address", customer.address);
      body.append("gender", customer.gender);
      if (selectedFile) body.append("profilePic", selectedFile);
      if (removeProfile) body.append("removeProfile", true);

      const res = await fetch(`${BASE_URL}/customer/update/${customerId}`, { method: "PUT", body });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("customer", JSON.stringify(data.customer));
        setCustomer(data.customer);
        setOriginalData(data.customer);
        setSelectedFile(null); setPreview(null); setRemoveProfile(false); setIsChanged(false);
        Swal.fire({ icon: "success", title: "Profile updated successfully ✅", timer: 2000, showConfirmButton: false, position: "center" });
      } else {
        Swal.fire({ icon: "error", title: "Update failed", text: data.message, confirmButtonColor: "#d33" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error updating profile", text: err.message, confirmButtonColor: "#d33" });
    }
  };

  const avatarSrc = preview
    ? preview
    : customer.profilePic
    ? `${BASE_URL}${customer.profilePic}`
    : null;

  return (
    <>
      <style>{styles}</style>
      <div className="cp-root">
        <div className="cp-card">

          {/* Header */}
          <div className="cp-card-header">
            <p className="cp-header-title">Customer Account</p>
            <h2 className="cp-header-name">{customer.name || "Your Profile"}</h2>
          </div>

          {/* Avatar */}
          <div className="cp-avatar-wrap">
            <div className="cp-avatar-ring">
              {removeProfile || !avatarSrc ? (
                <IoPersonCircleSharp size={100} style={{ color: "#94a3b8" }} />
              ) : (
                <img src={avatarSrc} alt="Avatar" className="cp-avatar-img" />
              )}

              <label htmlFor="profileUpload" className="cp-avatar-edit" title="Change photo">
                <FaEdit size={12} color="#fff" />
              </label>

              {!removeProfile && avatarSrc && (
                <span className="cp-avatar-delete" title="Remove photo" onClick={handleDeleteProfile}>
                  <FaTrash size={11} color="#fff" />
                </span>
              )}

              <input type="file" id="profileUpload" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            </div>
            <span className="cp-avatar-hint">Click the blue icon to change photo</span>
          </div>

          {/* Form */}
          <div className="cp-form-body">
            {isChanged && (
              <div className="cp-changed-badge">
                <span className="cp-changed-dot" />
                Unsaved changes
              </div>
            )}

            <p className="cp-section-label">Personal Information</p>

            <form onSubmit={handleSubmit}>
              {fieldConfig.map(({ name, label, icon: Icon, type }) => (
                <div className="cp-field" key={name}>
                  <div className="cp-field-icon">
                    <Icon size={15} color="#ffffff" />
                  </div>
                  <div className="cp-field-inner">
                    <span className="cp-field-label">{label}</span>
                    <input
                      className="cp-field-input"
                      type={type}
                      name={name}
                      value={customer[name] || ""}
                      onChange={handleChange}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                  </div>
                </div>
              ))}

              <div className="cp-btn-row">
                <button type="button" className="cp-btn-cancel" onClick={handleCancel} disabled={!isChanged}>
                  Cancel
                </button>
                <button type="submit" className="cp-btn-save" disabled={!isChanged}>
                  Save Changes
                </button>
              </div>
            </form>

            <div className="cp-proposals-row">
              <Link to="/customer/proposals" className="cp-btn-proposals">
                <FileText size={15} />
                Project Proposals
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};