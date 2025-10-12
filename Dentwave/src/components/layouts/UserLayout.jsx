import Header from "../user/components/Header";
import Footer from "../user/components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <Header />
      <Outlet />  {/* This renders the nested route pages */}
      <Footer />
    </>
  );
};

export default UserLayout;
