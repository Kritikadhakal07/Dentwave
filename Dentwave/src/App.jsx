import Footer from "./components/user/components/Footer";
import Header from "./components/user/components/Header";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Routes>

     <Route path = "/" element = {<Header/>} />
      <Route path = "/footer" element = {<Footer/>} />


    </Routes>

    
    
    </>
      
  
  );
}

export default App;