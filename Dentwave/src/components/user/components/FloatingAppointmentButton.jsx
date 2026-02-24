import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FloatingAppointmentButton = ({ count }) => {
  const navigate = useNavigate();

  if (count === 0) return null;

  return (
    <div
      onClick={() => navigate("/service")}
      style={{
        position:   "fixed",
        bottom:     28,
        right:      28,
        zIndex:     9999,
        background: "#4f6ef7",
        color:      "#fff",
        borderRadius: 50,
        padding:    "14px 22px",
        display:    "flex",
        alignItems: "center",
        gap:        10,
        boxShadow:  "0 6px 24px rgba(79,110,247,0.4)",
        cursor:     "pointer",
        fontWeight: 700,
        fontSize:   14,
        transition: "transform 0.2s",
        userSelect: "none",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <ShoppingBag size={18} />
      View Appointment
      {/* Count badge */}
      <span
        style={{
          background:     "#fff",
          color:          "#4f6ef7",
          borderRadius:   "50%",
          width:          22,
          height:         22,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       12,
          fontWeight:     800,
          flexShrink:     0,
        }}
      >
        {count}
      </span>
    </div>
  );
};

export default FloatingAppointmentButton;