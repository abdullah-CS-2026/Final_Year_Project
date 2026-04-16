import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router";
import { Mail, Lock, Hammer } from "lucide-react";
import { showToast } from "../../components/Toast";
const BASE_URL = import.meta.env.VITE_API_URL;

export const ContractorLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [contractor, setContractor] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    setError("");

    try {

      const res = await fetch(`${BASE_URL}/contractor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("contractor", JSON.stringify(data.contractor));

        window.dispatchEvent(new Event("authChange"));

        setContractor(data.contractor);

        showToast("Login Successful", "success", 1500);

        setTimeout(() => navigate("/home"), 1500);

      } else {

        setError(data.msg || "Login failed");
        showToast(data.msg || "Login failed", "error", 2000);

      }

    } catch (err) {

      console.error(err);
      setError("Something went wrong. Try again.");

    }

  };

  return (

    <div
      style={{
        background: "linear-gradient(135deg,#ff6b6b,#ee5a6f)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center"
      }}
    >

      <div className="container">

        <div className="row align-items-center">

          {/* Left Info Section */}

          <div className="col-md-6 d-none d-md-flex flex-column text-white pe-5">

            <Hammer size={80} className="mb-4" />

            <h2 className="fw-bold mb-3">Smart Build</h2>

            <p className="fs-5">
              Build strong relationships with customers and grow your business
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

                <Hammer size={40} color="#ff6b6b" className="mb-2" />

                <h3 className="fw-bold" style={{ color: "#ff6b6b" }}>
                  Contractor Login
                </h3>

                <p className="text-muted small">
                  Access projects and connect with customers
                </p>

              </div>


              <form onSubmit={handleLogin}>

                {/* Email */}

                <div className="mb-4">

                  <label className="form-label fw-semibold small">
                    Email Address
                  </label>

                  <div className="d-flex align-items-center bg-light rounded px-2">

                    <Mail size={18} className="me-2 text-danger" />

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

                    <Lock size={18} className="me-2 text-danger" />

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
                    to="/contractor-forgot-password"
                    style={{
                      color: "#ff6b6b",
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
                    background: "linear-gradient(135deg,#ff6b6b,#ee5a6f)",
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

                Don’t have an account ?{" "}

                <NavLink
                  to="/contractor-signup"
                  style={{
                    color: "#ff6b6b",
                    fontWeight: "600",
                    textDecoration: "none"
                  }}
                >
                  Signup
                </NavLink>

              </p>


              {/* Contractor Info */}

              {contractor && (

                <div className="text-center mt-4">

                  <h6>Welcome, {contractor.name}!</h6>

                  {contractor.profilePic && (

                    <img
                      src={`${BASE_URL}${contractor.profilePic}`}
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


            <p className="text-center text-white mt-4">

              Login as <span style={{ color: "#ffc107" }}>Customer?</span>{" "}

              <NavLink
                to="/customer-login"
                style={{
                  color: "white",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                Click here
              </NavLink>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};