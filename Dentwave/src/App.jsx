import Footer from "./components/user/components/Footer";
import Header from "./components/user/components/Header";
import Home from "./components/user/Pages/HomePages/Home";
import DentalServicesApp from "./components/user/Pages/ServicePage/DentalServicesApp";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Header />

    <Routes>

     <Route path = "/" element = {<Home/>} />
     <Route path = "/service" element = {<DentalServicesApp/>} />
    


     
     



    </Routes>
    <Footer />

    
    
    </>
      
  
  );
}

export default App;