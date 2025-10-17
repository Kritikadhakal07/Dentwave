import { Clock, DollarSign } from "lucide-react";

const ServiceDetailsPage = ({ service, onBack, onAddToAppointment }) => {
  if (!service) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "50px 0" }}>
        <div className="container text-center">
          <p className="text-muted">No service selected.</p>
          <button onClick={onBack} className="btn btn-primary mt-3">
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "50px 0" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        <button
          onClick={onBack}
          className="btn btn-link text-primary text-decoration-none p-0 mb-4"
        >
          ← Back to Services
        </button>

        <div className="card shadow-sm mb-4">
          <img
            src={`http://127.0.0.1:8000/storage/${service.image}`}
            alt={service.name}
            className="card-img-top"
            style={{ height: "300px", objectFit: "cover" }}
          />
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h1 className="display-5 fw-bold mb-4">{service.name}</h1>

            <p className="text-muted mb-4" style={{ lineHeight: "1.8" }}>
              {service.description}
            </p>

            <div className="d-flex flex-wrap gap-4 mb-4 pb-4 border-bottom">
              <div className="d-flex align-items-center gap-2 text-muted">
                <Clock size={20} className="text-primary" />
                <span>Duration: {service.duration || "N/A"}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <DollarSign size={20} className="text-primary" />
                <span>
                  Estimated Cost:{" "}
                  {service.cost ? `$${service.cost}` : "Consultation"}
                </span>
              </div>
            </div>

            {/* Key Benefits */}
            {service.key_benefits && (
              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3">Key Benefits</h2>
                <ul className="list-unstyled">
                  {service.key_benefits.split(",").map((benefit, index) => (
                    <li key={index} className="text-muted mb-2">
                      • {benefit.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Procedure Overview */}
            {service.procedure_overview && (
              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3">Procedure Overview</h2>
                {service.procedure_overview.split(".").map((step, index) => (
                  <p key={index} className="text-muted mb-3">
                    {step.trim()}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => onAddToAppointment(service)}
              className="btn btn-primary w-100 py-3"
            >
              + Add to Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
