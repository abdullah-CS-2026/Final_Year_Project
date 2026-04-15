import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Home } from "lucide-react";

export const CustomerSignup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [profilePic, setProfilePic] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "confirmPassword") {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (profilePic) {
        formDataToSend.append("profilePic", profilePic);
      }

      const res = await fetch("http://localhost:5000/customer/signup", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Customer Signup successful!");
        navigate("/customer-login");
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
        paddingTop: "50px",
        paddingBottom: "50px"
      }}
    >

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-lg-6">

            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                padding: "40px"
              }}
            >

              {/* Header */}

              <div className="text-center mb-4">

                <Home size={45} color="#667eea" className="mb-2" />

                <h3 className="fw-bold" style={{ color: "#667eea" }}>
                  Customer Signup
                </h3>

                <p className="text-muted small">
                  Create your account to start building your dream home
                </p>

              </div>


              <form onSubmit={handleSubmit} encType="multipart/form-data">

                {/* Name + Phone */}

                <div className="row mb-3">

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">Full Name</label>

                    <div className="d-flex align-items-center bg-light rounded px-2">

                      <User size={18} className="me-2 text-primary" />

                      <input
                        type="text"
                        className="form-control border-0 bg-transparent"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
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
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                </div>


                {/* Email */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">Email</label>

                  <div className="d-flex align-items-center bg-light rounded px-2">

                    <Mail size={18} className="me-2 text-primary" />

                    <input
                      type="email"
                      className="form-control border-0 bg-transparent"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


                {/* Address */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">Address</label>

                  <div className="d-flex align-items-center bg-light rounded px-2">

                    <MapPin size={18} className="me-2 text-primary" />

                    <input
                      type="text"
                      className="form-control border-0 bg-transparent"
                      name="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


                {/* Password */}

                <div className="row mb-3">

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">Password</label>

                    <div className="d-flex align-items-center bg-light rounded px-2">

                      <Lock size={18} className="me-2 text-primary" />

                      <input
                        type="password"
                        className="form-control border-0 bg-transparent"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label fw-semibold">Confirm Password</label>

                    <div className="d-flex align-items-center bg-light rounded px-2">

                      <Lock size={18} className="me-2 text-primary" />

                      <input
                        type="password"
                        className="form-control border-0 bg-transparent"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                </div>


                {/* Gender */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">Gender</label>

                  <div className="bg-light rounded p-2">

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

                </div>


                {/* Profile Pic */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Profile Picture (Optional)
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                </div>


                {/* Button */}

                <button
                  type="submit"
                  className="btn w-100 fw-bold"
                  style={{
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    color: "white",
                    borderRadius: "10px"
                  }}
                >
                  Create Account
                </button>

              </form>


              <p className="text-center mt-4">

                Already have an account ?{" "}

                <NavLink
                  to="/customer-login"
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