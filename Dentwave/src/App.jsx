import Footer from "./components/user/components/Footer";
import Header from "./components/user/components/Header";
import Home from "./components/user/Pages/HomePages/Home";
import Service from "./components/user/Pages/ServicePage/Service";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Header />
    <Routes>

     <Route path = "/" element = {<Home/>} />
     <Route path = "/service" element = {<Service/>} />

     
     



    </Routes>
    <Footer />

    
    
    </>
      
  
  );
}

export default App;