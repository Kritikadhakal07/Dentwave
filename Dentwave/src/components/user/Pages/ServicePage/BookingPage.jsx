import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Calendar, Check, AlertCircle, ChevronLeft, User, Shield } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Injected CSS
// ─────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:wght@500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:       #18181b;
    --ink-2:     #52525b;
    --ink-3:     #a1a1aa;
    --surface:   #ffffff;
    --base:      #f4f3ef;
    --border:    #e4e4e7;
    --accent:    #2563eb;
    --accent-lt: #eff4ff;
    --accent-dk: #1d4ed8;
    --success:   #16a34a;
    --warn-bg:   #fefce8;
    --warn-bd:   #fde047;
    --warn-tx:   #713f12;
    --khalti:    #5C2D91;
    --khalti-lt: #f5f0ff;
    --err:       #dc2626;
    --err-bg:    #fef2f2;
    --err-bd:    #fecaca;
    --radius:    14px;
    --shadow:    0 1px 3px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.07);
    --shadow-lg: 0 4px 6px rgba(0,0,0,.04), 0 20px 48px rgba(0,0,0,.10);
    --font-body: 'Sora', sans-serif;
    --font-disp: 'Lora', serif;
  }

  .bk-page {
    min-height: 100vh;
    background: var(--base);
    padding: 40px 16px 72px;
    font-family: var(--font-body);
  }

  .bk-wrap {
    max-width: 680px;
    margin: 0 auto;
  }

  /* ── Back button ── */
  .bk-back {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 24px;
    padding: 6px 0;
    transition: gap 0.15s;
  }
  .bk-back:hover { gap: 8px; }

  /* ── Card ── */
  .bk-card {
    background: var(--surface);
    border-radius: 20px;
    box-shadow: var(--shadow);
    padding: 36px 32px;
    animation: fadeUp .35s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bk-title {
    font-family: var(--font-disp);
    font-size: 26px;
    font-weight: 700;
    color: var(--ink);
    text-align: center;
    margin-bottom: 28px;
  }

  /* ── Stepper ── */
  .bk-stepper {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .bk-step-dot {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;
    transition: all .3s;
  }
  .bk-step-dot.done   { background: var(--accent); color: #fff; }
  .bk-step-dot.active { background: var(--accent); color: #fff; box-shadow: 0 0 0 4px var(--accent-lt); }
  .bk-step-dot.idle   { background: var(--border); color: var(--ink-3); }

  .bk-step-line {
    flex: 1;
    height: 3px;
    margin: 0 6px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
  }
  .bk-step-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 4px;
    transition: width .45s ease;
  }

  .bk-step-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 28px;
  }
  .bk-step-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .4px;
    transition: color .3s;
  }
  .bk-step-label.active { font-weight: 700; color: var(--accent); }
  .bk-step-label.idle   { color: var(--ink-3); }

  /* ── Error ── */
  .bk-error {
    background: var(--err-bg);
    border: 1px solid var(--err-bd);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 20px;
    color: var(--err);
    font-size: 13px;
    animation: shake .3s ease;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-4px); }
    75%      { transform: translateX(4px); }
  }

  /* ── Form label / input ── */
  .bk-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 12px;
    color: var(--ink-2);
    text-transform: uppercase;
    letter-spacing: .6px;
    margin-bottom: 8px;
  }

  .bk-input, .bk-select {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--ink);
    background: var(--surface);
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    appearance: none;
    -webkit-appearance: none;
  }
  .bk-input:focus, .bk-select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-lt);
  }

  .bk-hint {
    font-size: 12px;
    color: var(--ink-3);
    margin-top: 6px;
  }

  .bk-field { margin-bottom: 20px; }

  /* ── Select wrapper (arrow) ── */
  .bk-select-wrap {
    position: relative;
  }
  .bk-select-wrap::after {
    content: '▾';
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-3);
    pointer-events: none;
    font-size: 13px;
  }

  /* ── Service card ── */
  .bk-svc {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: border-color .15s;
  }
  .bk-svc:hover { border-color: #c4b5fd; }

  .bk-svc-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--ink);
    margin-bottom: 5px;
  }

  .bk-svc-meta {
    display: flex;
    gap: 14px;
    font-size: 12px;
    color: var(--ink-3);
    flex-wrap: wrap;
  }

  .bk-svc-meta span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .bk-rm-btn {
    background: none;
    border: none;
    color: var(--err);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font-body);
    padding: 5px 10px;
    border-radius: 6px;
    transition: background .15s;
    flex-shrink: 0;
  }
  .bk-rm-btn:hover { background: var(--err-bg); }

  .bk-totals {
    border-top: 1px solid var(--border);
    margin-top: 16px;
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .bk-total-price {
    font-size: 22px;
    font-weight: 800;
    color: var(--accent);
  }

  .bk-add-more {
    margin-top: 16px;
    width: 100%;
    padding: 11px;
    border-radius: 10px;
    border: 1.5px dashed var(--accent);
    background: none;
    color: var(--accent);
    font-family: var(--font-body);
    font-weight: 600;
    cursor: pointer;
    font-size: 13px;
    transition: background .15s;
  }
  .bk-add-more:hover { background: var(--accent-lt); }

  /* ── Info box ── */
  .bk-info {
    border-radius: 10px;
    padding: 13px 16px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 13px;
  }
  .bk-info.info { background: var(--accent-lt); border: 1px solid #bfdbfe; color: var(--accent-dk); }
  .bk-info.warn { background: var(--warn-bg); border: 1px solid var(--warn-bd); color: var(--warn-tx); }

  /* ── Spinner ── */
  .bk-spin-wrap { text-align: center; padding: 32px 0; color: var(--ink-3); font-size: 13px; }
  .bk-spin {
    width: 28px; height: 28px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .7s linear infinite;
    margin: 0 auto 10px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Slot groups ── */
  .bk-slot-group { margin-bottom: 18px; }
  .bk-slot-group-label {
    font-size: 10px;
    font-weight: 700;
    color: var(--ink-3);
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .bk-slot-group-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .bk-slot-wrap { display: flex; flex-wrap: wrap; gap: 8px; }

  .bk-slot {
    padding: 8px 14px;
    border-radius: 8px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    color: var(--ink-2);
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    transition: all .15s;
  }
  .bk-slot:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lt); }
  .bk-slot.active { border-color: var(--accent); background: var(--accent); color: #fff; }

  /* ── Payment cards ── */
  .bk-pay-card {
    padding: 16px 18px;
    border-radius: 12px;
    border: 2px solid var(--border);
    background: #fafafa;
    cursor: pointer;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all .2s;
  }
  .bk-pay-card:hover { border-color: var(--accent); background: var(--accent-lt); }
  .bk-pay-card.active { border-color: var(--accent); background: var(--accent-lt); }
  .bk-pay-card.khalti:hover { border-color: var(--khalti); background: var(--khalti-lt); }
  .bk-pay-card.khalti.active { border-color: var(--khalti); background: var(--khalti-lt); }

  .bk-pay-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .bk-pay-name { font-weight: 700; font-size: 14px; color: var(--ink); margin-bottom: 2px; }
  .bk-pay-desc { font-size: 12px; color: var(--ink-3); }

  .bk-pay-check { margin-left: auto; flex-shrink: 0; }

  /* ── Summary box ── */
  .bk-sum {
    background: var(--base);
    border-radius: 14px;
    padding: 20px 22px;
    margin-top: 20px;
    border: 1px solid var(--border);
  }

  .bk-sum-title {
    font-weight: 700;
    font-size: 13px;
    color: var(--ink);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bk-sum-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }
  .bk-sum-row:last-of-type { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }

  .bk-sum-key { color: var(--ink-3); }
  .bk-sum-val { font-weight: 600; color: var(--ink); text-align: right; max-width: 60%; }

  .bk-sum-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 14px;
    margin-top: 10px;
    border-top: 2px solid var(--border);
  }

  /* ── Nav buttons ── */
  .bk-nav { display: flex; gap: 10px; margin-top: 28px; }

  .bk-btn-sec {
    flex: 1;
    padding: 13px;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    color: var(--ink-2);
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: border-color .15s, color .15s;
  }
  .bk-btn-sec:hover { border-color: var(--ink-2); color: var(--ink); }

  .bk-btn-pri {
    flex: 2;
    padding: 13px;
    border-radius: 10px;
    border: none;
    background: var(--accent);
    color: #fff;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: background .2s, transform .1s;
    position: relative;
    overflow: hidden;
  }
  .bk-btn-pri:hover:not(:disabled) { background: var(--accent-dk); transform: translateY(-1px); }
  .bk-btn-pri:active:not(:disabled) { transform: translateY(0); }
  .bk-btn-pri:disabled { background: var(--border); color: var(--ink-3); cursor: not-allowed; }
  .bk-btn-pri.khalti { background: var(--khalti); }
  .bk-btn-pri.khalti:hover:not(:disabled) { background: #4a236f; }

  /* ── Empty / no-services ── */
  .bk-empty {
    text-align: center;
    padding: 48px 0;
    color: var(--ink-3);
    font-size: 14px;
  }
  .bk-empty-icon { font-size: 40px; display: block; margin-bottom: 10px; }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .bk-card { padding: 24px 18px; }
    .bk-title { font-size: 22px; }
    .bk-nav { flex-direction: column-reverse; }
    .bk-btn-sec, .bk-btn-pri { flex: none; width: 100%; }
    .bk-totals { flex-direction: column; align-items: flex-start; }
    .bk-svc { flex-direction: column; align-items: flex-start; gap: 10px; }
    .bk-rm-btn { align-self: flex-end; }
    .bk-sum-val { max-width: 55%; }
  }

  @media (max-width: 400px) {
    .bk-page { padding: 24px 12px 60px; }
    .bk-slot { font-size: 12px; padding: 7px 11px; }
    .bk-step-dot { width: 28px; height: 28px; font-size: 11px; }
  }
`;

// ─────────────────────────────────────────────────────────────
// PaymentStatus
// ─────────────────────────────────────────────────────────────
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
    <>
      <style>{CSS}</style>
      <div className="bk-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,.08)', padding: '52px 40px', textAlign: 'center', maxWidth: 420, width: '100%', animation: 'fadeUp .35s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>{isSuccess ? '🎉' : '😕'}</div>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 700, color: '#18181b', marginBottom: 10 }}>
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h2>
          <p style={{ color: '#71717a', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            {isSuccess
              ? `Your appointment #${appointmentId} is confirmed. You'll receive a confirmation shortly.`
              : (reasonMap[reason] || 'Something went wrong with your payment.')}
          </p>
          <button
            onClick={onGoHome}
            className={`bk-btn-pri${isSuccess ? '' : ''}`}
            style={{ width: '100%', background: isSuccess ? '#2563eb' : '#dc2626' }}
          >
            {isSuccess ? 'View Appointments' : 'Try Again'}
          </button>
        </div>
      </div>
    </>
  );
};


