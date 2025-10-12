import React, { useState } from 'react';
import { Clock, DollarSign, Calendar, CreditCard, Check } from 'lucide-react';

// Services Data
const servicesData = [
  {
    id: 1,
    title: 'Routine Check-ups',
    description: 'Regular examinations and professional cleanings to maintain optimal oral health and prevent dental issues.',
    price: 120,
    duration: 60,
    icon: '🦷',
    details: {
      duration: '45-60 minutes',
      cost: '$120 - $180',
      benefits: [
        'Removes plaque and tartar build-up',
        'Prevents cavities and gum disease',
        'Freshens breath',
        'Brightens smile by removing surface stains',
        'Promotes overall oral health'
      ],
      procedure: [
        '**Oral Examination:** The hygienist will first examine your mouth for any signs of gum disease or other oral health issues.',
        '**Plaque and Tartar Removal:** Using specialized tools, plaque and hardened tartar (calculus) will be carefully removed from your tooth surfaces, both above and below the gum line.',
        '**Tooth Polishing:** After cleaning, your teeth will be polished with a high-powered electric brush and gritty toothpaste to remove any remaining surface stains and make them smooth.',
        '**Flossing:** A thorough flossing will be performed to ensure all areas between your teeth are clean.',
        '**Fluoride Treatment (Optional):** A fluoride treatment may be applied to help protect your teeth against cavities.'
      ]
    }
  },
  {
    id: 2,
    title: 'Cosmetic Fillings',
    description: 'Tooth-colored composite fillings to restore decayed teeth, blending seamlessly with your natural smile.',
    price: 180,
    duration: 45,
    icon: '⚙️'
  },
  {
    id: 3,
    title: 'Teeth Whitening',
    description: 'Professional teeth whitening treatments to brighten your smile and remove years of stains.',
    price: 350,
    duration: 90,
    icon: '✨'
  },
  {
    id: 4,
    title: 'Dental Implants',
    description: 'Permanent solutions for missing teeth using advanced implant technology, restoring function and aesthetics.',
    price: 0,
    duration: 120,
    icon: '🔩',
    priceText: 'Consultation Required'
  },
  {
    id: 5,
    title: 'Orthodontics',
    description: 'Braces and aligners to correct misaligned teeth and jaws, improving both appearance and oral health.',
    price: 0,
    duration: 60,
    icon: '😁',
    priceText: 'Consultation Required'
  },
  {
    id: 6,
    title: 'Root Canal Therapy',
    description: 'Specialized treatment to save a tooth that is badly infected or damaged, relieving pain and preserving natural teeth.',
    price: 700,
    duration: 90,
    icon: '💉'
  },
  {
    id: 7,
    title: 'Dental Veneers',
    description: 'Custom-made, thin shells designed to cover the front surface of teeth to improve appearance.',
    price: 950,
    duration: 120,
    icon: '🦷'
  },
  {
    id: 8,
    title: 'Gum Treatment',
    description: 'Specialized care for gum diseases, including deep cleanings and other therapeutic procedures.',
    price: 250,
    duration: 75,
    icon: '💗'
  },
  {
    id: 9,
    title: 'Emergency Dental Care',
    description: 'Prompt treatment for urgent dental issues such as severe toothache, broken tooth, or dental injuries.',
    price: 0,
    duration: 60,
    icon: '🚨',
    priceText: 'Contact for Details'
  }
];

