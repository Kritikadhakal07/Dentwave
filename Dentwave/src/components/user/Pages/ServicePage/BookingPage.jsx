import React, { useState } from 'react';
import { Clock, DollarSign, Calendar, CreditCard, Check } from 'lucide-react';

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

export default BookingPage;