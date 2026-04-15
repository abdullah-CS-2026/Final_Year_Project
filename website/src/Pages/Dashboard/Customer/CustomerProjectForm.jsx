import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, MapPin, Maximize2, DollarSign,
  Calendar, Zap, AlignLeft, Paperclip, Send, Eye
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .cpf-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #e8f4ff 0%, #dbeeff 100%);
    padding: 40px 20px;
  }

  .cpf-card {
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(29, 111, 219, 0.15);
    overflow: hidden;
    max-width: 720px;
    margin: 0 auto;
  }

  .cpf-header {
    background: linear-gradient(135deg, #1d6fdb 0%, #2563eb 50%, #3b82f6 100%);
    padding: 30px 40px;
    position: relative;
    overflow: hidden;
  }

  .cpf-header::before {
    content: '';
    position: absolute;
    top: -60px; right: -40px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  }

  .cpf-header::after {
    content: '';
    position: absolute;
    bottom: -30px; left: 30px;
    width: 120px; height: 120px;
    background: radial-gradient(circle, rgba(147,197,253,0.2) 0%, transparent 70%);
  }

  .cpf-header-label {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    margin-bottom: 6px;
    position: relative; z-index: 1;
  }

  .cpf-header-title {
    font-size: 30px;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    position: relative; z-index: 1;
  }

  .cpf-body {
    padding: 32px 40px 40px;
  }

  .cpf-section-label {
    font-size: 12.5px;
    text-transform: uppercase;
    color: #94a3b8;
    margin: 24px 0 14px;
  }

  .cpf-section-label:first-child { margin-top: 0; }

  /* Field rows */
  .cpf-field {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 16px;
    margin-bottom: 12px;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .cpf-field:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    background: #ffffff;
  }

  .cpf-icon {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cpf-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .cpf-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 2px;
  }

  .cpf-input {
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 500;
    color: #1e293b;
    padding: 0;
    outline: none;
    width: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cpf-input::placeholder { color: #cbd5e1; }

  .cpf-input option { background: #fff; color: #1e293b; }

  .cpf-textarea {
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 500;
    color: #1e293b;
    padding: 0;
    outline: none;
    width: 100%;
    resize: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 72px;
  }

  .cpf-textarea::placeholder { color: #cbd5e1; }

  /* Two-col grid */
  .cpf-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 0;
  }

  .cpf-grid-2 .cpf-field { margin-bottom: 0; }

  /* Urgency toggle */
  .cpf-urgency-row {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
  }

  .cpf-urgency-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    font-size: 16px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cpf-urgency-btn.active-normal {
    border-color: #2563eb;
    background: rgba(37,99,235,0.07);
    color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
  }

  .cpf-urgency-btn.active-urgent {
    border-color: #ef4444;
    background: rgba(239,68,68,0.07);
    color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
  }

  /* File upload */
  .cpf-upload-label {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #f8fafc;
    border: 1.5px dashed #bfdbfe;
    border-radius: 12px;
    padding: 14px 16px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 12px;
  }

  .cpf-upload-label:hover {
    border-color: #2563eb;
    background: rgba(37,99,235,0.04);
  }

  .cpf-upload-text {
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
  }

  .cpf-upload-hint {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 1px;
  }

  /* Image preview */
  .cpf-preview-images {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .cpf-preview-img {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    border: 2px solid #bfdbfe;
    box-shadow: 0 2px 8px rgba(37,99,235,0.1);
  }

  /* Summary preview */
  .cpf-summary {
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    border: 1.5px solid #bfdbfe;
    border-radius: 14px;
    padding: 18px 20px;
    margin-bottom: 20px;
  }

  .cpf-summary-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: #2563eb;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .cpf-summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 16px;
  }

  .cpf-summary-row {
    display: flex;
    flex-direction: column;
  }

  .cpf-summary-key {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .cpf-summary-val {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    margin-top: 1px;
  }

  /* Submit button */
  .cpf-submit {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #1d6fdb, #3b82f6);
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(37,99,235,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.3px;
  }

  .cpf-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37,99,235,0.45);
  }

  .cpf-submit:active { transform: translateY(0); }

  @media (max-width: 576px) {
    .cpf-body { padding: 24px 20px 32px; }
    .cpf-header { padding: 24px 20px; }
    .cpf-grid-2 { grid-template-columns: 1fr; }
    .cpf-summary-grid { grid-template-columns: 1fr; }
  }
`;

export const CustomerProjectForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "", location: "", plotSize: "", budget: "",
    description: "", category: "", deadline: "",
    urgency: "normal", attachments: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = JSON.parse(localStorage.getItem("customer"));
      const customerId = result?.id || result?._id;
      const submission = new FormData();
      submission.append("customer", customerId);
      Object.keys(formData).forEach((key) => {
        if (key === "attachments") {
          Array.from(formData.attachments).forEach((file) =>
            submission.append("attachments", file)
          );
        } else {
          submission.append(key, formData[key]);
        }
      });
      const res = await fetch("http://localhost:5000/customer/projects", {
        method: "POST",
        body: submission,
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Project request submitted successfully!");
        navigate("/customer-profile");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting project");
    }
  };

  const hasPreview = formData.title || formData.category || formData.location;

  return (
    <>
      <style>{styles}</style>
      <div className="cpf-root">
        <div className="cpf-card">

          {/* Header */}
          <div className="cpf-header">
            <p className="cpf-header-label">New Submission</p>
            <h2 className="cpf-header-title">Post a New Project</h2>
          </div>

          <div className="cpf-body">
            <form onSubmit={handleSubmit}>

              {/* Project Info */}
              <p className="cpf-section-label">Project Details</p>

              {/* Title */}
              <div className="cpf-field">
                <div className="cpf-icon"><FileText size={15} color="#fff" /></div>
                <div className="cpf-inner">
                  <span className="cpf-label">Project Title</span>
                  <input className="cpf-input" type="text" name="title"
                    placeholder="e.g. Build a 10 Marla House"
                    value={formData.title} onChange={handleChange} required />
                </div>
              </div>

              {/* Category + Location */}
              <div className="cpf-grid-2">
                <div className="cpf-field">
                  <div className="cpf-icon"><FileText size={15} color="#fff" /></div>
                  <div className="cpf-inner">
                    <span className="cpf-label">Project Type</span>
                    <select className="cpf-input" name="category"
                      value={formData.category} onChange={handleChange} required>
                      <option value="">Select Type</option>
                      <option value="house">House</option>
                      <option value="commercial">Commercial Building</option>
                      <option value="renovation">Renovation</option>
                      <option value="interior">Interior Design</option>
                    </select>
                  </div>
                </div>

                <div className="cpf-field">
                  <div className="cpf-icon"><MapPin size={15} color="#fff" /></div>
                  <div className="cpf-inner">
                    <span className="cpf-label">Location</span>
                    <select className="cpf-input" name="location"
                      value={formData.location} onChange={handleChange} required>
                      <option value="">Select City</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Multan">Multan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Plot Size + Budget */}
              <div className="cpf-grid-2" style={{ marginTop: '0', marginBottom: '12px' }}>
                <div className="cpf-field" style={{ marginBottom: 0 }}>
                  <div className="cpf-icon"><Maximize2 size={15} color="#fff" /></div>
                  <div className="cpf-inner">
                    <span className="cpf-label">Plot Size</span>
                    <input className="cpf-input" type="text" name="plotSize"
                      placeholder="e.g. 5 Marla"
                      value={formData.plotSize} onChange={handleChange} required />
                  </div>
                </div>

                <div className="cpf-field" style={{ marginBottom: 0 }}>
                  <div className="cpf-icon"><DollarSign size={15} color="#fff" /></div>
                  <div className="cpf-inner">
                    <span className="cpf-label">Budget (Optional)</span>
                    <input className="cpf-input" type="number" name="budget"
                      placeholder="e.g. 5000000"
                      value={formData.budget} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <p className="cpf-section-label" style={{ marginTop: '20px' }}>Timeline & Urgency</p>

              <div className="cpf-field">
                <div className="cpf-icon"><Calendar size={15} color="#fff" /></div>
                <div className="cpf-inner">
                  <span className="cpf-label">Expected Completion Date</span>
                  <input className="cpf-input" type="date" name="deadline"
                    value={formData.deadline} onChange={handleChange} required />
                </div>
              </div>

              {/* Urgency toggle */}
              <div className="cpf-urgency-row">
                <button
                  type="button"
                  className={`cpf-urgency-btn ${formData.urgency === "normal" ? "active-normal" : ""}`}
                  onClick={() => setFormData({ ...formData, urgency: "normal" })}
                >
                  <Zap size={15} /> Normal
                </button>
                <button
                  type="button"
                  className={`cpf-urgency-btn ${formData.urgency === "urgent" ? "active-urgent" : ""}`}
                  onClick={() => setFormData({ ...formData, urgency: "urgent" })}
                >
                  <Zap size={15} fill={formData.urgency === "urgent" ? "#ef4444" : "none"} /> Urgent
                </button>
              </div>

              {/* Description */}
              <p className="cpf-section-label" style={{ marginTop: '20px' }}>Additional Info</p>

              <div className="cpf-field" style={{ alignItems: 'flex-start' }}>
                <div className="cpf-icon" style={{ marginTop: '2px' }}><AlignLeft size={15} color="#fff" /></div>
                <div className="cpf-inner">
                  <span className="cpf-label">Description</span>
                  <textarea className="cpf-textarea" name="description" rows="3"
                    placeholder="Add any special requirements or notes..."
                    value={formData.description} onChange={handleChange} />
                </div>
              </div>

              {/* File Upload */}
              <label className="cpf-upload-label" htmlFor="attachments">
                <div className="cpf-icon"><Paperclip size={15} color="#fff" /></div>
                <div>
                  <div className="cpf-upload-text">Attach Blueprints / Files</div>
                  <div className="cpf-upload-hint">Images, PDFs — optional</div>
                </div>
                <input type="file" id="attachments" name="attachments"
                  multiple accept="image/*,.pdf"
                  style={{ display: "none" }} onChange={handleFileChange} />
              </label>

              {/* Image preview */}
              {formData.attachments.length > 0 && (
                <div className="cpf-preview-images">
                  {Array.from(formData.attachments).map((file, i) => (
                    <img key={i} src={URL.createObjectURL(file)}
                      alt="preview" className="cpf-preview-img" />
                  ))}
                </div>
              )}

              {/* Summary preview */}
              {hasPreview && (
                <div className="cpf-summary">
                  <div className="cpf-summary-title">
                    <Eye size={14} /> Project Summary
                  </div>
                  <div className="cpf-summary-grid">
                    {[
                      { k: "Title", v: formData.title },
                      { k: "Type", v: formData.category },
                      { k: "Location", v: formData.location },
                      { k: "Plot Size", v: formData.plotSize },
                      { k: "Budget", v: formData.budget ? `PKR ${Number(formData.budget).toLocaleString()}` : "—" },
                      { k: "Deadline", v: formData.deadline },
                      { k: "Urgency", v: formData.urgency },
                    ].filter(r => r.v).map(({ k, v }) => (
                      <div className="cpf-summary-row" key={k}>
                        <span className="cpf-summary-key">{k}</span>
                        <span className="cpf-summary-val">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="cpf-submit">
                <Send size={17} /> Submit Project Request
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};