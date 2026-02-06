import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useRouteTheme() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = ["/login", "/register"].includes(location.pathname);
  const isSystemRoute = isAdminRoute || isAuthRoute;

  useEffect(() => {
    const activeMode = isSystemRoute ? "admin-mode" : "landing-mode";
    const inactiveMode = isSystemRoute ? "landing-mode" : "admin-mode";

    document.body.classList.add(activeMode);
    document.body.classList.remove(inactiveMode);

    document.documentElement.setAttribute(
      "data-view-mode",
      isSystemRoute ? "admin" : "landing",
    );
  }, [isSystemRoute]);

  return { isSystemRoute, isAdminRoute, isAuthRoute };
}
