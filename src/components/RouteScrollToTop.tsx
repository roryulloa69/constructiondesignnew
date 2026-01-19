import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ensures each route navigation starts at the top of the page.
 * React Router does not reset scroll position by default.
 */
export const RouteScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
};
