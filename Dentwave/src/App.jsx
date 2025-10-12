import Footer from "./components/user/components/Footer";
import Header from "./components/user/components/Header";
import { Routes, Route } from 'react-router-dom';
import About from "./components/user/Pages/About/About";
import Contact from "./components/user/Pages/Contact/Contact";
import Login from "./components/user/Pages/Login/Login";

function App() {
  return (
    <>
    <Routes>

     {/* <Route path = "/" element = {<Header/>} />
     <Route path = "/footer" element = {<Footer/>} /> */}
      <Route path = "/about" element = {<About/>} />
      <Route path = "/contact" element = {<Contact/>} />
      <Route path = "/login" element = {<Login/>} />





    </Routes>

    
    
    </>
      
  
  );
}

export default App;