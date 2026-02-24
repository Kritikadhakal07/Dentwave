import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Calendar, CreditCard, Check, AlertCircle, ChevronLeft, User, Shield } from 'lucide-react';


export const PaymentStatus = ({ onGoHome }) => {
  const params        = new URLSearchParams(window.location.search);
  const isSuccess     = window.location.pathname.includes('success');
  const appointmentId = params.get('appointment_id');
  const reason        = params.get('reason');

  const reasonMap = {
    appointment_not_found: 'Appointment not found.',
    already_paid:          'This appointment has already been paid.',
    initiate_failed:       'Could not connect to Khalti. Please try again.',
    invalid_response:      'Invalid response from payment gateway.',
    payment_not_found:     'Payment record not found.',
    payment_cancelled:     'Payment was cancelled.',
    lookup_failed:         'Could not verify payment. Contact support.',
    payment_failed:        'Payment was not completed.',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '48px 40px', textAlign: 'center', maxWidth: 420, width: '100%' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>{isSuccess ? '🎉' : '❌'}</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 10 }}>
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>
          {isSuccess
            ? `Your appointment #${appointmentId} has been confirmed. You'll receive a confirmation shortly.`
            : (reasonMap[reason] || 'Something went wrong with your payment.')}
        </p>
        <button
          onClick={onGoHome}
          style={{ padding: '13px 32px', borderRadius: 12, border: 'none', background: isSuccess ? '#4f6ef7' : '#e74c3c', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
        >
          {isSuccess ? 'View Appointments' : 'Try Again'}
        </button>
      </div>
    </div>
  );
};


