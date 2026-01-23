import { Outlet } from "react-router-dom";
import { RouteScrollToTop } from "@/components/RouteScrollToTop";

const RootLayout = () => {
  return (
    <>
      <RouteScrollToTop />
      <Outlet />
    </>
  );
};

export default RootLayout;
