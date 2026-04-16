import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import Logo from "../assets/About_Page_Pics/Logo.png";
import { User } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

export const Navbar = () => {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const contractorToken = localStorage.getItem("token");
            const customerToken = localStorage.getItem("customerToken");
            const token = contractorToken || customerToken;

            if (!token) {
                setAuthenticated(false);
                setUser(null);
                return;
            }

            // Decide endpoint based on which token exists
            const endpoint = contractorToken
                ? `${BASE_URL}/contractor/me`
                : `${BASE_URL}/customer/me`;

            try {
                const res = await fetch(endpoint, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (data.authenticated) {
                    setAuthenticated(true);
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                } else {
                    setAuthenticated(false);
                    setUser(null);
                    localStorage.removeItem("token");
                    localStorage.removeItem("customerToken");
                    localStorage.removeItem("user");
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setAuthenticated(false);
                setUser(null);
            }
        };

        checkAuth();

        window.addEventListener("authChange", checkAuth);
        return () => window.removeEventListener("authChange", checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("customerToken");
        localStorage.removeItem("contractor");
        localStorage.removeItem("customer");
        localStorage.removeItem("user");
        setAuthenticated(false);
        setUser(null);
        window.dispatchEvent(new Event("authChange"));
        navigate("/home");
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: "#3B6D8A", zIndex: 1030 }}>

            <div className="container">
                <a className="navbar-brand text-white" href="#">
                    <img src={Logo} alt="Logo" width="60" className="d-inline-block align-text-top" />{" "}
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav fs-4 fw-bold">
                        <li className="nav-item mx-2">
                            <NavLink to="/home" className="nav-link text-white">Home</NavLink>
                        </li>
                        <li className="nav-item mx-2">
                            <NavLink to="/about-us" className="nav-link text-white">About Us</NavLink>
                        </li>
                        <li className="nav-item mx-2">
                            <NavLink to="/services" className="nav-link text-white">Services</NavLink>
                        </li>

                        {authenticated ? (
                            <li className="nav-item mx-2">
                                <NavLink onClick={handleLogout} className="nav-link text-white">
                                    Logout
                                </NavLink>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item dropdown mx-2">
                                    <a
                                        className="nav-link dropdown-toggle text-white"
                                        href="#"
                                        id="registerDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Register
                                    </a>
                                    <ul
                                        className="dropdown-menu"
                                        aria-labelledby="registerDropdown"
                                        style={{ backgroundColor: "#D9D9D9" }}
                                    >
                                        <li>
                                            <NavLink to="/customer-signup" className="dropdown-item">
                                                As Investor
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/contractor-signup" className="dropdown-item">
                                                As Contractor
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item dropdown mx-2">
                                    <a
                                        className="nav-link dropdown-toggle text-white"
                                        href="#"
                                        id="loginDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Login
                                    </a>
                                    <ul
                                        className="dropdown-menu"
                                        aria-labelledby="loginDropdown"
                                        style={{ backgroundColor: "#D9D9D9" }}
                                    >
                                        <li>
                                            <NavLink to="/customer-login" className="dropdown-item">
                                                As Investor
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/contractor-login" className="dropdown-item">
                                                As Contractor
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        )}

                        <li className="nav-item mx-4 mt-1">
                            <NavLink to="/learn-more" className="btn btn-outline-light rounded-pill">
                                Learn More
                            </NavLink>
                        </li>
                    </ul>

                    {authenticated && (
                        <li className="nav-item mx-4 mt-1 list-unstyled">
                            <NavLink
                                to={localStorage.getItem("token") ? "/contractor-profile" : "/customer-profile"}
                                className="btn btn-outline-light rounded-pill"
                            >
                                <User size={25} />
                            </NavLink>
                        </li>
                    )}

                </div>
            </div>
        </nav>
    );
};
