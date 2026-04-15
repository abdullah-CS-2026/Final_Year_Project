import "bootstrap/dist/css/bootstrap.min.css";
import about_us from '../assets/About_Page_Pics/Image_1.JPG';
import whoweare from '../assets/About_Page_Pics/Image_2.JPG';
import ourmission from '../assets/About_Page_Pics/Image_3.JPG';

export const AboutUs = () => {
  return (
    <div style={{ backgroundColor: 'var(--light-bg)', minHeight: '100vh', paddingTop: '60px' }}>

      {/* Header Banner */}
      <section
        className="text-white py-5 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bolder">
            About <span style={{ color: 'var(--accent-color)' }}>Us</span>
          </h1>
        </div>
      </section>

      <section className="container py-5 my-5">

        {/* About Us */}
        <div className="row align-items-center mb-5 pb-5 g-5">

          <div className="col-lg-6 col-md-12">
            <div className="pe-lg-4">

              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3 fw-semibold">
                About Us
              </span>

              <h2 className="fw-bolder display-5 mb-4">
                Building Tomorrow <span className="text-gradient">Today</span>
              </h2>

              <p className="fs-5 text-muted" style={{ textAlign: "justify", lineHeight: "1.8" }}>
                We are passionate innovators dedicated to developing solutions
                that transform the way industries operate. Our mission is to
                bring lasting impact to construction by blending technology,
                expertise, and creativity.
              </p>

              <p className="fs-5 text-muted" style={{ textAlign: "justify", lineHeight: "1.8" }}>
                By collaborating with clients and industry leaders, we deliver
                groundbreaking projects that redefine standards and open new
                opportunities. With a focus on sustainability, efficiency, and
                innovation, we take pride in building solutions that make a difference.
              </p>

            </div>
          </div>

          <div className="col-lg-6 col-md-12">

            <div className="position-relative">

              <div
                className="position-absolute w-100 h-100 rounded-5"
                style={{
                  background: 'var(--secondary-color)',
                  opacity: 0.1,
                  transform: 'translate(20px,20px)'
                }}
              ></div>

              <img
                src={about_us}
                alt="About"
                className="img-fluid rounded-5 shadow-lg position-relative z-1 hover-card-lift w-100"
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />

            </div>

          </div>

        </div>

        {/* Who We Are */}

        <div className="row align-items-center mb-5 pb-5 g-5 flex-lg-row-reverse">

          <div className="col-lg-6 col-md-12">

            <div className="ps-lg-4">

              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 mb-3 fw-semibold">
                Who We Are
              </span>

              <h2 className="fw-bolder display-5 mb-4">
                Creative Thinkers <span className="text-gradient">& Doers</span>
              </h2>

              <p className="fs-5 text-muted" style={{ textAlign: "justify", lineHeight: "1.8" }}>
                We are a team of creative thinkers and professionals committed
                to delivering solutions that exceed expectations.
              </p>

              <p className="fs-5 text-muted" style={{ textAlign: "justify", lineHeight: "1.8" }}>
                Our dedication to excellence is rooted in passion for innovation
                and a belief that the best results come from creative and practical
                approaches to solving exceptional needs.
              </p>

            </div>

          </div>

          <div className="col-lg-6 col-md-12">

            <div className="position-relative">

              <div
                className="position-absolute w-100 h-100 rounded-5"
                style={{
                  background: 'var(--accent-color)',
                  opacity: 0.1,
                  transform: 'translate(-20px,20px)'
                }}
              ></div>

              <img
                src={whoweare}
                alt="Who We Are"
                className="img-fluid rounded-5 shadow-lg position-relative z-1 hover-card-lift w-100"
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />

            </div>

          </div>

        </div>


        {/* Mission */}

        <div className="row align-items-center mb-5 pb-5 g-5">

          <div className="col-lg-6 col-md-12">

            <div className="pe-lg-4">

              <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-2 mb-3 fw-semibold">
                Our Mission
              </span>

              <h2 className="fw-bolder display-5 mb-4">
                Simplifying <span className="text-gradient">Complexity</span>
              </h2>

              <p className="fs-5 text-muted">
                Our mission is to simplify complexity through technology-driven,
                impactful solutions.
              </p>

              <p className="fs-5 text-muted" style={{ textAlign: "justify", lineHeight: "1.8" }}>
                With precision, dedication, and innovation, we aim to provide
                integrated approaches that empower industries in a fast-changing
                world.
              </p>

            </div>

          </div>

          <div className="col-lg-6 col-md-12">

            <div className="position-relative">

              <div
                className="position-absolute w-100 h-100 rounded-5"
                style={{
                  background: 'var(--primary-color)',
                  opacity: 0.1,
                  transform: 'translate(20px,-20px)'
                }}
              ></div>

              <img
                src={ourmission}
                alt="Mission"
                className="img-fluid rounded-5 shadow-lg position-relative z-1 hover-card-lift w-100"
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />

            </div>

          </div>

        </div>


        {/* Vision */}

        <div className="text-center mt-5 pt-4">

          <div className="p-5 rounded-5 shadow-lg mx-auto" style={{ maxWidth: '900px', background: '#ffffff' }}>

            <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-2 mb-3 fw-semibold">
              Our Vision
            </span>

            <h2 className="fw-bolder display-5 mb-4">
              Designing the <span className="text-gradient">Future</span>
            </h2>

            <p className="fs-5 text-muted">
              We envision a future where technology bridges gaps, connects
              people, and paves doors to endless possibilities.
            </p>

            <p className="fs-5 text-muted">
              By blending creativity with technical expertise, we aim to revolutionize
              the construction industry. Our vision embraces a smarter way of living
              — streamlined, interconnected, and digitally transformed.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};