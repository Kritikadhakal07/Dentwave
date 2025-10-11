import Footer from "./components/user/components/Footer";
import Header from "./components/user/components/Header";
import { Routes, Route } from 'react-router-dom';
import About from "./components/user/Pages/About/About";

function App() {
  return (
    <>
    <Routes>

     <Route path = "/" element = {<Header/>} />
     <Route path = "/footer" element = {<Footer/>} />
     <Route path = "/about" element = {<About/>}/>


    </Routes>

    
    
    </>
      
  
  );
}

export default App;