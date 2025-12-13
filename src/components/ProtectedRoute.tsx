import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // Verifica se existe um usuário no localStorage
  const user = localStorage.getItem("user");

  // Se não autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado, renderiza as rotas filhas
  return <Outlet />;
}

export default ProtectedRoute;
