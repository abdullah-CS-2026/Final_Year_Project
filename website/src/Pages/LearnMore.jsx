import React from "react";

export const LearnMore = () => {
  return (
    <div className="container my-5">

      {/* Header */}
      <div className="bg-secondary text-white text-center p-5 rounded-4 mb-5">
        <h1 className="display-5 fw-bold">Learn More About Our Platform</h1>
        <p className="fs-5">
          Your ultimate solution for connecting contractors and customers.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-5 text-center">
        <h2 className="text-primary mb-4">Our Mission</h2>
        <p className="mx-auto fs-5" style={{ maxWidth: "800px" }}>
          Our mission is to revolutionize the construction and home improvement
          industry by providing a seamless, transparent, and efficient platform
          that connects skilled contractors with clients seeking quality work.
        </p>
      </section>

      {/* Features */}
      <section className="mb-5">
        <h2 className="text-primary text-center mb-4">Key Features</h2>
        <div className="row g-4">
          {[
            ["AI Estimations", "Accurate AI-based cost estimation."],
            ["2D Map Prediction", "Visualize layouts and material planning."],
            ["Secure Chats", "Encrypted in-app messaging."],
            ["Contractor Rating", "Choose based on real feedback."],
            ["Real-Time Tracking", "Track project progress live."],
            ["Blueprint Uploads", "Upload designs and documents easily."]
          ].map(([title, desc], index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title text-primary">{title}</h5>
                  <p className="card-text">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-5">
        <h2 className="text-primary text-center mb-4">Benefits</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="text-primary">For Customers</h4>
                <ul className="list-unstyled mt-3">
                  <li>✔ Verified contractors</li>
                  <li>✔ Transparent bidding</li>
                  <li>✔ Secure communication</li>
                  <li>✔ Quality assurance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="text-primary">For Contractors</h4>
                <ul className="list-unstyled mt-3">
                  <li>✔ More project leads</li>
                  <li>✔ Easy project management</li>
                  <li>✔ Reputation building</li>
                  <li>✔ Secure payments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-5">
        <h2 className="text-primary text-center mb-4">
          Frequently Asked Questions
        </h2>

        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" data-bs-toggle="collapse" data-bs-target="#faq1">
                How do I get started as a customer?
              </button>
            </h2>
            <div id="faq1" className="accordion-collapse collapse show">
              <div className="accordion-body">
                Sign up, post a project, get AI estimations, and receive contractor bids.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq2">
                How can contractors bid on projects?
              </button>
            </h2>
            <div id="faq2" className="accordion-collapse collapse">
              <div className="accordion-body">
                Contractors create profiles and submit bids on listed projects.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq3">
                Is my data secure?
              </button>
            </h2>
            <div id="faq3" className="accordion-collapse collapse">
              <div className="accordion-body">
                Yes. We use encryption and secure storage practices.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-4 rounded">
        <p className="mb-1">&copy; 2025 Our Platform</p>
        <p className="mb-0">Contact: support@ourplatform.com</p>
      </footer>

    </div>
  );
};
