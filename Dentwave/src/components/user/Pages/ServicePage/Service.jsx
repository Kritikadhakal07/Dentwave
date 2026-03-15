import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .services-page {
    min-height: 100vh;
    background: #fafaf8;
    font-family: 'DM Sans', sans-serif;
    padding: 64px 24px 80px;
  }

  .services-wrap {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ── Hero ── */
  .services-hero {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 24px;
    margin-bottom: 56px;
    padding-bottom: 32px;
    border-bottom: 1.5px solid #e8e5de;
  }

  .services-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .services-eyebrow-line {
    width: 32px;
    height: 2px;
    background: #c8a96e;
    border-radius: 2px;
  }

  .services-eyebrow-text {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #c8a96e;
  }

  .services-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 54px);
    font-weight: 800;
    color: #1c1a14;
    line-height: 1.1;
  }

  .services-sub {
    font-size: 15px;
    color: #8a8679;
    line-height: 1.7;
    max-width: 320px;
    text-align: right;
    font-weight: 300;
  }

  /* ── Grid ── */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  /* ── Card ── */
  .service-card {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #ede9e0;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    position: relative;
  }

  .service-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(28,26,20,0.10);
    border-color: #c8a96e;
  }

  .service-card-img-wrap {
    position: relative;
    overflow: hidden;
  }

  .service-card-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
    background: #f0ece3;
  }

  .service-card:hover .service-card-img {
    transform: scale(1.04);
  }

  .service-card-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(28,26,20,0.18) 0%, transparent 60%);
    pointer-events: none;
  }

  .service-card-body {
    padding: 22px 24px 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .service-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: #1c1a14;
    margin-bottom: 10px;
    line-height: 1.3;
  }

  .service-card-desc {
    font-size: 13.5px;
    color: #8a8679;
    line-height: 1.7;
    flex: 1;
    margin-bottom: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .service-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #f0ece3;
  }

  .service-card-price {
    font-size: 14px;
    font-weight: 600;
    color: #1c1a14;
  }

  .service-card-price span {
    font-size: 11px;
    font-weight: 400;
    color: #b0ab9f;
    margin-left: 3px;
  }

  .service-card-btn {
    background: #1c1a14;
    border: none;
    color: #fafaf8;
    border-radius: 2px;
    padding: 9px 18px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .service-card-btn:hover {
    background: #c8a96e;
    color: #fff;
  }

  /* ── States ── */
  .services-loading,
  .services-empty {
    text-align: center;
    padding: 100px 0;
  }

  .services-loading-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .services-loading-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #c8a96e;
    animation: pulse 1.2s ease-in-out infinite;
  }

  .services-loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .services-loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40%            { opacity: 1;   transform: scale(1);   }
  }

  .services-loading-text,
  .services-empty-text {
    font-size: 14px;
    color: #b0ab9f;
    letter-spacing: 0.5px;
  }

  .services-empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
    display: block;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .services-page {
      padding: 40px 16px 60px;
    }

    .services-hero {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 36px;
      padding-bottom: 24px;
    }

    .services-sub {
      text-align: left;
      max-width: 100%;
    }

    .services-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .service-card-img {
      height: 220px;
    }
  }

  @media (max-width: 480px) {
    .services-h1 {
      font-size: 28px;
    }

    .service-card-body {
      padding: 18px 18px 20px;
    }

    .service-card-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .service-card-btn {
      width: 100%;
      text-align: center;
      padding: 10px;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .service-card:nth-child(3n+1):last-child {
      grid-column: 1 / -1;
      max-width: 480px;
      margin: 0 auto;
      width: 100%;
    }
  }

  /* Card entrance animation */
  .service-card {
    animation: cardIn 0.4s ease both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .service-card:nth-child(1)  { animation-delay: 0.05s; }
  .service-card:nth-child(2)  { animation-delay: 0.10s; }
  .service-card:nth-child(3)  { animation-delay: 0.15s; }
  .service-card:nth-child(4)  { animation-delay: 0.20s; }
  .service-card:nth-child(5)  { animation-delay: 0.25s; }
  .service-card:nth-child(6)  { animation-delay: 0.30s; }
`;

const ServicesPage = ({ onLearnMore }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/services")
      .then(r => { setServices(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="services-page">
        <div className="services-wrap">

          {/* ── Hero ── */}
          <header className="services-hero">
            <div>
              <div className="services-eyebrow">
                <div className="services-eyebrow-line" />
                <span className="services-eyebrow-text">Dental Care</span>
              </div>
              <h1 className="services-h1">Our Services</h1>
            </div>
            <p className="services-sub">
              Explore our range of dental care services for a healthier, brighter smile.
            </p>
          </header>

          {/* ── Content ── */}
          {loading ? (
            <div className="services-loading">
              <div className="services-loading-dots">
                <div className="services-loading-dot" />
                <div className="services-loading-dot" />
                <div className="services-loading-dot" />
              </div>
              <p className="services-loading-text">Loading services…</p>
            </div>
          ) : services.length === 0 ? (
            <div className="services-empty">
              <span className="services-empty-icon">🦷</span>
              <p className="services-empty-text">No services available at this time.</p>
            </div>
          ) : (
            <div className="services-grid">
              {services.map(service => (
                <article key={service.id} className="service-card">
                  <div className="service-card-img-wrap">
                    <img
                      src={`http://127.0.0.1:8000/storage/${service.image}`}
                      alt={service.name}
                      className="service-card-img"
                      onError={e => {
                        e.target.src = "";
                        e.target.style.background = "#f0ece3";
                      }}
                    />
                    <div className="service-card-img-overlay" />
                  </div>
                  <div className="service-card-body">
                    <h2 className="service-card-name">{service.name}</h2>
                    <p className="service-card-desc">{service.description}</p>
                    <div className="service-card-footer">
                      <p className="service-card-price">
                        {service.cost
                          ? <>${parseFloat(service.cost).toFixed(2)}<span>starting</span></>
                          : <span style={{ color: "#8a8679", fontWeight: 400 }}>Consultation required</span>
                        }
                      </p>
                      <button
                        className="service-card-btn"
                        onClick={() => onLearnMore(service)}
                      >
                        Learn More →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ServicesPage;