// ─────────────────────────────────────────────────────────────
// BookingPage
// ─────────────────────────────────────────────────────────────
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
      if (data.success) setAvailableSlots(data.available_slots);
      else { setError(data.message || 'No slots available.'); setAvailableSlots([]); }
    } catch {
      setError('Failed to load time slots. Please try again.');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedSlots = () => {
    const groups = { Morning: [], Afternoon: [], Evening: [] };
    availableSlots.forEach(slot => {
      const hour = parseInt(slot.start_time.split(':')[0]);
      if (hour < 12)      groups.Morning.push(slot);
      else if (hour < 17) groups.Afternoon.push(slot);
      else                groups.Evening.push(slot);
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

  const selectedDoctorObj = doctors.find(d => d.id == selectedDoctor);
  const primaryDisabled   = loading || (step === 1 && selectedServices.length === 0);
  const stepLabels        = ['Services', 'Doctor & Time', 'Payment'];

  const stepDotClass = (n) => {
    if (step > n)  return 'bk-step-dot done';
    if (step === n) return 'bk-step-dot active';
    return 'bk-step-dot idle';
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="bk-page">
        <div className="bk-wrap">

          <button className="bk-back" onClick={onBack}>
            <ChevronLeft size={16}/> Back to Services
          </button>

          <div className="bk-card">
            <h1 className="bk-title">Book Appointment</h1>

            {/* Stepper */}
            <div className="bk-stepper">
              <div className={stepDotClass(1)}>{step > 1 ? <Check size={14}/> : '1'}</div>
              <div className="bk-step-line"><div className="bk-step-fill" style={{ width: step > 1 ? '100%' : '0%' }}/></div>
              <div className={stepDotClass(2)}>{step > 2 ? <Check size={14}/> : '2'}</div>
              <div className="bk-step-line"><div className="bk-step-fill" style={{ width: step > 2 ? '100%' : '0%' }}/></div>
              <div className={stepDotClass(3)}>3</div>
            </div>
            <div className="bk-step-labels">
              {stepLabels.map((l, i) => (
                <span key={i} className={`bk-step-label ${step === i + 1 ? 'active' : 'idle'}`}>{l}</span>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="bk-error">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }}/> {error}
              </div>
            )}

            {/* ── STEP 1: Services ── */}
            {step === 1 && (
              <div>
                <p style={{ color: '#71717a', fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
                  Review your selected services before continuing.
                </p>

                {selectedServices.length === 0 ? (
                  <div className="bk-empty">
                    <span className="bk-empty-icon">🦷</span>
                    No services selected. Go back to add services.
                  </div>
                ) : selectedServices.map(s => (
                  <div key={s.id} className="bk-svc">
                    <div>
                      <p className="bk-svc-name">{s.name}</p>
                      <div className="bk-svc-meta">
                        <span><Clock size={11}/> {s.duration} min</span>
                        <span><DollarSign size={11}/> Rs. {parseFloat(s.cost).toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="bk-rm-btn" onClick={() => onRemoveService(s.id)}>Remove</button>
                  </div>
                ))}

                <div className="bk-totals">
                  <span style={{ fontSize: 13, color: '#71717a' }}>
                    Est. duration: <strong style={{ color: '#18181b' }}>{totalDuration} min</strong>
                    <span style={{ color: '#a1a1aa', fontSize: 12 }}> +5 min buffer</span>
                  </span>
                  <span className="bk-total-price">Rs. {totalCost.toFixed(2)}</span>
                </div>

                <button className="bk-add-more" onClick={onBack}>+ Add More Services</button>
              </div>
            )}

            {/* ── STEP 2: Doctor & Time ── */}
            {step === 2 && (
              <div>
                <div className="bk-field">
                  <label className="bk-label">
                    <User size={12}/> Select Doctor
                  </label>
                  <div className="bk-select-wrap">
                    <select
                      className="bk-select"
                      value={selectedDoctor}
                      onChange={e => { setSelectedDoctor(e.target.value); setSelectedTime(''); setError(''); }}
                    >
                      <option value="">Choose a doctor…</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bk-field">
                  <label className="bk-label">
                    <Calendar size={12}/> Select Date
                  </label>
                  <input
                    type="date"
                    className="bk-input"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); setError(''); }}
                  />
                  {selectedDate && <p className="bk-hint">📅 {formatDate(selectedDate)}</p>}
                </div>

                {(!selectedDoctor || !selectedDate) && (
                  <div className="bk-info info">
                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
                    Select a doctor and date to view available time slots.
                  </div>
                )}

                {loading && (
                  <div className="bk-spin-wrap">
                    <div className="bk-spin"/>
                    Finding available slots…
                  </div>
                )}

                {!loading && availableSlots.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <label className="bk-label" style={{ marginBottom: 14 }}>
                      <Clock size={12}/> Available Slots
                      <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: '#a1a1aa', textTransform: 'none', letterSpacing: 0 }}>
                        {totalDuration} min each
                      </span>
                    </label>
                    {Object.entries(groupedSlots()).map(([label, slots]) =>
                      slots.length === 0 ? null : (
                        <div key={label} className="bk-slot-group">
                          <p className="bk-slot-group-label">{label}</p>
                          <div className="bk-slot-wrap">
                            {slots.map((slot, i) => (
                              <button
                                key={i}
                                className={`bk-slot${selectedTime === slot.start_time ? ' active' : ''}`}
                                onClick={() => { setSelectedTime(slot.start_time); setError(''); }}
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
                  <div className="bk-info warn" style={{ marginTop: 4 }}>
                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
                    <div><strong>No slots available</strong> — try a different date or doctor.</div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Payment ── */}
            {step === 3 && (
              <div>
                <p style={{ color: '#71717a', fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
                  Choose how you'd like to pay for this appointment.
                </p>

                {/* Khalti */}
                <div
                  className={`bk-pay-card khalti${paymentMethod === 'khalti' ? ' active' : ''}`}
                  onClick={() => { setPaymentMethod('khalti'); setError(''); }}
                >
                  <div className="bk-pay-icon" style={{ background: '#5C2D91' }}>
                    <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fill="white" fontWeight="bold">K</text>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="bk-pay-name" style={{ color: '#5C2D91' }}>Pay with Khalti</p>
                    <p className="bk-pay-desc">Secure online payment via Khalti wallet</p>
                  </div>
                  {paymentMethod === 'khalti' && <Check size={17} color="#5C2D91" className="bk-pay-check"/>}
                </div>

                {/* Cash */}
                <div
                  className={`bk-pay-card${paymentMethod === 'cash' ? ' active' : ''}`}
                  onClick={() => { setPaymentMethod('cash'); setError(''); }}
                >
                  <div className="bk-pay-icon" style={{ background: '#dcfce7' }}>
                    <DollarSign size={20} color="#16a34a"/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="bk-pay-name">Pay at Clinic</p>
                    <p className="bk-pay-desc">Pay in cash when you arrive</p>
                  </div>
                  {paymentMethod === 'cash' && <Check size={17} color="#2563eb" className="bk-pay-check"/>}
                </div>

                {/* Insurance */}
                <div
                  className={`bk-pay-card${paymentMethod === 'insurance' ? ' active' : ''}`}
                  onClick={() => { setPaymentMethod('insurance'); setError(''); }}
                >
                  <div className="bk-pay-icon" style={{ background: '#fff7ed' }}>
                    <Shield size={20} color="#ea580c"/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="bk-pay-name">Insurance</p>
                    <p className="bk-pay-desc">Use your health insurance coverage</p>
                  </div>
                  {paymentMethod === 'insurance' && <Check size={17} color="#2563eb" className="bk-pay-check"/>}
                </div>

                {paymentMethod === 'khalti' && (
                  <div className="bk-info info" style={{ marginTop: 4, marginBottom: 4 }}>
                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
                    <span>You'll be redirected to Khalti to complete your payment securely.</span>
                  </div>
                )}

                {/* Summary */}
                <div className="bk-sum">
                  <p className="bk-sum-title">📋 Booking Summary</p>
                  {[
                    ['Services',  `${selectedServices.length} service(s)`],
                    ['Doctor',    selectedDoctorObj?.name || '—'],
                    ['Date',      formatDate(selectedDate)],
                    ['Time',      selectedTime ? `${selectedTime} (${totalDuration} min)` : '—'],
                    ['Payment',   paymentMethod === 'khalti' ? 'Khalti' : paymentMethod ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="bk-sum-row">
                      <span className="bk-sum-key">{k}</span>
                      <span className="bk-sum-val">{v}</span>
                    </div>
                  ))}
                  <div className="bk-sum-total">
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: 22, color: '#2563eb' }}>Rs. {totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="bk-nav">
              {step > 1 && (
                <button className="bk-btn-sec" onClick={() => { setStep(step - 1); setError(''); }} disabled={loading}>
                  ← Back
                </button>
              )}
              <button
                className={`bk-btn-pri${paymentMethod === 'khalti' && step === 3 ? ' khalti' : ''}`}
                disabled={primaryDisabled}
                onClick={step === 3 ? handleConfirmAppointment : handleContinue}
              >
                {loading
                  ? (paymentMethod === 'khalti' ? 'Redirecting to Khalti…' : 'Please wait…')
                  : step === 3
                    ? (paymentMethod === 'khalti' ? ' Pay with Khalti' : '✓ Confirm Appointment')
                    : 'Continue →'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default BookingPage;