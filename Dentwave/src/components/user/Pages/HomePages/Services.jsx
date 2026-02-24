import React, { useEffect, useState } from "react";
import axios from "axios";

function ServicesSection() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  return (
    <div className="container services-section">
      <h2 className="section-title">Our Services</h2>

      <div className="row service-cards">
        {services.slice(0, 4).map((service) => (
          <div
            key={service.id}
            className="col-lg-3 col-md-6 col-sm-6 mb-4"
          >
            <div className="service-card">

              {/* Service Image */}
              {service.image && (
                <img
                  src={`http://127.0.0.1:8000/storage/${service.image}`}
                  alt={service.name}
                  className="img-fluid mb-3"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}

              <h3 className="service-title">{service.name}</h3>

              <p className="service-description">
                {service.description?.substring(0, 100)}...
              </p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesSection;
