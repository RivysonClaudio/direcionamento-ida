import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import DatabaseService from "../services/database/DatabaseService";

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const database = DatabaseService.getInstance();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await database.get_session();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado, renderiza as rotas filhas
  return <Outlet />;
}

export default ProtectedRoute;
