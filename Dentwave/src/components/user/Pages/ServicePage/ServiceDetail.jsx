
import { Clock, DollarSign } from 'lucide-react';

const ServiceDetailsPage = ({ service, onBack, onAddToAppointment }) => {
  if (!service?.details) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '50px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <button onClick={onBack} className="btn btn-link text-primary text-decoration-none p-0 mb-4">
            ← Back to Services
          </button>
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h1 className="display-5 fw-bold mb-4">{service?.title}</h1>
              <p className="text-muted">Details coming soon for this service.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '50px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <button onClick={onBack} className="btn btn-link text-primary text-decoration-none p-0 mb-4">
          ← Back to Services
        </button>

        <div className="card shadow-sm mb-4">
          <img 
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=400&fit=crop" 
            alt="Dental Cleaning"
            className="card-img-top"
            style={{ height: '300px', objectFit: 'cover' }}
          />
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h1 className="display-5 fw-bold mb-4">Professional Dental Cleaning</h1>

            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
              Maintain optimal oral health with our comprehensive dental cleaning. Our experienced 
              hygienists use state-of-the-art equipment to remove plaque, tartar and surface stains, leaving 
              your teeth feeling fresh and looking brighter. Regular cleanings are essential for preventing 
              cavities, gum disease, and bad breath.
            </p>

            <div className="d-flex flex-wrap gap-4 mb-4 pb-4 border-bottom">
              <div className="d-flex align-items-center gap-2 text-muted">
                <Clock size={20} className="text-primary" />
                <span>Duration: {service.details.duration}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <DollarSign size={20} className="text-primary" />
                <span>Estimated Cost: {service.details.cost}</span>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="h4 fw-bold mb-3">Key Benefits</h2>
              <ul className="list-unstyled">
                {service.details.benefits.map((benefit, index) => (
                  <li key={index} className="d-flex align-items-start gap-2 mb-2 text-muted">
                    <span className="text-primary">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h2 className="h4 fw-bold mb-3">Procedure Overview</h2>
              <div>
                {service.details.procedure.map((step, index) => (
                  <p key={index} className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    {step.split('**').map((text, i) => 
                      i % 2 === 1 ? <strong key={i}>{text}</strong> : text
                    )}
                  </p>
                ))}
              </div>
            </div>

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