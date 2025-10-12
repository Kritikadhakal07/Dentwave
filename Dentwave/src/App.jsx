import Footer from "./components/user/components/Footer";
import Header from "./components/user/components/Header";
import Home from "./components/user/Pages/HomePages/Home";
import DentalServicesApp from "./components/user/Pages/ServicePage/DentalServicesApp";
import { Routes, Route } from 'react-router-dom';
import About from "./components/user/Pages/About/About";
import Contact from "./components/user/Pages/Contact/Contact";
import Login from "./components/user/Pages/Login/Login";
import AdminHeader from "./components/admin/component/Header";
import AdminSidebar from "./components/admin/component/Sidebar";

function App() {
  return (
    <>
    {/* <Header /> */}
    <AdminHeader />
    


    <Routes>

     <Route path = "/" element = {<Home/>} />
     <Route path = "/service" element = {<DentalServicesApp/>} />
      <Route path = "/about" element = {<About/>} />
      <Route path = "/contact" element = {<Contact/>} />
      <Route path = "/login" element = {<Login/>} />
      <Route path = "/admin" element = {<AdminHeader/>} />
      <Route path= "/adminsidebar" element = {<AdminSidebar/>} />





    </Routes>
    <Footer />

    
    
    </>
      
  
  );
}

export default App;