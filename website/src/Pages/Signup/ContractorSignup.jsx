import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Home, FileText, CreditCard } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

export const ContractorSignup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
    gender: "",
    cnicNumber: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [verificationImage, setVerificationImage] = useState(null);
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => setProfilePic(e.target.files[0]);
  const handleVerificationImageChange = (e) => setVerificationImage(e.target.files[0]);
  const handleCnicFrontChange = (e) => setCnicFront(e.target.files[0]);
  const handleCnicBackChange = (e) => setCnicBack(e.target.files[0]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("cnicNumber", formData.cnicNumber);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("gender", formData.gender);

      if (profilePic) {
        formDataToSend.append("profilePic", profilePic);
      }

      const res = await fetch(`${BASE_URL}/contractor/signup`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {

        if (verificationImage) {

          const verificationFormData = new FormData();
          verificationFormData.append("contractorId", data.contractor._id);
          verificationFormData.append("verificationImage", verificationImage);

          await fetch(`${BASE_URL}/contractor/signup/verification`, {
            method: "POST",
            body: verificationFormData,
          });

        }

        if (cnicFront || cnicBack) {

          const cnicFormData = new FormData();
          cnicFormData.append("contractorId", data.contractor._id);

          if (cnicFront) cnicFormData.append("cnicFront", cnicFront);
          if (cnicBack) cnicFormData.append("cnicBack", cnicBack);

          await fetch(`${BASE_URL}/contractor/signup/cnic`, {
            method: "POST",
            body: cnicFormData,
          });

        }

        alert("Signup successful!");
        navigate("/contractor-login");

      } else {
        alert(data.error || "Signup failed");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (

    <div
      style={{
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "40px"
      }}
    >

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-lg-7">

            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                padding: "40px"
              }}
            >

              <div className="text-center mb-4">

                <Home size={45} color="#667eea" className="mb-2" />

                <h3 className="fw-bold" style={{ color: "#667eea" }}>
                  Contractor Signup
                </h3>

                <p className="text-muted small">
                  Register as a verified contractor
                </p>

              </div>

              <form onSubmit={handleSubmit} encType="multipart/form-data">

                {/* Name + Phone */}

                <div className="row mb-3">

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">Name</label>

                    <div className="d-flex align-items-center bg-light rounded px-2">

                      <User size={18} className="me-2 text-primary" />

                      <input
                        type="text"
                        className="form-control border-0 bg-transparent"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">Phone</label>

                    <div className="d-flex align-items-center bg-light rounded px-2">

                      <Phone size={18} className="me-2 text-primary" />

                      <input
                        type="text"
                        className="form-control border-0 bg-transparent"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                </div>


                {/* CNIC */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">CNIC Number</label>

                  <div className="d-flex align-items-center bg-light rounded px-2">

                    <CreditCard size={18} className="me-2 text-primary" />

                    <input
                      type="text"
                      className="form-control border-0 bg-transparent"
                      name="cnicNumber"
                      placeholder="12345-1234567-1"
                      value={formData.cnicNumber}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


                {/* Email + Address */}

                <div className="row mb-3">

                  <div className="col-md-6">

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="col-md-6">

                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* City */}

                <div className="mb-3">

                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Password */}

                <div className="row mb-3">

                  <div className="col-md-6">

                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="col-md-6">

                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* Gender */}

                <div className="mb-3">

                  {["Male", "Female", "Other"].map((g) => (

                    <div key={g} className="form-check form-check-inline">

                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                      />

                      <label className="form-check-label">{g}</label>

                    </div>

                  ))}

                </div>


                {/* Uploads */}

                <div className="mb-3">

                  <label className="fw-semibold">Profile Picture</label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                </div>

                <div className="mb-3">

                  <label className="fw-semibold">Verification Document</label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleVerificationImageChange}
                    required
                  />

                </div>


                <div className="row mb-3">

                  <div className="col-md-6">

                    <label className="fw-semibold">CNIC Front</label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleCnicFrontChange}
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="fw-semibold">CNIC Back</label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleCnicBackChange}
                      required
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  className="btn w-100 fw-bold"
                  style={{
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    color: "white",
                    borderRadius: "10px"
                  }}
                >
                  Signup
                </button>

              </form>

              <p className="text-center mt-4">

                Already have an account ?{" "}

                <NavLink
                  to="/contractor-login"
                  className="fw-bold"
                  style={{ color: "#667eea" }}
                >
                  Login
                </NavLink>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};