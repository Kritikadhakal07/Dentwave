import { Routes, Route } from "react-router-dom";
import Home from "./components/user/Pages/HomePages/Home";
import DentalServicesApp from "./components/user/Pages/ServicePage/DentalServicesApp";
import About from "./components/user/Pages/About/About";
import Contact from "./components/user/Pages/Contact/Contact";
import Login from "./components/user/Pages/Login/Login";
import AdminDashboard from "./components/admin/pages/Adminboard";
import UserManagement from "./components/admin/pages/UserManagement";
import PatientManagement from "./components/admin/pages/PatientManagement";
import ServiceManagement from "./components/admin/pages/ServiceManagement";
import UserLayout from "./components/layouts/UserLayout"
import AdminLayout from "./components/layouts/AdminLayout";
import AppointmentManagement from "./components/admin/pages/AppointmentManagement";

function App() {
  // Manually set role for testing
  // Change this to "admin" to test admin layout
  const userRole = "admin"; // or "admin"

  return (
    <Routes>
      {/* User Routes */}
      {userRole !== "user" && (
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<DentalServicesApp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Route>
      )}

      {/* Admin Routes */}
      {userRole === "admin" && (
        <Route element={<AdminLayout />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="/patientmanagement" element={<PatientManagement />} />
          <Route path="/servicemanagement" element={<ServiceManagement />} />
          <Route path="/appointmentmanagement" element={<AppointmentManagement/>} />

          {/* Add more admin routes here */}
        </Route>
      )}
    </Routes>
  );
}


export default App;
