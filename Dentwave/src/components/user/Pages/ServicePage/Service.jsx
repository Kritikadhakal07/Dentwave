import React, { useEffect, useState } from "react";
import axios from "axios";

const ServicesPage = ({ onLearnMore }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/services")
      .then(r => { setServices(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const S = {
    page:    { minHeight: "100vh", background: "#f4f6fb", padding: "52px 16px" },
    wrap:    { maxWidth: 1100, margin: "0 auto" },
    hero:    { textAlign: "center", marginBottom: 48 },
    badge:   { display: "inline-block", background: "#eff3ff", color: "#4f6ef7", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, marginBottom: 16 },
    h1:      { fontSize: 36, fontWeight: 800, color: "#1a1a2e", margin: "0 0 14px" },
    sub:     { color: "#888", fontSize: 15, maxWidth: 560, margin: "0 auto" },
    grid:    { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 },
    card:    { background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" },
    img:     { width: "100%", height: 190, objectFit: "cover" },
    body:    { padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 },
    name:    { fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px" },
    desc:    { fontSize: 13, color: "#888", lineHeight: 1.65, margin: "0 0 14px", flex: 1,
               display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" },
    price:   { fontSize: 13, fontWeight: 700, color: "#4f6ef7", margin: "0 0 14px" },
    btn:     { background: "none", border: "1.5px solid #4f6ef7", color: "#4f6ef7", borderRadius: 8, padding: "8px 0", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s", width: "100%" },
    empty:   { textAlign: "center", color: "#bbb", padding: "80px 0", fontSize: 15 },
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.hero}>
        
          <h1 style={S.h1}>Our Services</h1>
          <p style={S.sub}>Explore our range of dental care services for a healthier, brighter smile.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#bbb", padding: "80px 0" }}>Loading services…</div>
        ) : services.length === 0 ? (
          <div style={S.empty}>No services available.</div>
        ) : (
          <div style={S.grid}>
            {services.map(service => (
              <div
                key={service.id}
                style={S.card}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
              >
                <img
                  src={`http://127.0.0.1:8000/storage/${service.image}`}
                  alt={service.name}
                  style={S.img}
                  onError={e => { e.target.style.background = "#eef1ff"; e.target.style.display = "block"; }}
                />
                <div style={S.body}>
                  <p style={S.name}>{service.name}</p>
                  <p style={S.desc}>{service.description}</p>
                  <p style={S.price}>{service.cost ? `From $${parseFloat(service.cost).toFixed(2)}` : "Consultation Required"}</p>
                  <button
                    style={S.btn}
                    onClick={() => onLearnMore(service)}
                    onMouseEnter={e => { e.target.style.background = "#4f6ef7"; e.target.style.color = "#fff"; }}
                    onMouseLeave={e => { e.target.style.background = "none";    e.target.style.color = "#4f6ef7"; }}
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;