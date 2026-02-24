import React, { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue: #2563eb;
    --blue-dark: #1d4ed8;
    --blue-light: #dbeafe;
    --blue-pale: #eff6ff;
    --ink: #0f172a;
    --slate: #475569;
    --muted: #94a3b8;
    --border: #e2e8f0;
    --white: #ffffff;
    --success: #059669;
  }

  .contact-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f8fafc;
    color: var(--ink);
  }

  /* ── HERO ── */
  .contact-hero {
    position: relative;
    background: var(--ink);
    padding: 80px 24px 100px;
    text-align: center;
    overflow: hidden;
  }
  .contact-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 60% at 50% -10%, rgba(37,99,235,0.45) 0%, transparent 70%);
  }
  .hero-badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(37,99,235,0.15);
    border: 1px solid rgba(37,99,235,0.4);
    color: #93c5fd;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 999px;
    margin-bottom: 24px;
  }
  .hero-badge::before { content: '●'; font-size: 8px; color: #60a5fa; }
  .contact-hero h1 {
    position: relative;
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 700;
    color: var(--white);
    line-height: 1.2;
    margin-bottom: 16px;
  }
  .contact-hero h1 span { color: #60a5fa; }
  .contact-hero p {
    position: relative;
    color: #94a3b8;
    font-size: 1.05rem;
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.7;
  }
  .hero-curve {
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 60px;
  }
  .hero-curve svg { display: block; width: 100%; height: 100%; }

  /* ── GRID ── */
  .contact-body {
    max-width: 1140px;
    margin: 0 auto;
    padding: 60px 24px 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .contact-body { grid-template-columns: 1fr; padding: 40px 16px 60px; gap: 24px; }
    .contact-hero { padding: 60px 16px 80px; }
  }

  /* ── CARDS ── */
  .card {
    background: var(--white);
    border-radius: 20px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 24px rgba(15,23,42,0.06);
    overflow: hidden;
  }
  .card-header-bar {
    background: linear-gradient(135deg, var(--blue) 0%, #1e40af 100%);
    padding: 28px 32px;
  }
  .card-header-bar h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 4px;
  }
  .card-header-bar p { color: rgba(255,255,255,0.7); font-size: 0.88rem; }
  .card-inner { padding: 32px; }

  /* ── FORM ── */
  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--slate);
    margin-bottom: 7px;
  }
  .form-control {
    width: 100%;
    padding: 11px 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--ink);
    background: #f8fafc;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    resize: vertical;
  }
  .form-control:focus {
    border-color: var(--blue);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .form-control::placeholder { color: #b0bec5; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }

  .btn-submit {
    width: 100%;
    padding: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--white);
    background: linear-gradient(135deg, var(--blue), #1e40af);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-submit:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.4); }
  .btn-submit:active:not(:disabled) { transform: translateY(0); }
  .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }
  .btn-submit svg { width: 16px; height: 16px; }

  .success-msg {
    display: flex; align-items: center; gap: 10px;
    background: #ecfdf5; border: 1px solid #a7f3d0;
    color: var(--success); border-radius: 10px;
    padding: 13px 16px; font-size: 0.9rem; font-weight: 500;
    margin-top: 12px;
  }

  /* ── INFO CARD ── */
  .info-section { margin-bottom: 28px; }
  .info-section:last-child { margin-bottom: 0; }
  .info-section-title {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 14px;
  }

  .branch-list { display: flex; flex-direction: column; gap: 10px; }
  .branch-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 14px;
    background: var(--blue-pale);
    border-radius: 10px;
    border: 1px solid var(--blue-light);
  }
  .branch-icon {
    width: 32px; height: 32px; flex-shrink: 0;
    background: var(--blue); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .branch-icon svg { width: 15px; height: 15px; color: white; }
  .branch-name { font-size: 0.88rem; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
  .branch-phone { font-size: 0.82rem; color: var(--slate); }

  .contact-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .contact-row:last-child { border-bottom: none; }
  .contact-row-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    background: var(--blue-pale); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .contact-row-icon svg { width: 16px; height: 16px; color: var(--blue); }
  .contact-row-label { font-size: 0.78rem; color: var(--muted); margin-bottom: 1px; }
  .contact-row-val { font-size: 0.9rem; font-weight: 500; color: var(--ink); }

  .hours-grid {
    display: grid; grid-template-columns: auto 1fr; gap: 6px 16px;
    font-size: 0.88rem;
  }
  .hours-day { color: var(--slate); font-weight: 500; }
  .hours-time { color: var(--ink); }

  /* ── MAP ── */
  .map-wrap {
    border-radius: 12px; overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 2px 12px rgba(15,23,42,0.08);
  }
  .map-wrap iframe { display: block; width: 100%; height: 200px; border: none; }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.8s linear infinite; }
`;

const branches = [
  { name: "New Baneshwor", phone: "01-4564444 / 01-4592136" },
  { name: "Jawalakhel Chowk", phone: "01-5424799" },
  { name: "Radhe Radhe, Bhaktapur", phone: "01-6631035 / 01-5916050" },
  { name: "Suncity, Pepsicola", phone: "01-5910607" },
];

function IconLocation() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconPhone() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.1 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>;
}
function IconClock() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconMail() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
function IconSend() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
function IconCheck() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}

function Spinner() {
  return <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0110 10" /></svg>;
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulated submit — replace with real axios call
      await new Promise(r => setTimeout(r, 1400));
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-control" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+977 98XXXXXXXX" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
      </div>
      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea className="form-control" name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Tell us how we can help you…" required />
      </div>
      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? <><Spinner /> Sending…</> : <><IconSend /> Send Message</>}
      </button>
      {success && (
        <div className="success-msg">
          <IconCheck /> Thank you! We'll get back to you shortly.
        </div>
      )}
    </form>
  );
}

export default function Contact() {
  return (
    <>
      <style>{styles}</style>
      <div className="contact-root">

        {/* Hero */}
        <div className="contact-hero">
          <div className="hero-badge">Dentwave Dental Clinic</div>
          <h1>Get in Touch <span>With Us</span></h1>
          <p>Questions, treatment details, or appointment scheduling — we're here across all branches to help you smile.</p>
          <div className="hero-curve">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="#f8fafc">
              <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z"/>
            </svg>
          </div>
        </div>

        {/* Body */}
        <div className="contact-body">

          {/* Left — Form */}
          <div className="card">
            <div className="card-header-bar">
              <h2>Send Us a Message</h2>
              <p>We'll respond within 24 hours on business days.</p>
            </div>
            <div className="card-inner">
              <ContactForm />
            </div>
          </div>

          {/* Right — Info */}
          <div className="card">
            <div className="card-header-bar">
              <h2>Our Locations & Info</h2>
              <p>Plan your visit to any Dentwave branch.</p>
            </div>
            <div className="card-inner">

              {/* Branches */}
              <div className="info-section">
                <div className="info-section-title">Branch Locations</div>
                <div className="branch-list">
                  {branches.map((b) => (
                    <div className="branch-item" key={b.name}>
                      <div className="branch-icon"><IconLocation /></div>
                      <div>
                        <div className="branch-name">{b.name}</div>
                        <div className="branch-phone">{b.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact details */}
              <div className="info-section">
                <div className="info-section-title">Contact Details</div>
                <div className="contact-row">
                  <div className="contact-row-icon"><IconPhone /></div>
                  <div>
                    <div className="contact-row-label">Main Phone</div>
                    <div className="contact-row-val">9807654783</div>
                  </div>
                </div>
                <div className="contact-row">
                  <div className="contact-row-icon"><IconMail /></div>
                  <div>
                    <div className="contact-row-label">Email</div>
                    <div className="contact-row-val">info@dentwave.com.np</div>
                  </div>
                </div>
                <div className="contact-row">
                  <div className="contact-row-icon"><IconClock /></div>
                  <div style={{ width: "100%" }}>
                    <div className="contact-row-label">Working Hours</div>
                    <div className="hours-grid" style={{ marginTop: 4 }}>
                      <span className="hours-day">Mon – Fri</span><span className="hours-time">9:00 AM – 6:00 PM</span>
                      <span className="hours-day">Saturday</span><span className="hours-time">10:00 AM – 3:00 PM</span>
                      <span className="hours-day">Sunday</span><span className="hours-time">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="info-section">
                <div className="info-section-title">Find Us on Map</div>
                <div className="map-wrap">
                  <iframe
                    title="Dentwave Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=85.3045%2C27.686%2C85.3345%2C27.706&layer=mapnik&marker=27.696%2C85.3195"
                    loading="lazy"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}