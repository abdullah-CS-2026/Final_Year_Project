import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from "../assets/About_Page_Pics/Logo.png";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="text-white pt-5 pb-3 mt-5" style={{ backgroundColor: "var(--primary-color, #1e293b)", borderTop: "4px solid var(--accent-color, #fbbf24)" }}>
            <div className="container">
                <div className="row gy-4 mb-5">
                    {/* Brand and Description */}
                    <div className="col-lg-4 col-md-6 pe-lg-5">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <img src={Logo} alt="Logo" width="45" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                            <h4 className="fw-bolder mb-0 text-white">SmartBuild Idea</h4>
                        </div>
                        <p className="text-light opacity-75 mb-4" style={{ lineHeight: '1.6' }}>
                            Your premier platform for modern construction management. We connect verified contractors with customers, providing AI-driven estimates to build your future seamlessly.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white opacity-75 custom-social-hover transition-all"><Facebook size={20} /></a>
                            <a href="#" className="text-white opacity-75 custom-social-hover transition-all"><Twitter size={20} /></a>
                            <a href="#" className="text-white opacity-75 custom-social-hover transition-all"><Instagram size={20} /></a>
                            <a href="#" className="text-white opacity-75 custom-social-hover transition-all"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                        <h5 className="fw-bold mb-4 text-white">Quick Links</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li><NavLink to="/home" className="text-light text-decoration-none custom-link-hover transition-all d-inline-block">Home</NavLink></li>
                            <li><NavLink to="/about-us" className="text-light text-decoration-none custom-link-hover transition-all d-inline-block">About Us</NavLink></li>
                            <li><NavLink to="/services" className="text-light text-decoration-none custom-link-hover transition-all d-inline-block">Services</NavLink></li>
                            <li><NavLink to="/contractor-dashboard" className="text-light text-decoration-none custom-link-hover transition-all d-inline-block">Learn More</NavLink></li>
                        </ul>
                    </div>

                    {/* Authentication/Portal */}
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="fw-bold mb-4 text-white">Portals</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li><NavLink to="/customer-login" className="text-light text-decoration-none custom-link-hover transition-all d-inline-block">Customer Login</NavLink></li>
                            <li><NavLink to="/contractor-login" className="text-light text-decoration-none custom-link-hover transition-all d-inline-block">Contractor Login</NavLink></li>
                            <li><NavLink to="/customer-signup" className="text-light text-decoration-none custom-link-hover transition-all d-inline-block">Become an Investor</NavLink></li>
                            <li><NavLink to="/contractor-signup" className="text-light text-decoration-none custom-link-hover transition-all d-inline-block">Join as Contractor</NavLink></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-4 text-white">Contact Us</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3 text-light opacity-75">
                            <li className="d-flex align-items-start gap-3">
                                <MapPin size={20} className="mt-1 flex-shrink-0 text-warning" />
                                <span>123 Innovation Drive, Tech City, TC 90210</span>
                            </li>
                            <li className="d-flex align-items-center gap-3">
                                <Phone size={20} className="flex-shrink-0 text-warning" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="d-flex align-items-center gap-3">
                                <Mail size={20} className="flex-shrink-0 text-warning" />
                                <span>support@smartbuildidea.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="pt-4 border-top border-light border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p className="mb-0 text-light opacity-50 small">
                        © {new Date().getFullYear()} SmartBuild Idea. All Rights Reserved.
                    </p>
                    <div className="d-flex gap-4 small">
                        <a href="#" className="text-light opacity-50 text-decoration-none custom-link-hover">Privacy Policy</a>
                        <a href="#" className="text-light opacity-50 text-decoration-none custom-link-hover">Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* Additional CSS specifically for Footer hovering, assuming standard classes otherwise */}
            <style>{`
                .custom-link-hover {
                    position: relative;
                }
                .custom-link-hover:hover {
                    color: var(--accent-color, #fbbf24) !important;
                    opacity: 1 !important;
                    transform: translateX(5px);
                }
                .custom-social-hover:hover {
                    color: var(--accent-color, #fbbf24) !important;
                    opacity: 1 !important;
                    transform: translateY(-3px);
                }
            `}</style>
        </footer>
    );
};
