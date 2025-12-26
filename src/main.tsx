import { createRoot } from "react-dom/client";
import "./index.css";
import "./util/interceptor.ts";

import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/auth/Login.tsx";
import Pesquisar from "./util/Pesquisar.tsx";
import Home from "./pages/admin/home/Home.tsx";
import SessaoList from "./pages/admin/sessoes/SessaoList.tsx";
import AssistidoList from "./pages/admin/assistidos/AssistidoList.tsx";
import AssistidoForm from "./pages/admin/assistidos/AssistidoForm.tsx";
import ProfissionalList from "./pages/admin/profissionais/ProfissionalList.tsx";
import NotificacaoGlobal from "./components/NotificacaoGlobal.tsx";
import LoadingGlobal from "./components/LoadingGlobal.tsx";
import ProfissionalForm from "./pages/admin/profissionais/ProfissionalForm.tsx";
import SessaoForm from "./pages/admin/sessoes/SessaoForm.tsx";
import AgendaList from "./pages/admin/agendas/AgendaList.tsx";
import AgendaForm from "./pages/admin/agendas/AgendaForm.tsx";
import MemberAgenda from "./pages/member/Agenda.tsx";
import MemberSessoesList from "./pages/member/SessoesList.tsx";
import AppShell from "./components/AppShell.tsx";
import MedAgenda from "./pages/admin/medtherapy/MedAgenda.tsx";
import OcorrenciaList from "./pages/admin/ocorrencias/OcorrenciaList.tsx";
import OcorrenciaForm from "./pages/admin/ocorrencias/OcorrenciaForm.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import NotFound from "./pages/NotFound.tsx";
import DatabaseService from "./services/database/DatabaseService.ts";

// Setup auth state listener
const database = DatabaseService.getInstance();
const supabase = database.getSupabaseClient();

supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    // Supabase gerencia a limpeza da sessão automaticamente
    window.location.href = "/login";
  }
});

// Registrar Service Worker do PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Service worker registration failed
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NotificacaoGlobal />
    <LoadingGlobal />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="sessoes" element={<SessaoList />} />
          <Route path="sessoes/:id" element={<SessaoForm />} />
          <Route path="pesquisar" element={<Pesquisar />} />
          <Route path="assistidos" element={<AssistidoList />} />
          <Route path="assistidos/:id" element={<AssistidoForm />} />
          <Route path="assistidos/:id/agenda" element={<AgendaList />} />
          <Route
            path="assistidos/:id/agenda/:agendaId"
            element={<AgendaForm />}
          />
          <Route path="profissionais" element={<ProfissionalList />} />
          <Route path="profissionais/:id" element={<ProfissionalForm />} />
          <Route path="profissionais/:id/agenda" element={<AgendaList />} />
          <Route
            path="profissionais/:id/agenda/:agendaId"
            element={<AgendaForm />}
          />
          <Route path="medtherapy" element={<MedAgenda />} />
          <Route path="ocorrencias" element={<OcorrenciaList />} />
          <Route path="ocorrencias/:id" element={<OcorrenciaForm />} />
        </Route>
        <Route path="/member/:id" element={<AppShell />}>
          <Route path="agenda" element={<MemberAgenda />} />
        </Route>
        <Route path="/member" element={<AppShell />}>
          <Route path="sessoes" element={<MemberSessoesList />} />
        </Route>
      </Route>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
