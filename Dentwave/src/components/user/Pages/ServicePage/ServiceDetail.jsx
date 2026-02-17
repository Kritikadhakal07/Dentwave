import { Clock, DollarSign, ChevronLeft, CheckCircle, ListChecks } from "lucide-react";

const ServiceDetailsPage = ({ service, onBack, onAddToAppointment }) => {
  if (!service) {
    return (
      <div style={{ minHeight: "100vh", background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#aaa", marginBottom: 16 }}>No service selected.</p>
          <button onClick={onBack} style={{ background: "#4f6ef7", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const benefits = service.key_benefits
    ? service.key_benefits.split(",").map(b => b.trim()).filter(Boolean)
    : [];

  const steps = service.procedure_overview
    ? service.procedure_overview.split(".").map(s => s.trim()).filter(Boolean)
    : [];

  const S = {
    page:     { minHeight: "100vh", background: "#f4f6fb", padding: "40px 16px" },
    wrap:     { maxWidth: 820, margin: "0 auto" },
    backBtn:  { background: "none", border: "none", color: "#4f6ef7", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, marginBottom: 24, fontWeight: 600, fontSize: 14, padding: 0 },
    imgWrap:  { borderRadius: 20, overflow: "hidden", marginBottom: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
    img:      { width: "100%", height: 300, objectFit: "cover", display: "block" },
    card:     { background: "#fff", borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", padding: "36px 32px" },
    title:    { fontSize: 28, fontWeight: 800, color: "#1a1a2e", margin: "0 0 14px" },
    desc:     { color: "#777", lineHeight: 1.8, fontSize: 14, margin: "0 0 24px" },

    metaRow:  { display: "flex", gap: 24, flexWrap: "wrap", padding: "18px 0", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", marginBottom: 28 },
    metaItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#555" },
    metaIcon: { background: "#eff3ff", borderRadius: 8, padding: 7, display: "flex", alignItems: "center", justifyContent: "center" },

    secTitle: { fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 },
    secBlock: { marginBottom: 28 },

    benefitItem: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 14, color: "#555", lineHeight: 1.6 },

    stepItem: { display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" },
    stepNum:  { width: 26, height: 26, borderRadius: "50%", background: "#eff3ff", color: "#4f6ef7", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
    stepText: { fontSize: 14, color: "#555", lineHeight: 1.65 },

    addBtn:   { width: "100%", padding: "14px", background: "#4f6ef7", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 8, transition: "background 0.2s" },
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <button style={S.backBtn} onClick={onBack}>
          <ChevronLeft size={17}/> Back to Services
        </button>

        {/* Image */}
        <div style={S.imgWrap}>
          <img src={`http://127.0.0.1:8000/storage/${service.image}`} alt={service.name} style={S.img}/>
        </div>

        <div style={S.card}>
          <h1 style={S.title}>{service.name}</h1>
          <p style={S.desc}>{service.description}</p>

          {/* Meta row */}
          <div style={S.metaRow}>
            <div style={S.metaItem}>
              <span style={S.metaIcon}><Clock size={16} color="#4f6ef7"/></span>
              <span>Duration: <strong>{service.duration || "N/A"} min</strong></span>
            </div>
            <div style={S.metaItem}>
              <span style={S.metaIcon}><DollarSign size={16} color="#4f6ef7"/></span>
              <span>Cost: <strong>{service.cost ? `$${parseFloat(service.cost).toFixed(2)}` : "Consultation"}</strong></span>
            </div>
          </div>

          {/* Key Benefits */}
          {benefits.length > 0 && (
            <div style={S.secBlock}>
              <p style={S.secTitle}>
                <ListChecks size={17} color="#4f6ef7"/> Key Benefits
              </p>
              {benefits.map((b, i) => (
                <div key={i} style={S.benefitItem}>
                  <CheckCircle size={16} color="#4f6ef7" style={{ flexShrink: 0, marginTop: 2 }}/>
                  {b}
                </div>
              ))}
            </div>
          )}

          {/* Procedure Overview */}
          {steps.length > 0 && (
            <div style={S.secBlock}>
              <p style={S.secTitle}>
                <ListChecks size={17} color="#4f6ef7"/> Procedure Overview
              </p>
              {steps.map((step, i) => (
                <div key={i} style={S.stepItem}>
                  <span style={S.stepNum}>{i + 1}</span>
                  <p style={{ ...S.stepText, margin: 0 }}>{step}</p>
                </div>
              ))}
            </div>
          )}

          <button
            style={S.addBtn}
            onClick={() => onAddToAppointment(service)}
            onMouseEnter={e => e.target.style.background = "#3a5ce8"}
            onMouseLeave={e => e.target.style.background = "#4f6ef7"}
          >
            + Add to Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;