// Services Page Component
const ServicesPage = ({ onLearnMore }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '50px 0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Our Dental Services</h1>
          <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
            At Your Dental, we are dedicated to providing comprehensive dental care 
            tailored to your needs. Explore our range of services designed to ensure your oral 
            health and beautiful smile.
          </p>
        </div>

        <div className="row g-4">
          {servicesData.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm" style={{ transition: 'all 0.3s' }}>
                <div 
                  className="card-img-top d-flex align-items-center justify-content-center" 
                  style={{ 
                    height: '200px', 
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    fontSize: '4rem'
                  }}
                >
                  {service.icon}
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-3">{service.title}</h5>
                  <p className="card-text text-muted small mb-3" style={{ minHeight: '60px' }}>
                    {service.description}
                  </p>
                  <p className="text-primary fw-semibold mb-3">
                    {service.priceText || `From $${service.price}`}
                  </p>
                  <button 
                    onClick={() => onLearnMore(service)}
                    className="btn btn-link text-primary text-decoration-none p-0 mt-auto"
                    style={{ textAlign: 'left' }}
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

// Service Details Page Component
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

// Booking Page Component
const BookingPage = ({ selectedServices, onRemoveService, onConfirm, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const totalCost = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleConfirmAppointment = () => {
    if (step === 3) {
      alert('Appointment confirmed successfully!');
      onConfirm();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '50px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <button onClick={onBack} className="btn btn-link text-primary text-decoration-none p-0 mb-4">
          ← Back to Services
        </button>

        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h1 className="display-5 fw-bold text-center mb-5">Book Your Appointment</h1>

            {/* Progress Steps */}
            <div className="d-flex align-items-center justify-content-between mb-5">
              <div className="d-flex align-items-center flex-fill">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: step >= 1 ? '#0d6efd' : '#dee2e6',
                    color: step >= 1 ? 'white' : '#6c757d'
                  }}
                >
                  {step > 1 ? <Check size={20} /> : '1'}
                </div>
                <div style={{ flex: 1, height: '4px', margin: '0 8px', backgroundColor: '#dee2e6' }}>
                  <div style={{ height: '100%', width: step > 1 ? '100%' : '0%', backgroundColor: '#0d6efd', transition: 'width 0.3s' }}></div>
                </div>
              </div>
              <div className="d-flex align-items-center flex-fill">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: step >= 2 ? '#0d6efd' : '#dee2e6',
                    color: step >= 2 ? 'white' : '#6c757d'
                  }}
                >
                  {step > 2 ? <Check size={20} /> : '2'}
                </div>
                <div style={{ flex: 1, height: '4px', margin: '0 8px', backgroundColor: '#dee2e6' }}>
                  <div style={{ height: '100%', width: step > 2 ? '100%' : '0%', backgroundColor: '#0d6efd', transition: 'width 0.3s' }}></div>
                </div>
              </div>
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: step >= 3 ? '#0d6efd' : '#dee2e6',
                  color: step >= 3 ? 'white' : '#6c757d'
                }}
              >
                3
              </div>
            </div>

            <div className="d-flex justify-content-center gap-5 mb-5 small">
              <span className={step === 1 ? 'text-primary fw-semibold' : 'text-muted'}>Services</span>
              <span className={step === 2 ? 'text-primary fw-semibold' : 'text-muted'}>Doctor & Time</span>
              <span className={step === 3 ? 'text-primary fw-semibold' : 'text-muted'}>Payment</span>
            </div>

            {/* Step 1: Services */}
            {step === 1 && (
              <div>
                <h2 className="h4 fw-bold mb-3">Your Selected Services</h2>
                <p className="text-muted small mb-4">Review the services you've chosen before proceeding.</p>

                <div className="mb-4">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="p-3 mb-3 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-fill">
                          <h5 className="fw-semibold mb-2">{service.title}</h5>
                          <div className="d-flex gap-4 small text-muted">
                            <span className="d-flex align-items-center gap-1">
                              <Clock size={16} />
                              {service.duration} min
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <DollarSign size={16} />
                              {service.price}.00
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onRemoveService(service.id)}
                          className="btn btn-link text-danger text-decoration-none small p-0"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-4">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-semibold">Total Estimated Cost:</span>
                    <span className="text-primary fw-bold">$ {totalCost}.00</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold">Total Estimated Duration:</span>
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={18} />
                      {totalDuration} minutes
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => onBack()}
                  className="btn btn-link text-primary text-decoration-none p-0 mt-4"
                >
                  Edit Services
                </button>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <div>
                <h2 className="h4 fw-bold mb-4">Select Date & Time</h2>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <Calendar size={18} className="me-2" />
                    Select Date
                  </label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-control form-control-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <Clock size={18} className="me-2" />
                    Select Time
                  </label>
                  <div className="row g-3">
                    {timeSlots.map((time) => (
                      <div key={time} className="col-4">
                        <button
                          onClick={() => setSelectedTime(time)}
                          className={`btn w-100 ${
                            selectedTime === time 
                              ? 'btn-primary' 
                              : 'btn-outline-secondary'
                          }`}
                        >
                          {time}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 className="h4 fw-bold mb-4">Payment Method</h2>

                <div className="mb-4">
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 mb-3 border rounded ${paymentMethod === 'card' ? 'border-primary bg-light' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <CreditCard size={24} className="text-primary" />
                      <div>
                        <div className="fw-semibold">Credit/Debit Card</div>
                        <div className="small text-muted">Pay securely with your card</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 mb-3 border rounded ${paymentMethod === 'cash' ? 'border-primary bg-light' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <DollarSign size={24} className="text-success" />
                      <div>
                        <div className="fw-semibold">Pay at Clinic</div>
                        <div className="small text-muted">Pay when you arrive</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('insurance')}
                    className={`p-4 mb-3 border rounded ${paymentMethod === 'insurance' ? 'border-primary bg-light' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Check size={24} className="text-info" />
                      <div>
                        <div className="fw-semibold">Insurance</div>
                        <div className="small text-muted">Use your insurance coverage</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-light p-4 rounded">
                  <h5 className="fw-semibold mb-3">Booking Summary</h5>
                  <div className="small">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Date:</span>
                      <span className="fw-semibold">{selectedDate || 'Not selected'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Time:</span>
                      <span className="fw-semibold">{selectedTime || 'Not selected'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Duration:</span>
                      <span className="fw-semibold">{totalDuration} minutes</span>
                    </div>
                    <div className="d-flex justify-content-between pt-2 border-top">
                      <span className="fw-bold">Total Cost:</span>
                      <span className="text-primary fw-bold fs-5">$ {totalCost}.00</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="d-flex gap-3 mt-5">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="btn btn-secondary flex-fill py-3"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleConfirmAppointment}
                disabled={
                  (step === 2 && (!selectedDate || !selectedTime)) ||
                  (step === 3 && !paymentMethod)
                }
                className="btn btn-primary flex-fill py-3"
              >
                {step === 3 ? 'Confirm Appointment' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const DentalServicesApp = () => {
  const [currentPage, setCurrentPage] = useState('services');
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentServices, setAppointmentServices] = useState([]);

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setCurrentPage('details');
  };

  const handleAddToAppointment = (service) => {
    if (!appointmentServices.find(s => s.id === service.id)) {
      setAppointmentServices([...appointmentServices, service]);
    }
    setCurrentPage('booking');
  };

  const handleRemoveService = (serviceId) => {
    setAppointmentServices(appointmentServices.filter(s => s.id !== serviceId));
    if (appointmentServices.length === 1) {
      setCurrentPage('services');
    }
  };

  const handleConfirmBooking = () => {
    setAppointmentServices([]);
    setCurrentPage('services');
  };

  const handleBackToServices = () => {
    setCurrentPage('services');
  };

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      
      {currentPage === 'services' && (
        <ServicesPage onLearnMore={handleLearnMore} />
      )}
      
      {currentPage === 'details' && (
        <ServiceDetailsPage 
          service={selectedService}
          onBack={handleBackToServices}
          onAddToAppointment={handleAddToAppointment}
        />
      )}
      
      {currentPage === 'booking' && (
        <BookingPage 
          selectedServices={appointmentServices}
          onRemoveService={handleRemoveService}
          onConfirm={handleConfirmBooking}
          onBack={handleBackToServices}
        />
      )}
    </>
  );
};

export default DentalServicesApp;