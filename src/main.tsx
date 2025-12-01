import { createRoot } from "react-dom/client";
import "./index.css";
import "./util/interceptor.ts";

import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/auth/Login.tsx";
import Pesquisar from "./util/Pesquisar.tsx";
import Home from "./pages/admin/home/Home.tsx";
import SessaoResumo from "./pages/admin/sessoes/SessaoResumo.tsx";
import DirecionamentoForm from "./pages/admin/sessoes/DirecionamentoForm.tsx";
import AssistidoList from "./pages/admin/assistidos/AssistidoList.tsx";
import AssistidoForm from "./pages/admin/assistidos/AssistidoForm.tsx";
import ProfissionalList from "./pages/admin/profissionais/ProfissionalList.tsx";
import Agenda from "./pages/admin/agendas/Agenda.tsx";
import NotificacaoGlobal from "./components/NotificacaoGlobal.tsx";

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
    element: <SessaoResumo />,
  },
  {
    path: "/admin/sessoes/:id",
    element: <DirecionamentoForm />,
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
    path: "admin/assistidos/agenda/:id",
    element: <Agenda />,
  },
  {
    path: "admin/profissionais",
    element: <ProfissionalList />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <NotificacaoGlobal />
    <RouterProvider router={router} />
  </>
);
