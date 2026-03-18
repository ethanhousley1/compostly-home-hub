import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, user } = useAuth();

  const isAdmin =
    isLoggedIn && user?.email?.toLowerCase() === "admin@compostly.com";

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;