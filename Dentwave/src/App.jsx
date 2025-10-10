import Header from "./components/user/components/header";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Routes>

      <Route path = "/" element = {<Header />} />

    </Routes>

    
    
    </>
      
  
  );
}

export default App;