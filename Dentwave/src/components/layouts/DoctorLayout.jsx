
import { Outlet } from "react-router-dom";
import Doctorsidebar from "../doctor/component/Doctorsidebar";
import Profilebar from "../doctor/component/Profilebar";

const DoctorLayout = () => {
  return (
    <div style={{ display: "flex" }}>
     <Doctorsidebar/>
      <div style={{ flex: 1 }}>
       <Profilebar/>
        <Outlet />
       
      </div>
    </div>
  );
};

export default DoctorLayout;
