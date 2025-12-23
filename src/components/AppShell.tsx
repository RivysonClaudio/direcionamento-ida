import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  MoreHorizontal,
  UserCheck,
  LogOut,
  CalendarSync,
  KeyRound,
} from "lucide-react";
import { useState, useEffect } from "react";
import BottomDialog from "./BottomDialog";
import DatabaseService from "../services/database/DatabaseService";
import { mostrarNotificacao } from "../util/notificacao";

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreDialogOpen, setIsMoreDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const database = DatabaseService.getInstance();

  const isAdmin = location.pathname.startsWith("/admin");
  const isMember = location.pathname.startsWith("/member");

  // Limpar o dia selecionado quando sair de rotas /agenda
  useEffect(() => {
    if (!location.pathname.includes("/agenda")) {
      localStorage.removeItem("agenda_selectedDay");
    }
    if (!location.pathname.includes("/sessoes")) {
      localStorage.removeItem("sessao_selectedDay");
    }
  }, [location.pathname]);

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
              setIsMoreDialogOpen(false);
              setIsChangePasswordDialogOpen(true);
            }}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 bg-white text-neutral-700 hover:bg-gray-50 transition-colors"
          >
            <KeyRound size={20} />
            <span>Alterar Senha</span>
          </button>
          <button
            onClick={async () => {
              try {
                // Tenta fazer logout no Supabase, mas continua mesmo se falhar
                await database.sign_out().catch((err) => {
                  console.warn(
                    "Supabase logout failed, proceeding anyway:",
                    err
                  );
                });
              } catch (error) {
                console.warn("Error during logout:", error);
              } finally {
                // Sempre limpa o localStorage e redireciona
                localStorage.removeItem("user");
                localStorage.removeItem("userId");
                localStorage.removeItem("userRole");
                localStorage.removeItem("authToken");
                navigate("/login");
              }
            }}
            className="flex items-center gap-3 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isChangePasswordDialogOpen}
        onClose={() => {
          setIsChangePasswordDialogOpen(false);
          setNewPassword("");
          setConfirmPassword("");
        }}
        title="Alterar Senha"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-neutral-700"
            >
              Nova Senha
            </label>
            <input
              type="password"
              id="new-password"
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              placeholder="Digite a nova senha..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-neutral-700"
            >
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirm-password"
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              placeholder="Confirme a nova senha..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            onClick={async () => {
              if (!newPassword || !confirmPassword) {
                mostrarNotificacao(
                  "Por favor, preencha todos os campos.",
                  "error"
                );
                return;
              }

              if (newPassword.length < 6) {
                mostrarNotificacao(
                  "A senha deve ter no mínimo 6 caracteres.",
                  "error"
                );
                return;
              }

              if (newPassword !== confirmPassword) {
                mostrarNotificacao("As senhas não coincidem.", "error");
                return;
              }

              try {
                await database.update_password(newPassword);
                mostrarNotificacao("Senha alterada com sucesso!", "success");
                setIsChangePasswordDialogOpen(false);
                setNewPassword("");
                setConfirmPassword("");
              } catch (error) {
                console.error(error);
                mostrarNotificacao("Erro ao alterar senha.", "error");
              }
            }}
            className="py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Alterar Senha
          </button>
        </div>
      </BottomDialog>
    </div>
  );
}

export default AppShell;
