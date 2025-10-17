import { Routes, Route } from "react-router-dom";
import Home from "./components/user/Pages/HomePages/Home";
import DentalServicesApp from "./components/user/Pages/ServicePage/DentalServicesApp";
import About from "./components/user/Pages/About/About";
import Contact from "./components/user/Pages/Contact/Contact";
import Login from "./components/user/Pages/Login/Login";
import Register from "./components/user/Pages/Login/Register";
import AdminDashboard from "./components/admin/pages/Adminboard";
import UserManagement from "./components/admin/pages/UserManagement";
import PatientManagement from "./components/admin/pages/PatientManagement";
import ServiceManagement from "./components/admin/pages/ServiceManagement";
import UserLayout from "./components/layouts/UserLayout"
import AdminLayout from "./components/layouts/AdminLayout";
import AppointmentManagement from "./components/admin/pages/AppointmentManagement";
import DoctorManagement from "./components/admin/pages/DoctorManagement/DoctorManagement";
import DoctorLayout from "./components/layouts/DoctorLayout";

import DoctorDashboard from "./components/doctor/pages/DoctorDashboard";

import Appointments from "./components/doctor/pages/Appointments";
import DoctorProfile from "./components/doctor/pages/DoctorProfile";

function App() {
  // Manually set role for testing
  // Change this to "admin" to test admin layout
  const userRole = "user"; // or "admin"

  return (
    <>
   
    
    
    <Routes>
      {/* User Routes */}
      {userRole === "user" && (
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<DentalServicesApp />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="/doctormanagement" element={<DoctorManagement/>} />


          {/* Add more admin routes here */}
        </Route>
      )}

       {userRole === "doctor" && (
        <Route element={<DoctorLayout/>}>
         
          <Route path="/doctordashboard" element={<DoctorDashboard/>} />
          <Route path="/appointments" element={<Appointments/>} />
          <Route path="/doctorprofile" element={<DoctorProfile/>} />



        </Route>
      )}

         
          





    </Routes>

    </>
    
  );
}


export default App;
