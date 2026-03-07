import React, { useState } from "react";
import "./Contact.css";

// ── Icon components ──────────────────────────────────────────
function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.1 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────
const branches = [
  { name: "New Baneshwor",          phone: "01-4564444 / 01-4592136" },
  { name: "Jawalakhel Chowk",       phone: "01-5424799" },
  { name: "Radhe Radhe, Bhaktapur", phone: "01-6631035 / 01-5916050" },
  { name: "Suncity, Pepsicola",     phone: "01-5910607" },
];

// ── Contact Form ──────────────────────────────────────────────
function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your real API call:
      // const res = await axios.post("http://127.0.0.1:8000/api/contact", formData);
      await new Promise((r) => setTimeout(r, 1400)); // simulated delay
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+977 98XXXXXXXX" />
        </div>
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
      </div>

      <div className="form-group">
        <label>Message</label>
        <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="How can we help you?" required />
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

// ── Main Contact Page ─────────────────────────────────────────
export default function Contact() {
  return (
    <div>
      {/* Hero */}
      <div className="contact-hero">
        <h1>Get in Touch With Us</h1>
        <p>
          We're here to answer your questions, provide treatment details, and
          assist with appointment scheduling across all branches.
        </p>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 50" preserveAspectRatio="none" fill="#f8fafc">
            <path d="M0,50 C360,0 1080,0 1440,50 L1440,50 L0,50 Z" />
          </svg>
        </div>
      </div>

      {/* Two-column body */}
      <div className="contact-body">

        {/* LEFT — Form */}
        <div className="contact-card">
          <div className="card-head">
            <h2>Send Us a Message</h2>
            <p>We'll respond within 24 hours on business days.</p>
          </div>
          <div className="card-body">
            <ContactForm />
          </div>
        </div>

        {/* RIGHT — Info */}
        <div className="contact-card">
          <div className="card-head">
            <h2>Our Locations & Info</h2>
            <p>Find a Dentwave branch near you.</p>
          </div>
          <div className="card-body">

            {/* Branches */}
            <div className="info-section">
              <div className="info-section-title">Branch Locations</div>
              <div className="branch-list">
                {branches.map((b) => (
                  <div className="branch-item" key={b.name}>
                    <div className="branch-icon"><IconPin /></div>
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
                  <div className="contact-row-value">9807654783</div>
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-row-icon"><IconMail /></div>
                <div>
                  <div className="contact-row-label">Email</div>
                  <div className="contact-row-value">info@dentwave.com.np</div>
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-row-icon"><IconClock /></div>
                <div>
                  <div className="contact-row-label">Working Hours</div>
                  <table className="hours-table" style={{ marginTop: 6 }}>
                    <tbody>
                      <tr>
                        <td className="hours-day">Mon – Fri</td>
                        <td className="hours-time">9:00 AM – 6:00 PM</td>
                      </tr>
                      <tr>
                        <td className="hours-day">Saturday</td>
                        <td className="hours-time">10:00 AM – 3:00 PM</td>
                      </tr>
                      <tr>
                        <td className="hours-day">Sunday</td>
                        <td className="hours-time hours-closed">Closed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="info-section">
              <div className="info-section-title">Find Us on Map</div>
              <div className="map-wrap">
                <iframe
                  title="Dentwave Location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=85.3045%2C27.686%2C85.3345%2C27.706&layer=mapnik&marker=27.696%2C85.3195"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}