const BookingPage = ({ selectedServices, onRemoveService, onConfirm, onBack }) => {
  const [step, setStep]                     = useState(1);
  const [selectedDate, setSelectedDate]     = useState('');
  const [selectedTime, setSelectedTime]     = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [paymentMethod, setPaymentMethod]   = useState('');
  const [doctors, setDoctors]               = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');

  const totalCost     = selectedServices.reduce((sum, s) => sum + parseFloat(s.cost || 0), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + parseInt(s.duration || 0), 0);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/doctors')
      .then(r => r.json())
      .then(data => {
        const active = data.filter(d => d.status === 'Active');
        setDoctors(active);
        if (active.length === 0) setError('No active doctors available.');
      })
      .catch(() => setError('Failed to load doctors. Please try again.'));
  }, []);


  useEffect(() => {
    if (selectedDoctor && selectedDate && selectedServices.length > 0) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setSelectedTime('');
    }
  }, [selectedDoctor, selectedDate, selectedServices]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    setError('');
    setSelectedTime('');
    try {
      const res  = await fetch('http://127.0.0.1:8000/api/available-slots', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id:   parseInt(selectedDoctor),
          date:        selectedDate,
          service_ids: selectedServices.map(s => parseInt(s.id)),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAvailableSlots(data.available_slots);
      } else {
        setError(data.message || 'No slots available.');
        setAvailableSlots([]);
      }
    } catch {
      setError('Failed to load time slots. Please try again.');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Group slots into Morning / Afternoon / Evening ────────────────
  const groupedSlots = () => {
    const groups = { '🌅 Morning': [], '🌇 Afternoon': [], '🌆 Evening': [] };
    availableSlots.forEach(slot => {
      const hour = parseInt(slot.start_time.split(':')[0]);
      if (hour < 12)      groups['🌅 Morning'].push(slot);
      else if (hour < 17) groups['🌇 Afternoon'].push(slot);
      else                groups['🌆 Evening'].push(slot);
    });
    return groups;
  };

  const formatDate = (d) => {
    if (!d) return '';
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const date = new Date(d);
    return `${days[date.getDay()]}, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  };

  const handleContinue = () => {
    setError('');
    if (step === 1) {
      if (!selectedServices.length) { setError('Please select at least one service.'); return; }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDoctor) { setError('Please select a doctor.');    return; }
      if (!selectedDate)   { setError('Please select a date.');      return; }
      if (!selectedTime)   { setError('Please select a time slot.'); return; }
      setStep(3);
    }
  };

  // ── Create appointment then handle payment method ─────────────────
  const handleConfirmAppointment = async () => {
    setError('');
    if (!paymentMethod) { setError('Please select a payment method.'); return; }

    setLoading(true);
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const res = await fetch('http://127.0.0.1:8000/api/appointments', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:          parseInt(userId),
          doctor_id:        parseInt(selectedDoctor),
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          total_cost:       parseFloat(totalCost.toFixed(2)),
          total_duration:   totalDuration,
          payment_method:   paymentMethod,
          service_ids:      selectedServices.map(s => parseInt(s.id)),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create appointment.');

      const appointmentId = data.appointment?.id || data.id;

      if (paymentMethod === 'khalti') {
       
        window.location.href = `http://127.0.0.1:8000/khalti/initiate/${appointmentId}`;
       
        return;
      }

     
      alert('🎉 Appointment confirmed successfully!');
      onConfirm();

    } catch (err) {
      setError(err.message || 'Failed to create appointment.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctorObj  = doctors.find(d => d.id == selectedDoctor);
  const primaryDisabled    = loading || (step === 1 && selectedServices.length === 0);

  const S = {
    page:    { minHeight: '100vh', background: '#f4f6fb', padding: '40px 16px' },
    wrap:    { maxWidth: 660, margin: '0 auto' },
    backBtn: { background: 'none', border: 'none', color: '#4f6ef7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, fontWeight: 600, fontSize: 14, padding: 0 },
    card:    { background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '36px 32px' },
    title:   { fontSize: 22, fontWeight: 700, color: '#1a1a2e', textAlign: 'center', marginBottom: 28 },

    stepDot:   (n) => ({ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0, background: step >= n ? '#4f6ef7' : '#eaecf0', color: step >= n ? '#fff' : '#aaa', transition: 'all 0.3s' }),
    stepLine:  { flex: 1, height: 3, margin: '0 6px', background: '#eaecf0', borderRadius: 4, overflow: 'hidden' },
    stepFill:  (n) => ({ height: '100%', width: step > n ? '100%' : '0%', background: '#4f6ef7', transition: 'width 0.4s' }),
    stepLabel: (n) => ({ fontSize: 12, fontWeight: step === n ? 700 : 400, color: step === n ? '#4f6ef7' : '#bbb' }),

    errBox:  { background: '#fff5f5', border: '1px solid #fcc', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20, color: '#c0392b', fontSize: 14 },

    label:   { display: 'block', fontWeight: 600, fontSize: 13, color: '#444', marginBottom: 8 },
    input:   { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: 14, outline: 'none', color: '#333', boxSizing: 'border-box', background: '#fff' },
    hint:    { fontSize: 12, color: '#aaa', marginTop: 5 },

    svcCard: { border: '1px solid #eee', borderRadius: 12, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    svcMeta: { display: 'flex', gap: 14, marginTop: 5, fontSize: 12, color: '#999', alignItems: 'center' },
    rmBtn:   { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0 },

    totals:  { borderTop: '1px solid #f0f0f0', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },

    infoBox: (type) => {
      const map = { info: ['#f0f4ff','#d0d8ff','#4f6ef7'], warn: ['#fffbea','#ffe082','#7a5c00'] };
      const [bg, bd, cl] = map[type];
      return { background: bg, border: `1px solid ${bd}`, borderRadius: 10, padding: '13px 16px', fontSize: 13, color: cl, display: 'flex', alignItems: 'flex-start', gap: 10 };
    },

    spin:    { width: 30, height: 30, border: '3px solid #eee', borderTopColor: '#4f6ef7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' },

    slotGroup: { marginBottom: 18 },
    slotLbl:   { fontSize: 11, fontWeight: 700, color: '#bbb', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 },
    slotWrap:  { display: 'flex', flexWrap: 'wrap', gap: 8 },
    slotBtn:   (active) => ({ padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${active ? '#4f6ef7' : '#ddd'}`, background: active ? '#4f6ef7' : '#fff', color: active ? '#fff' : '#444', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s' }),

    payCard: (active) => ({ padding: '15px 18px', borderRadius: 12, border: `2px solid ${active ? '#4f6ef7' : '#eee'}`, background: active ? '#f5f7ff' : '#fafafa', cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s' }),

    khaltiCard: (active) => ({ padding: '15px 18px', borderRadius: 12, border: `2px solid ${active ? '#5C2D91' : '#eee'}`, background: active ? '#f5f0ff' : '#fafafa', cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s' }),

    sumBox: { background: '#f8f9ff', borderRadius: 14, padding: '20px 22px', marginTop: 20 },
    sumRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid #eee' },

    navRow:  { display: 'flex', gap: 12, marginTop: 28 },
    secBtn:  { flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid #ddd', background: '#fff', color: '#444', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
    priBtn:  (dis) => ({ flex: 2, padding: '13px', borderRadius: 12, border: 'none', background: dis ? '#c5c5c5' : '#4f6ef7', color: '#fff', fontWeight: 700, cursor: dis ? 'not-allowed' : 'pointer', fontSize: 14, transition: 'background 0.2s' }),
  };

  return (
    <div style={S.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.wrap}>

        <button style={S.backBtn} onClick={onBack}>
          <ChevronLeft size={17}/> Back to Services
        </button>

        <div style={S.card}>
          <h1 style={S.title}>Book Appointment</h1>

          {/* ── Stepper ─────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <div style={S.stepDot(1)}>{step > 1 ? <Check size={15}/> : '1'}</div>
            <div style={S.stepLine}><div style={S.stepFill(1)}/></div>
            <div style={S.stepDot(2)}>{step > 2 ? <Check size={15}/> : '2'}</div>
            <div style={S.stepLine}><div style={S.stepFill(2)}/></div>
            <div style={S.stepDot(3)}>3</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
            {['Services', 'Doctor & Time', 'Payment'].map((l, i) => (
              <span key={i} style={S.stepLabel(i + 1)}>{l}</span>
            ))}
          </div>

          {error && (
            <div style={S.errBox}>
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 1 }}/> {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 18 }}>Review your selected services before continuing.</p>

              {selectedServices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#bbb', fontSize: 14 }}>
                  No services selected. Go back to add services.
                </div>
              ) : selectedServices.map(s => (
                <div key={s.id} style={S.svcCard}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{s.name}</p>
                    <div style={S.svcMeta}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11}/> {s.duration} min</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><DollarSign size={11}/> Rs. {parseFloat(s.cost).toFixed(2)}</span>
                    </div>
                  </div>
                  <button style={S.rmBtn} onClick={() => onRemoveService(s.id)}>Remove</button>
                </div>
              ))}

              <div style={S.totals}>
                <span style={{ fontSize: 13, color: '#888' }}>
                  Duration: <strong style={{ color: '#333' }}>{totalDuration} min</strong>
                  <span style={{ color: '#bbb', fontSize: 12 }}> +5 buffer</span>
                </span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#4f6ef7' }}>Rs. {totalCost.toFixed(2)}</span>
              </div>

              <button
                onClick={onBack}
                style={{ marginTop: 18, width: '100%', padding: '11px', borderRadius: 10, border: '1.5px dashed #4f6ef7', background: 'none', color: '#4f6ef7', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
              >
                + Add More Services
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <label style={S.label}>
                  <User size={12} style={{ marginRight: 5, verticalAlign: 'middle' }}/> Select Doctor
                </label>
                <select
                  value={selectedDoctor}
                  onChange={e => { setSelectedDoctor(e.target.value); setSelectedTime(''); setError(''); }}
                  style={S.input}
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={S.label}>
                  <Calendar size={12} style={{ marginRight: 5, verticalAlign: 'middle' }}/> Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); setError(''); }}
                  style={S.input}
                />
                {selectedDate && <p style={S.hint}>📅 {formatDate(selectedDate)}</p>}
              </div>

              {(!selectedDoctor || !selectedDate) && (
                <div style={S.infoBox('info')}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }}/>
                  Select a doctor and date to see available time slots.
                </div>
              )}

              {loading && (
                <div style={{ textAlign: 'center', padding: '28px 0', color: '#bbb', fontSize: 13 }}>
                  <div style={S.spin}/>
                  Finding available slots…
                </div>
              )}

              {!loading && availableSlots.length > 0 && (
                <div>
                  <label style={{ ...S.label, marginBottom: 14 }}>
                    <Clock size={12} style={{ marginRight: 5, verticalAlign: 'middle' }}/>
                    Available Time Slots
                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: '#bbb' }}>
                      {totalDuration} min each
                    </span>
                  </label>
                  {Object.entries(groupedSlots()).map(([label, slots]) =>
                    slots.length === 0 ? null : (
                      <div key={label} style={S.slotGroup}>
                        <p style={S.slotLbl}>{label}</p>
                        <div style={S.slotWrap}>
                          {slots.map((slot, i) => (
                            <button
                              key={i}
                              onClick={() => { setSelectedTime(slot.start_time); setError(''); }}
                              style={S.slotBtn(selectedTime === slot.start_time)}
                            >
                              {slot.start_time} – {slot.end_time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {!loading && selectedDoctor && selectedDate && availableSlots.length === 0 && !error && (
                <div style={S.infoBox('warn')}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }}/>
                  <div><strong>No slots available</strong> — try a different date or doctor.</div>
                </div>
              )}
            </div>
          )}

         
          {step === 3 && (
            <div>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 18 }}>Choose your preferred payment method.</p>

              {/* ── Khalti (online) ── */}
              <div
                style={S.khaltiCard(paymentMethod === 'khalti')}
                onClick={() => { setPaymentMethod('khalti'); setError(''); }}
              >
                {/* Khalti purple logo icon (SVG inline) */}
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="#5C2D91"/>
                  <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">K</text>
                </svg>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#5C2D91' }}>Pay with Khalti</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>Secure online payment via Khalti wallet</p>
                </div>
                {paymentMethod === 'khalti' && <Check size={17} color="#5C2D91"/>}
              </div>

              {/* ── Pay at Clinic ── */}
              <div style={S.payCard(paymentMethod === 'cash')} onClick={() => { setPaymentMethod('cash'); setError(''); }}>
                <DollarSign size={22} color="#27ae60"/>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>Pay at Clinic</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>Pay in cash when you arrive</p>
                </div>
                {paymentMethod === 'cash' && <Check size={17} color="#4f6ef7"/>}
              </div>

              {/* ── Insurance ── */}
              <div style={S.payCard(paymentMethod === 'insurance')} onClick={() => { setPaymentMethod('insurance'); setError(''); }}>
                <Shield size={22} color="#e67e22"/>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>Insurance</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>Use your health coverage</p>
                </div>
                {paymentMethod === 'insurance' && <Check size={17} color="#4f6ef7"/>}
              </div>

              {/* Khalti info note */}
              {paymentMethod === 'khalti' && (
                <div style={{ ...S.infoBox('info'), marginTop: 6, marginBottom: 4 }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }}/>
                  <span>You'll be redirected to Khalti to complete payment. Make sure you have sufficient balance.</span>
                </div>
              )}

              {/* Summary */}
              <div style={S.sumBox}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 14 }}>📋 Booking Summary</p>
                {[
                  ['Services', `${selectedServices.length} service(s)`],
                  ['Doctor',   selectedDoctorObj?.name || '—'],
                  ['Date',     formatDate(selectedDate)],
                  ['Time',     selectedTime ? `${selectedTime} (${totalDuration} min)` : '—'],
                  ['Payment',  paymentMethod === 'khalti' ? 'Khalti' : paymentMethod ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : '—'],
                ].map(([k, v]) => (
                  <div key={k} style={S.sumRow}>
                    <span style={{ color: '#aaa' }}>{k}</span>
                    <span style={{ fontWeight: 600, color: '#333' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: '#4f6ef7' }}>Rs. {totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Navigation ─────────────────────────────── */}
          <div style={S.navRow}>
            {step > 1 && (
              <button style={S.secBtn} onClick={() => { setStep(step - 1); setError(''); }} disabled={loading}>
                ← Back
              </button>
            )}
            <button
              style={S.priBtn(primaryDisabled)}
              disabled={primaryDisabled}
              onClick={step === 3 ? handleConfirmAppointment : handleContinue}
            >
              {loading
                ? (paymentMethod === 'khalti' ? 'Redirecting to Khalti…' : 'Please wait…')
                : step === 3
                  ? (paymentMethod === 'khalti' ? '💜 Pay with Khalti' : '✓ Confirm Appointment')
                  : 'Continue →'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;