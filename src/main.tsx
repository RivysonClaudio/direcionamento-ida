import { createRoot } from "react-dom/client";
import "./index.css";
import "./util/interceptor.ts";

import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router";
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

const router = createBrowserRouter([
  {
    path: "*",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Home />,
  },
  {
    path: "/admin/sessoes",
    element: <SessaoList />,
  },
  {
    path: "/admin/sessoes/:id",
    element: <SessaoForm />,
  },
  {
    path: "/admin/pesquisar",
    element: <Pesquisar />,
  },
  {
    path: "admin/assistidos",
    element: <AssistidoList />,
  },
  {
    path: "admin/assistidos/:id",
    element: <AssistidoForm />,
  },
  {
    path: "admin/assistidos/:id/agenda",
    element: <AgendaList />,
  },
  {
    path: "admin/assistidos/:id/agenda/:agendaId",
    element: <AgendaForm />,
  },
  {
    path: "admin/profissionais",
    element: <ProfissionalList />,
  },
  {
    path: "admin/profissionais/:id",
    element: <ProfissionalForm />,
  },
  {
    path: "/member/:id/agenda",
    element: <MemberAgenda />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NotificacaoGlobal />
    <RouterProvider router={router} />
  </BrowserRouter>
);
