import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  MoreHorizontal,
  UserCheck,
  LogOut,
  CalendarSync,
} from "lucide-react";
import { useState } from "react";
import BottomDialog from "./BottomDialog";

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreDialogOpen, setIsMoreDialogOpen] = useState(false);

  const isAdmin = location.pathname.startsWith("/admin");
  const isMember = location.pathname.startsWith("/member");

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  // Extrair ID do profissional da rota /member/:id/agenda
  const getMemberId = () => {
    // eslint-disable-next-line no-useless-escape
    const match = location.pathname.match(/\/member\/([^\/]+)/);
    return match ? match[1] : "";
  };

  return (
    <div className="flex flex-col w-screen h-dvh bg-(--yellow)">
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

      <nav className="flex justify-around items-center bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
        {isAdmin && (
          <>
            <button
              onClick={() => navigate("/admin")}
              className={`flex flex-col items-center gap-1 py-3 flex-1 transition-colors ${
                isActive("/admin")
                  ? "text-blue-600"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              <Home size={20} />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => navigate("/admin/sessoes")}
              className={`flex flex-col items-center gap-1 py-3 flex-1 transition-colors ${
                isActive("/admin/sessoes")
                  ? "text-blue-600"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              <Calendar size={20} />
              <span className="text-xs font-medium">Sessões</span>
            </button>

            <button
              onClick={() => navigate("/admin/assistidos")}
              className={`flex flex-col items-center gap-1 py-3 flex-1 transition-colors ${
                isActive("/admin/assistidos")
                  ? "text-blue-600"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              <Users size={20} />
              <span className="text-xs font-medium">Assistidos</span>
            </button>

            <button
              onClick={() => setIsMoreDialogOpen(true)}
              className="flex flex-col items-center gap-1 py-3 flex-1 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              <MoreHorizontal size={20} />
              <span className="text-xs font-medium">Mais</span>
            </button>
          </>
        )}

        {isMember && (
          <>
            <button
              onClick={() => navigate(`/member/${getMemberId()}/agenda`)}
              className={`flex flex-col items-center gap-1 py-3 flex-1 transition-colors ${
                isActive("/member")
                  ? "text-blue-600"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              <Calendar size={20} />
              <span className="text-xs font-medium">Agenda</span>
            </button>

            <button
              onClick={() => setIsMoreDialogOpen(true)}
              className="flex flex-col items-center gap-1 py-3 flex-1 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              <MoreHorizontal size={20} />
              <span className="text-xs font-medium">Mais</span>
            </button>
          </>
        )}
      </nav>

      <BottomDialog
        isOpen={isMoreDialogOpen}
        onClose={() => setIsMoreDialogOpen(false)}
        title="Mais Opções"
      >
        <div className="flex flex-col gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => {
                  navigate("/admin/profissionais");
                  setIsMoreDialogOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 bg-white text-neutral-700 hover:bg-gray-50 transition-colors"
              >
                <UserCheck size={20} />
                <span>Profissionais</span>
              </button>
              <button
                onClick={() => {
                  navigate("/admin/medtherapy");
                  setIsMoreDialogOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 bg-white text-neutral-700 hover:bg-gray-50 transition-colors"
              >
                <CalendarSync size={20} />
                <span>Sincronização de Agenda Med</span>
              </button>
            </>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="flex items-center gap-3 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </BottomDialog>
    </div>
  );
}

export default AppShell;
