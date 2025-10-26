import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, DollarSign, Calendar, CreditCard, Check, AlertCircle } from 'lucide-react';

const BookingPage = ({ selectedServices, onRemoveService, onConfirm, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalCost = selectedServices.reduce((sum, service) => sum + parseFloat(service.cost || 0), 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + parseInt(service.duration || 0), 0);

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch time slots when doctor AND date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableTimeSlots(selectedDoctor, selectedDate);
    } else {
      setTimeSlots([]);
      setSelectedTime('');
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/doctors");
      const activeDoctors = res.data.filter(d => d.status === 'Active');
      setDoctors(activeDoctors);
      
      if (activeDoctors.length === 0) {
        setError('No active doctors available at the moment.');
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError('Failed to load doctors. Please try again.');
    }
  };

  /**
   * Get day of week from selected date
   * Returns: Monday, Tuesday, etc.
   */
  const getDayOfWeek = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  /**
   * Fetch available time slots based on doctor and selected date
   * Filters by:
   * 1. Day of week (from recurring schedule)
   * 2. Not already booked for this specific date
   */
  const fetchAvailableTimeSlots = async (doctorId, selectedDate) => {
    try {
      setLoading(true);
      setError('');
      
      // Get day of week from selected date
      const dayOfWeek = getDayOfWeek(selectedDate);
      console.log(`Selected date: ${selectedDate}, Day: ${dayOfWeek}`);
      
      // Fetch all time slots for this doctor
      const res = await axios.get(`http://127.0.0.1:8000/api/time-slots/${doctorId}`);
      
      // Filter slots by day of week and availability
      const filteredSlots = res.data.filter(slot => {
        return slot.day === dayOfWeek && slot.status === 'Available';
      });
      
      console.log(`Found ${filteredSlots.length} available slots for ${dayOfWeek}`);
      
      setTimeSlots(filteredSlots);
      
      if (filteredSlots.length === 0) {
        setError(`No available time slots for ${dayOfWeek}. Please try another date.`);
      }
    } catch (err) {
      console.error("Error fetching time slots:", err);
      setError('Failed to load time slots. Please try again.');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
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
    
    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    
    try {
      // Get user ID from localStorage or use default
      const userId = localStorage.getItem('user_id') || 1;

      const payload = {
        user_id: parseInt(userId),
        doctor_id: parseInt(selectedDoctor),
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        total_cost: parseFloat(totalCost.toFixed(2)),
        total_duration: parseInt(totalDuration),
        payment_method: paymentMethod,
        service_ids: selectedServices.map(s => parseInt(s.id))
      };

      console.log('📅 Submitting appointment:', payload);

      const response = await axios.post("http://127.0.0.1:8000/api/appointments", payload);
      
      console.log('✅ Appointment created:', response.data);

      alert('🎉 Appointment confirmed successfully!');
      onConfirm();
      
    } catch (err) {
      console.error("❌ Error creating appointment:", err);
      console.error("Error response:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors || 
                          err.message || 
                          'Failed to create appointment';
      
      setError(errorMessage);
      alert("❌ Failed to create appointment: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dayOfWeek = getDayOfWeek(dateString);
    return `${dayOfWeek}, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
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

            {/* Error Alert */}
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
                      {totalDuration} minutes
                    </span>
                  </div>
                </div>

                <button 
                  onClick={onBack}
                  className="btn btn-link text-primary text-decoration-none p-0 mt-4"
                >
                  Edit Services
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

                {!loading && selectedDoctor && selectedDate && timeSlots.length > 0 && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <Clock size={18} className="me-2" />
                      Available Time Slots *
                    </label>
                    <p className="small text-muted mb-3">
                      Showing available slots for {getDayOfWeek(selectedDate)}
                    </p>
                    <div className="row g-3">
                      {timeSlots.map((slot) => (
                        <div key={slot.id} className="col-4">
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
                          >
                            {slot.start_time}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && selectedDoctor && selectedDate && timeSlots.length === 0 && (
                  <div className="alert alert-warning d-flex align-items-start">
                    <AlertCircle size={20} className="me-2 mt-1" />
                    <div>
                      <strong>No available time slots</strong>
                      <p className="mb-0 small">
                        The doctor doesn't have availability on {getDayOfWeek(selectedDate)}s. 
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
                  <div 
                    onClick={() => {
                      setPaymentMethod('card');
                      setError('');
                    }}
                    className={`p-4 mb-3 border rounded ${paymentMethod === 'card' ? 'border-primary bg-light' : ''}`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <CreditCard size={24} className="text-primary" />
                      <div>
                        <div className="fw-semibold">Credit/Debit Card</div>
                        <div className="small text-muted">Pay securely with your card</div>
                      </div>
                      {paymentMethod === 'card' && <Check size={20} className="text-primary ms-auto" />}
                    </div>
                  </div>

                  <div 
                    onClick={() => {
                      setPaymentMethod('cash');
                      setError('');
                    }}
                    className={`p-4 mb-3 border rounded ${paymentMethod === 'cash' ? 'border-primary bg-light' : ''}`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <DollarSign size={24} className="text-success" />
                      <div>
                        <div className="fw-semibold">Pay at Clinic</div>
                        <div className="small text-muted">Pay when you arrive</div>
                      </div>
                      {paymentMethod === 'cash' && <Check size={20} className="text-primary ms-auto" />}
                    </div>
                  </div>

                  <div 
                    onClick={() => {
                      setPaymentMethod('insurance');
                      setError('');
                    }}
                    className={`p-4 mb-3 border rounded ${paymentMethod === 'insurance' ? 'border-primary bg-light' : ''}`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Check size={24} className="text-info" />
                      <div>
                        <div className="fw-semibold">Insurance</div>
                        <div className="small text-muted">Use your insurance coverage</div>
                      </div>
                      {paymentMethod === 'insurance' && <Check size={20} className="text-primary ms-auto" />}
                    </div>
                  </div>
                </div>

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
                      <span className="fw-semibold">{selectedTime || 'Not selected'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                      <span className="text-muted">Duration:</span>
                      <span className="fw-semibold">{totalDuration} minutes</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                      <span className="text-muted">Payment:</span>
                      <span className="fw-semibold text-capitalize">{paymentMethod || 'Not selected'}</span>
                    </div>
                    <div className="d-flex justify-content-between pt-2">
                      <span className="fw-bold fs-5">Total Cost:</span>
                      <span className="text-primary fw-bold fs-4">$ {totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
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