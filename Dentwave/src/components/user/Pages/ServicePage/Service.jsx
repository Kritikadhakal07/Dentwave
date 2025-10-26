import React, { useEffect, useState } from "react";
import axios from "axios";

const ServicesPage = ({ onLearnMore }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/services")
      .then((response) => setServices(response.data))
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "50px 0" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Our Dental Services</h1>
          <p className="text-muted" style={{ maxWidth: "700px", margin: "0 auto" }}>
            Explore our range of dental care services for a healthier, brighter smile.
          </p>
        </div>

        <div className="row g-4">
          {services.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={`http://127.0.0.1:8000/storage/${service.image}`}
                  alt={service.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-3">{service.name}</h5>
                  <p className="text-muted small mb-3">{service.description}</p>
                  <p className="text-primary fw-semibold mb-3">
                    {service.cost
                      ? `From $${service.cost}`
                      : "Consultation Required"}
                  </p>
                  <button
                    onClick={() => onLearnMore(service)}
                    className="btn btn-link text-primary text-decoration-none p-0 mt-auto"
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
