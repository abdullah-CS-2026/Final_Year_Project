import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import image1 from '../assets/Services_Page_Pics/Image1.JPG';
import bg_Funfact from '../assets/Services_Page_Pics/bg-funfact.png';
import funfact1 from '../assets/Services_Page_Pics/Funfact1.png';
import funfact2 from '../assets/Services_Page_Pics/Funfact2.png';
import funfact3 from '../assets/Services_Page_Pics/Funfact3.png';
import AIimage from '../assets/Services_Page_Pics/AI-Image.JPG';

export const Services = () => {
  return (
    <div id="services" style={{ backgroundColor: 'var(--light-bg)', minHeight: '100vh', paddingTop: '60px' }}>

      {/* Header Banner */}

      <section
        className="text-white py-5 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'
        }}
      >
        <div className="container">

          <h1 className="display-4 fw-bolder">
            Our <span style={{ color: 'var(--accent-color)' }}>Services</span>
          </h1>

          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
            We provide intelligent tools that simplify house construction planning
            and bring clarity to your building projects.
          </p>

        </div>
      </section>


      {/* Intro Section */}

      <section className="container py-5 my-4">

        <div className="row align-items-center g-5">

          <div className="col-lg-6 col-md-12">

            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3 fw-semibold">
              What We Do
            </span>

            <h2 className="fw-bolder display-5 mb-4">
              Intelligent & <span className="text-gradient">Efficient</span> Tools
            </h2>

            <p className="fs-5 text-muted" style={{ textAlign: "justify", lineHeight: "1.8" }}>
              We provide intelligent, efficient, and user-friendly tools to
              simplify your house construction planning. Our services are
              designed to save time, reduce costs, and bring clarity to your
              building projects – from initial design to final estimation.
            </p>

            <button
              className="btn rounded-pill px-4 py-2 mt-3"
              style={{ backgroundColor: "#3B6D8A", color: "white" }}
            >
              Explore Now
            </button>

          </div>


          <div className="col-lg-6 col-md-12">

            <div className="position-relative">

              <div
                className="position-absolute w-100 h-100 rounded-5"
                style={{
                  background: 'var(--secondary-color)',
                  opacity: 0.1,
                  transform: 'translate(20px,-20px)'
                }}
              ></div>

              <img
                src={image1}
                alt="construction"
                className="img-fluid rounded-5 shadow-lg position-relative z-1 w-100"
                style={{ maxHeight: "450px", objectFit: "cover" }}
              />

            </div>

          </div>

        </div>

      </section>


      {/* Services Grid */}

      <section className="container py-5 mb-5">

        <div className="text-center mb-5">

          <h2 className="fw-bolder display-5">
            Our <span className="text-gradient">Capabilities</span>
          </h2>

        </div>

        <div className="row g-4">

          {[
            {
              title: "Smart Cost Estimation",
              desc: "Get accurate construction cost estimates instantly by entering basic project details such as plot size, number of rooms, and building style. Our AI-driven system calculates material requirements, labor costs, and total budget with precision.",
            },
            {
              title: "Material Requirement Planning",
              desc: "Receive a detailed breakdown of construction materials-bricks, cement, steel, wood, sand, and more–based on your design specifications. This helps you avoid wastage and ensures optimal resource allocation.",
            },
            {
              title: "Interactive Room & Floor Plan Design",
              desc: "Visualize your dream home with our easy-to-use floor plan designer. Create custom layouts, adjust room sizes, and match your design preferences before finalizing construction.",
            },
            {
              title: "Contractor & Builder Matching",
              desc: "Connect with verified contractors and builders in your area. Browse reviews, ratings, and past projects to select the right professional for your construction needs.",
            },
            {
              title: "Secure Chat & Collaboration",
              desc: "Communicate directly with contractors, architects, and suppliers through our built-in secure messaging system. Share files, drawings, and updates throughout your project.",
            },
            {
              title: "Budget Tracking & Management",
              desc: "Track your expenses in real-time and compare against your planned budget. Stay within limits and avoid unexpected overruns with smart budget alerts.",
            },
          ].map((service, index) => (

            <div key={index} className="col-lg-4 col-md-6 col-12">

              <div className="card border-0 rounded-4 shadow-sm h-100 p-3">

                <div className="card-body p-4 d-flex flex-column">

                  <h4 className="fw-bold mb-3 text-center" style={{ color: "#3B6D8A" }}>
                    {service.title}
                  </h4>

                  <p
                    className="text-muted"
                    style={{ textAlign: "justify", lineHeight: "1.7" }}
                  >
                    {service.desc}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Fun Facts */}

      <section
        className="text-light py-5"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.85)), url(${bg_Funfact})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        <div className="container text-center">

          <h5 className="badge bg-light text-dark px-4 py-2 mb-5">
            Our Funfacts
          </h5>

          <div className="row g-4 justify-content-center">

            <div className="col-lg-3 col-md-4 col-sm-6 text-center">
              <img src={funfact1} alt="Satisfied Clients" style={{ width: "80px" }} />
              <h2 className="fw-bold text-white mt-3">15+</h2>
              <p>Satisfied Clients</p>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6 text-center">
              <img src={funfact2} alt="Awards Achieved" style={{ width: "80px" }} />
              <h2 className="fw-bold text-white mt-3">10+</h2>
              <p>Awards Achieved</p>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6 text-center">
              <img src={funfact3} alt="Team Members" style={{ width: "80px" }} />
              <h2 className="fw-bold text-white mt-3">3</h2>
              <p>Team Members</p>
            </div>

          </div>

        </div>

      </section>


      {/* AI Section */}

      <section className="container py-5 my-5">

        <div className="row align-items-center g-5">

          <div className="col-lg-6 text-center">

            <div className="position-relative">

              <div
                className="position-absolute w-100 h-100 rounded-5"
                style={{
                  background: 'var(--primary-color)',
                  opacity: 0.1,
                  transform: 'translate(-20px,20px)'
                }}
              ></div>

              <img
                src={AIimage}
                alt="AI Design"
                className="img-fluid rounded-5 shadow-lg position-relative z-1 w-100"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />

            </div>

          </div>

          <div className="col-lg-6">

            <h2 className="fw-bolder display-5 mb-4" style={{ color: "#3B6D8A" }}>
              AI-Based <span className="text-gradient">Design Suggestions</span>
            </h2>

            <p
              className="fs-5 text-muted"
              style={{ textAlign: "justify", lineHeight: "1.8" }}
            >
              Get smart recommendations for room layouts, material choices, and
              cost-saving alternatives based on your budget and plot size.
            </p>

            <button
              className="btn rounded-pill mt-3"
              style={{ backgroundColor: "#3B6D8A", color: "white" }}
            >
              Explore Now
            </button>

          </div>

        </div>

      </section>

    </div>
  );
};