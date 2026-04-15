import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import bgImage from '../assets/Home_Page_Pics/orig.jpeg';
import howitworks from '../assets/Home_Page_Pics/How_it_works.JPG'

// feature images
import AIestimation from '../assets/Home_Page_Pics/Image_AI_Est.png'
import D_Map from '../assets/Home_Page_Pics/Image_2D_Map.png'
import SecureChat from '../assets/Home_Page_Pics/Secure_Chat.png'
import ContactRating from '../assets/Home_Page_Pics/Contractor_Rating.png'
import RealTime from '../assets/Home_Page_Pics/Real_Time.png'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export const Home = () => {

    const navigate = useNavigate();

    const customer = localStorage.getItem("customer");
    const contractor = localStorage.getItem("contractor");

    const getRoute = (feature) => {

        if (customer) {
            switch (feature) {
                case "AI Estimations":
                    return "/customer/projects";
                case "2D Map Prediction":
                    return "#";
                case "Secure Chats with Clients":
                    return "/customer-chat-list";
                case "Contractor Rating":
                    return "/customer/accepted-proposals";
                case "Real-Time Project Tracking":
                    return "/customer-project-track";
                case "Blue-prints & Media Uploads":
                    return "/customer/projects";
                default:
                    return "/home";
            }
        }

        if (contractor) {
            switch (feature) {
                case "AI Estimations":
                    return "/All-pending-projects-list";
                case "2D Map Prediction":
                    return "#";
                case "Secure Chats with Clients":
                    return "/contractor-chat-list";
                case "Contractor Rating":
                    return "/contractor/sent-proposals";
                case "Real-Time Project Tracking":
                    return "/contractor-see-customers";
                case "Blue-prints & Media Uploads":
                    return "/All-pending-projects-list";
                default:
                    return "/home";
            }
        }

        return "/select-role";
    };

    return (
        <div style={{ backgroundColor: 'var(--light-bg)' }}>

            {/* Hero Section */}
            <section
                className="d-flex align-items-center position-relative"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.5)), url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    paddingTop: "80px"
                }}
            >
                <div className="container text-start position-relative z-1">
                    <div className="row">
                        <div className="col-lg-8 col-md-10">
                            <span className="badge bg-primary bg-opacity-25 text-primary rounded-pill px-3 py-2 mb-4 d-inline-block fw-semibold">
                                The Future of Construction
                            </span>

                            <h1 className="fw-bolder text-white mb-4"
                                style={{
                                    fontSize: "clamp(2.5rem, 6vw, 85px)",
                                    lineHeight: "1.1"
                                }}
                            >
                                Estimate Your <span className="text-gradient">Dream Home</span> with AI
                            </h1>

                            <p className="text-light fs-5 mb-5 opacity-75" style={{ maxWidth: '600px' }}>
                                Connect with verified contractors, get accurate AI-driven material estimates, and build your future seamlessly.
                            </p>

                            <button
                                className="btn btn-primary px-5 py-3 fs-5 rounded-pill"
                                onClick={() => navigate('/select-role')}
                            >
                                Get Started Today
                            </button>

                        </div>
                    </div>
                </div>
            </section>


            {/* How it Works */}
            <section className="container py-5 my-5">

                <div className="text-center mb-5">
                    <h2 className="fw-bolder" style={{ fontSize: 'clamp(2.5rem, 5vw, 50px)' }}>
                        <span className="text-primary">How</span> it Works
                    </h2>
                    <p className="text-muted fs-5 mt-3">
                        Four simple steps to start your construction journey
                    </p>
                </div>

                <div className="row align-items-center g-5 mt-2">

                    <div className="col-lg-6 order-2 order-lg-1">

                        <div className="p-4 p-md-5 rounded-4 shadow">

                            <ul className="list-unstyled mb-0">

                                {[
                                    { title: "Input Requirements", desc: "Detail your project needs and preferences" },
                                    { title: "Get Estimations", desc: "Our AI calculates precise material and cost estimates" },
                                    { title: "Receive Bids", desc: "Verified contractors submit competitive proposals" },
                                    { title: "Finalize Contractor", desc: "Choose the best fit and track project progress" },
                                ].map((item, index) => (

                                    <li key={index} className="d-flex align-items-start mb-4 pb-3 border-bottom">

                                        <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-4 text-primary d-flex align-items-center justify-content-center"
                                            style={{ width: '60px', height: '60px' }}>
                                            <FaCircleCheck size={28} />
                                        </div>

                                        <div>
                                            <h4 className="fw-bold mb-1">{item.title}</h4>
                                            <p className="text-muted mb-0">{item.desc}</p>
                                        </div>

                                    </li>

                                ))}

                            </ul>

                        </div>

                    </div>

                    <div className="col-lg-6 order-1 order-lg-2">

                        <img
                            src={howitworks}
                            alt="How it Works"
                            className="img-fluid rounded-5 shadow-lg"
                            style={{ height: "600px", objectFit: "cover", width: "100%" }}
                        />

                    </div>

                </div>

            </section>


            {/* Features */}

            <section className="py-5" style={{ backgroundColor: '#ffffff' }}>

                <div className="container my-5">

                    <div className="text-center mb-5 pb-3">
                        <h2 className="fw-bolder" style={{ fontSize: 'clamp(2.5rem, 5vw, 50px)' }}>
                            Platform <span className="text-primary">Features</span>
                        </h2>
                    </div>

                    <div className="row g-4 justify-content-center">

                        {[
                            { title: "AI Estimations", img: AIestimation },
                            { title: "2D Map Prediction", img: D_Map },
                            { title: "Secure Chats with Clients", img: SecureChat },
                            { title: "Contractor Rating", img: ContactRating },
                            { title: "Real-Time Project Tracking", img: RealTime },
                            { title: "Blue-prints & Media Uploads", img: "https://img.icons8.com/color/96/upload--v1.png" },
                        ].map((feature, i) => (

                            <div key={i} className="col-lg-4 col-md-6 col-12">

                                <div
                                    className="card shadow border-0 h-100 rounded-4"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(getRoute(feature.title))}
                                >

                                    <div className="card-body text-center p-4">

                                        <img
                                            src={feature.img}
                                            alt={feature.title}
                                            className="img-fluid mb-4"
                                            style={{ height: "90px", objectFit: "contain" }}
                                        />

                                        <h4 className="fw-bold">{feature.title}</h4>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* Why Choose Us */}

            <section className="container py-5 my-5">

                <div className="row align-items-center justify-content-between g-5">

                    <div className="col-lg-5">

                        <img
                            src={howitworks}
                            alt="Why Choose Us"
                            className="img-fluid rounded-5 shadow-lg"
                            style={{ height: "600px", objectFit: "cover", width: "100%" }}
                        />

                    </div>

                    <div className="col-lg-6">

                        <h2 className="fw-bolder mb-4"
                            style={{ fontSize: 'clamp(2.5rem, 5vw, 50px)' }}>
                            Why <span className="text-primary">Choose Us</span>
                        </h2>

                        <p className="fs-5 text-muted mb-5">
                            We combine advanced machine learning with a curated marketplace to bring unprecedented transparency to construction.
                        </p>

                        <div className="d-flex flex-column gap-4">

                            {[
                                "AI-Powered Results",
                                "Verified Contractors",
                                "Transparent Bidding System",
                                "Fast & Secure Communication"
                            ].map((item, idx) => (

                                <div key={idx} className="d-flex align-items-center p-4 rounded-4 shadow-sm">

                                    <div className="fs-3 text-primary me-4">
                                        <FaCircleCheck />
                                    </div>

                                    <h4 className="mb-0 fw-bold">{item}</h4>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
};