import Footer from "./components/user/components/Footer";
import Header from "./components/user/components/Header";
import Home from "./components/user/Pages/HomePages/Home";
import DentalServicesApp from "./components/user/Pages/ServicePage/DentalServicesApp";
import { Routes, Route } from 'react-router-dom';
import About from "./components/user/Pages/About/About";

function App() {
  return (
    <>
    <Header />

    <Routes>

     {/* <Route path = "/" element = {<Header/>} />
     <Route path = "/footer" element = {<Footer/>} /> */}
     <Route path = "/about" element = {<About/>}/>
     <Route path = "/" element = {<Home/>} />
     <Route path = "/service" element = {<DentalServicesApp/>} />
    


     
     



    </Routes>
    <Footer />

    
    
    </>
      
  
  );
}

export default App;