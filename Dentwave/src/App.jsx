import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import FloatingAppointmentButton from "./components/user/components/FloatingAppointmentButton";
import { useNavigate } from "react-router-dom";


// User Components
import Home from "./components/user/Pages/HomePages/Home";
import DentalServicesApp from "./components/user/Pages/ServicePage/DentalServicesApp";
import About from "./components/user/Pages/About/About";
import Contact from "./components/user/Pages/Contact/Contact";
import Login from "./components/user/Pages/Login/Login";
import Register from "./components/user/Pages/Login/Register";
import ServicesSection from "./components/user/Pages/HomePages/Services.jsx";

// Admin Components
import AdminDashboard from "./components/admin/pages/Adminboard";
import UserManagement from "./components/admin/pages/UserManagement";
import PatientManagement from "./components/admin/pages/PatientManagement";
import ServiceManagement from "./components/admin/pages/ServiceManagement";
import AppointmentManagement from "./components/admin/pages/AppointmentManagement";
import DoctorManagement from "./components/admin/pages/DoctorManagement/DoctorManagement";
import AdminProfile from "./components/admin/pages/AdminProfile";

// Doctor Components
import DoctorDashboard from "./components/doctor/pages/DoctorDashboard";
import Appointments from "./components/doctor/pages/Appointments";
import DoctorProfile from "./components/doctor/pages/DoctorProfile";

// Layouts
import UserLayout from "./components/layouts/UserLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import DoctorLayout from "./components/layouts/DoctorLayout";

// Payment
import { PaymentStatus } from './components/user/Pages/ServicePage/BookingPage.jsx';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  return <PaymentStatus onGoHome={() => navigate('/appointments')} />;
};

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  return <PaymentStatus onGoHome={() => navigate('/service')} />;
};

function App() {
  const [appointmentServices, setAppointmentServices] = useState([]);

  const addService = (service) => {
    if (!appointmentServices.find(s => s.id === service.id)) {
      setAppointmentServices(prev => [...prev, service]);
    }
  };

  const removeService = (id) => {
    setAppointmentServices(prev => prev.filter(s => s.id !== id));
  };

  const clearServices = () => setAppointmentServices([]);

  return (
    <AuthProvider>
      <FloatingAppointmentButton count={appointmentServices.length} />

      {/* ✅ ONE single Routes block — payment routes added here */}
      <Routes>

        {/* ── PAYMENT ROUTES (no layout wrapper needed) ──────── */}
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/failed"  element={<PaymentFailedPage  />} />

        {/* ── PUBLIC ROUTES ─────────────────────────────────── */}
        <Route element={<UserLayout />}>
          <Route path="/"         element={<Home />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<ServicesSection />} />
          <Route
            path="/service"
            element={
              <DentalServicesApp
                appointmentServices={appointmentServices}
                onAddService={addService}
                onRemoveService={removeService}
                onClearServices={clearServices}
              />
            }
          />
        </Route>

        {/* ── ADMIN ROUTES ───────────────────────────────────── */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admindashboard"        element={<AdminDashboard />} />
          <Route path="/usermanagement"        element={<UserManagement />} />
          <Route path="/patientmanagement"     element={<PatientManagement />} />
          <Route path="/servicemanagement"     element={<ServiceManagement />} />
          <Route path="/appointmentmanagement" element={<AppointmentManagement />} />
          <Route path="/doctormanagement"      element={<DoctorManagement />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* ── DOCTOR ROUTES ──────────────────────────────────── */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/doctordashboard" element={<DoctorDashboard />} />
          <Route path="/appointments"    element={<Appointments />} />
          <Route path="/doctorprofile"   element={<DoctorProfile />} />
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;