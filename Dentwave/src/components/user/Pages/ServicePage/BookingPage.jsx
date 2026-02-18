import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Calendar, CreditCard, Check, AlertCircle } from 'lucide-react';

const BookingPage = ({ selectedServices, onRemoveService, onConfirm, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalCost = selectedServices.reduce((sum, service) => sum + parseFloat(service.cost || 0), 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + parseInt(service.duration || 0), 0);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate && selectedServices.length > 0) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setSelectedTime('');
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/doctors");
      const data = await res.json();
      const activeDoctors = data.filter(d => d.status === 'Active');
      setDoctors(activeDoctors);
      
      if (activeDoctors.length === 0) {
        setError('No active doctors available at the moment.');
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError('Failed to load doctors. Please try again.');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch("http://127.0.0.1:8000/api/available-slots", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: parseInt(selectedDoctor),
          date: selectedDate,
          service_ids: selectedServices.map(s => parseInt(s.id))
        })
      });

      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.available_slots);
        
        if (data.available_slots.length === 0) {
          setError(`No available slots for ${data.day}. Total appointment time needed: ${data.total_duration + 5} minutes (including 5-min buffer).`);
        }
      } else {
        setError(data.message || 'Failed to fetch available slots');
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
      setError('Failed to load time slots. Please try again.');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const getDayOfWeek = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dayOfWeek = getDayOfWeek(dateString);
    return `${dayOfWeek}, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  };

  const validateStep2 = () => {
    if (!selectedDoctor) {
      setError('Please select a doctor');
      return false;
    }
    if (!selectedDate) {
      setError('Please select a date');
      return false;
    }
    if (!selectedTime) {
      setError('Please select a time slot');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    setError('');
    
    if (step === 1) {
      if (selectedServices.length === 0) {
        setError('Please select at least one service');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  
const handleConfirmAppointment = async () => {
  setError('');

  if (!validateStep3()) return;

  setLoading(true);

  try {
    const userId = localStorage.getItem('user_id') || 1;

    const payload = {
      user_id: parseInt(userId),
      doctor_id: parseInt(selectedDoctor),
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      total_cost: parseFloat(totalCost.toFixed(2)),
      total_duration: parseInt(totalDuration),
      payment_method: paymentMethod,
      service_ids: selectedServices.map(s => parseInt(s.id)),
    };

    const response = await fetch("http://127.0.0.1:8000/api/appointments", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
   
console.log("hellp")

    const data = await response.json();
    console.log("Full response:", data);
console.log("Appointment ID:", data.appointment_id);


    if (!response.ok) throw new Error(data.message || 'Failed to create appointment');

    // Redirect to eSewa if selected
if (paymentMethod === 'esewa') {
    if (!data.appointment || !data.appointment.id) {
        alert("Appointment ID missing");
        return;
    }

    // Redirect to backend route for payment
    window.location.href = `http://127.0.0.1:8000/payment/${data.appointment.id}`;
    return;
}


    alert(' Appointment confirmed successfully!');
    onConfirm();

  } catch (err) {
    console.error(" Error creating appointment:", err);
    setError(err.message || 'Failed to create appointment');
    alert(" Failed to create appointment: " + err.message);
  } finally {
    setLoading(false);
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

            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                <AlertCircle size={20} className="me-2" />
                <div>{error}</div>
              </div>
            )}

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

                {selectedServices.length === 0 ? (
                  <div className="alert alert-warning">
                    No services selected. Please go back and select services.
                  </div>
                ) : (
                  <div className="mb-4">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="p-3 mb-3 bg-light rounded">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-fill">
                            <h5 className="fw-semibold mb-2">{service.name}</h5>
                            <div className="d-flex gap-4 small text-muted">
                              <span className="d-flex align-items-center gap-1">
                                <Clock size={16} />
                                {service.duration} min
                              </span>
                              <span className="d-flex align-items-center gap-1">
                                <DollarSign size={16} />
                                ${service.cost}
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
                )}

                <div className="border-top pt-4">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-semibold">Total Estimated Cost:</span>
                    <span className="text-primary fw-bold">$ {totalCost.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold">Total Estimated Duration:</span>
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={18} />
                      {totalDuration} min (+5 min buffer)
                    </span>
                  </div>
                </div>

                <button 
                  onClick={onBack}
                  className="btn btn-link text-primary text-decoration-none p-0 mt-4"
                >
                  Add more Services
                </button>
              </div>
            )}

            {/* Step 2: Doctor, Date & Time */}
            {step === 2 && (
              <div>
                <h2 className="h4 fw-bold mb-4">Select Doctor, Date & Time</h2>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Select Doctor *</label>
                  <select 
                    value={selectedDoctor}
                    onChange={(e) => {
                      setSelectedDoctor(e.target.value);
                      setSelectedTime('');
                      setError('');
                    }}
                    className="form-select form-select-lg"
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <Calendar size={18} className="me-2" />
                    Select Date *
                  </label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime('');
                      setError('');
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-control form-control-lg"
                    required
                  />
                  {selectedDate && (
                    <small className="text-muted mt-1 d-block">
                      📅 {formatDate(selectedDate)}
                    </small>
                  )}
                </div>

                {loading && (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading time slots...</span>
                    </div>
                    <p className="text-muted small mt-2">Finding available time slots...</p>
                  </div>
                )}

                {!loading && selectedDoctor && selectedDate && availableSlots.length > 0 && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <Clock size={18} className="me-2" />
                      Available Time Slots *
                    </label>
                    <p className="small text-muted mb-3">
                      ✨ Smart slots calculated based on doctor availability and existing appointments
                    </p>
                    <div className="row g-3">
                      {availableSlots.map((slot, index) => (
                        <div key={index} className="col-md-6">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTime(slot.start_time);
                              setError('');
                            }}
                            className={`btn w-100 ${
                              selectedTime === slot.start_time 
                                ? 'btn-primary' 
                                : 'btn-outline-secondary'
                            }`}
                            style={{ padding: '12px' }}
                          >
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <Clock size={16} />
                              <span>{slot.start_time} - {slot.end_time}</span>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && selectedDoctor && selectedDate && availableSlots.length === 0 && (
                  <div className="alert alert-warning d-flex align-items-start">
                    <AlertCircle size={20} className="me-2 mt-1" />
                    <div>
                      <strong>No available time slots</strong>
                      <p className="mb-0 small">
                        Please try a different date or another doctor.
                      </p>
                    </div>
                  </div>
                )}

                {!selectedDoctor && (
                  <div className="alert alert-info">
                    <AlertCircle size={18} className="me-2" />
                    Please select a doctor and date to see available time slots.
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Payment */}
           {step === 3 && (
  <div>
    <h2 className="h4 fw-bold mb-4">Payment Method</h2>

    <div className="mb-4">
      {/* eSewa Option */}
      <div 
        onClick={() => {
          setPaymentMethod('esewa');
          setError('');
        }}
        className={`p-4 mb-3 border rounded ${paymentMethod === 'esewa' ? 'border-primary bg-light' : ''}`}
        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
      >
        <div className="d-flex align-items-center gap-3">
          <img src="esewa.png" alt="eSewa" style={{ height: 24 }} />
          <div>
            <div className="fw-semibold">eSewa</div>
            <div className="small text-muted">Pay securely using eSewa</div>
          </div>
          {paymentMethod === 'esewa' && <Check size={20} className="text-primary ms-auto" />}
        </div>
      </div>

      {/* Khalti Option (UI Only for Now) */}
      <div 
        onClick={() => {
          setPaymentMethod('khalti');
          setError('');
        }}
        className={`p-4 mb-3 border rounded ${paymentMethod === 'khalti' ? 'border-primary bg-light' : ''}`}
        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
      >
        <div className="d-flex align-items-center gap-3">
          <img src="khalti.png" alt="Khalti" style={{ height: 24 }} />
          <div>
            <div className="fw-semibold">Khalti</div>
            <div className="small text-muted">Pay using Khalti (coming soon)</div>
          </div>
          {paymentMethod === 'khalti' && <Check size={20} className="text-primary ms-auto" />}
        </div>
      </div>
    </div>

    {/* Booking Summary */}
    <div className="bg-light p-4 rounded border">
      <h5 className="fw-semibold mb-3">📋 Booking Summary</h5>
      <div className="small">
        <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
          <span className="text-muted">Services:</span>
          <span className="fw-semibold">{selectedServices.length} service(s)</span>
        </div>
        <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
          <span className="text-muted">Doctor:</span>
          <span className="fw-semibold">
            {doctors.find(d => d.id == selectedDoctor)?.name || 'Not selected'}
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
          <span className="text-muted">Date:</span>
          <span className="fw-semibold">{formatDate(selectedDate)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
          <span className="text-muted">Time:</span>
          <span className="fw-semibold">
            {selectedTime ? `${selectedTime} (${totalDuration} min)` : 'Not selected'}
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
          <span className="text-muted">Payment:</span>
          <span className="fw-semibold text-capitalize">{paymentMethod || 'Not selected'}</span>
        </div>
        <div className="d-flex justify-content-between pt-2">
          <span className="fw-bold fs-5">Total Cost:</span>
          <span className="text-primary fw-bold fs-4">$ {totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>

    {/* Pay Button */}
   
  </div>
)}


            {/* Navigation Buttons */}
            <div className="d-flex gap-3 mt-5">
              {step > 1 && (
                <button 
                  onClick={() => {
                    setStep(step - 1);
                    setError('');
                  }}
                  className="btn btn-secondary flex-fill py-3"
                  disabled={loading}
                >
                  ← Back
                </button>
              )}
              <button 
                onClick={step === 3 ? handleConfirmAppointment : handleContinue}
                disabled={loading || (step === 1 && selectedServices.length === 0)}
                className="btn btn-primary flex-fill py-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : (
                  step === 3 ? '✓ Confirm Appointment' : 'Continue →'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;