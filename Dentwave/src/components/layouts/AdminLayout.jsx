import AdminHeader from "../admin/component/Header";
import AdminSidebar from "../admin/component/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <AdminHeader />
        <Outlet />
       
      </div>
    </div>
  );
};

export default AdminLayout;
