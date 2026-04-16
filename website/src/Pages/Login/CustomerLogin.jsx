import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Mail, Lock, Home } from "lucide-react";
import { showToast } from "../../components/Toast";
const BASE_URL = import.meta.env.VITE_API_URL;

export const CustomerLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    setError("");

    try {

      const res = await fetch(`${BASE_URL}/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("customerToken", data.token);
        localStorage.setItem("customer", JSON.stringify(data.user));

        window.dispatchEvent(new Event("authChange"));

        setCustomer(data.user);

        showToast("Login Successful", "success", 1500);

        setTimeout(() => navigate("/home"), 1500);

      } else {

        setError(data.message || "Login failed");
        showToast(data.message || "Login failed", "error", 2000);

      }

    } catch (err) {

      console.error(err);
      setError("Something went wrong. Try again.");

    }

  };

  return (

    <div
      style={{
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center"
      }}
    >

      <div className="container">

        <div className="row align-items-center">

          {/* Left Side */}

          <div className="col-md-6 d-none d-md-flex flex-column text-white pe-5">

            <Home size={80} className="mb-4" />

            <h2 className="fw-bold mb-3">Smart House</h2>

            <p className="fs-5">
              Connect with trusted contractors and build your dream home
            </p>

          </div>


          {/* Login Card */}

          <div className="col-md-6 col-lg-5">

            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                padding: "40px"
              }}
            >

              <div className="text-center mb-4">

                <Home size={40} color="#667eea" className="mb-2" />

                <h3 className="fw-bold" style={{ color: "#667eea" }}>
                  Customer Login
                </h3>

                <p className="text-muted small">
                  Access your projects and proposals
                </p>

              </div>


              <form onSubmit={handleLogin}>

                {/* Email */}

                <div className="mb-4">

                  <label className="form-label fw-semibold small">
                    Email Address
                  </label>

                  <div className="d-flex align-items-center bg-light rounded px-2">

                    <Mail size={18} className="me-2 text-primary" />

                    <input
                      type="email"
                      className="form-control border-0 bg-transparent"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                  </div>

                </div>


                {/* Password */}

                <div className="mb-4">

                  <label className="form-label fw-semibold small">
                    Password
                  </label>

                  <div className="d-flex align-items-center bg-light rounded px-2">

                    <Lock size={18} className="me-2 text-primary" />

                    <input
                      type="password"
                      className="form-control border-0 bg-transparent"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                  </div>

                </div>


                {/* Error */}

                {error && (
                  <div
                    className="mb-3"
                    style={{
                      background: "#fee",
                      color: "#c33",
                      padding: "10px",
                      borderRadius: "8px"
                    }}
                  >
                    {error}
                  </div>
                )}


                {/* Forgot Password */}

                <div className="mb-4">

                  <NavLink
                    to="#"
                    style={{
                      color: "#667eea",
                      fontSize: "14px",
                      textDecoration: "none",
                      fontWeight: "500"
                    }}
                  >
                    Forgot Password ?
                  </NavLink>

                </div>


                {/* Login Button */}

                <button
                  type="submit"
                  className="btn w-100 fw-bold"
                  style={{
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    color: "white",
                    borderRadius: "10px"
                  }}
                >
                  Login
                </button>

              </form>


              <hr className="my-4" />


              {/* Signup */}

              <p className="text-center mb-0">

                Don't have an account ?{" "}

                <NavLink
                  to="/customer-signup"
                  style={{
                    color: "#667eea",
                    fontWeight: "600",
                    textDecoration: "none"
                  }}
                >
                  Signup
                </NavLink>

              </p>


              {/* Customer Info */}

              {customer && (

                <div className="text-center mt-4">

                  <h6>Welcome, {customer.name}!</h6>

                  {customer.profilePic && (

                    <img
                      src={`${BASE_URL}${customer.profilePic}`}
                      alt="Profile"
                      className="rounded-circle mt-2"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover"
                      }}
                    />

                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};