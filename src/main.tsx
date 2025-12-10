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
import ProfissionalForm from "./pages/admin/profissionais/ProfissionalForm.tsx";
import SessaoForm from "./pages/admin/sessoes/SessaoForm.tsx";
import AgendaList from "./pages/admin/agendas/AgendaList.tsx";
import AgendaForm from "./pages/admin/agendas/AgendaForm.tsx";
import MemberAgenda from "./pages/member/Agenda.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NotificacaoGlobal />
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Home />} />
      <Route path="/admin/sessoes" element={<SessaoList />} />
      <Route path="/admin/sessoes/:id" element={<SessaoForm />} />
      <Route path="/admin/pesquisar" element={<Pesquisar />} />
      <Route path="/admin/assistidos" element={<AssistidoList />} />
      <Route path="/admin/assistidos/:id" element={<AssistidoForm />} />
      <Route path="/admin/assistidos/:id/agenda" element={<AgendaList />} />
      <Route
        path="/admin/assistidos/:id/agenda/:agendaId"
        element={<AgendaForm />}
      />
      <Route path="/admin/profissionais" element={<ProfissionalList />} />
      <Route path="/admin/profissionais/:id" element={<ProfissionalForm />} />
      <Route path="/admin/profissionais/:id/agenda" element={<AgendaList />} />
      <Route
        path="/admin/profissionais/:id/agenda/:agendaId"
        element={<AgendaForm />}
      />
      <Route path="/member/:id/agenda" element={<MemberAgenda />} />
    </Routes>
  </BrowserRouter>
);
