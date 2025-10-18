import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/Login.tsx";
import Pesquisar from "./pages/Pesquisar.tsx";
import DirecinamentoDash from "./pages/DirecinamentoDash.tsx";
import DirecionamentoLista from "./pages/DirecionamentoList.tsx";
import DirecionamentoView from "./pages/DirecionamentoView.tsx";
import DirecionamentoForm from "./pages/DirecionamentoForm.tsx";

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
    element: <DirecinamentoDash />,
  },
  {
    path: "/admin/direcionamento",
    element: <DirecionamentoView />,
  },
  {
    path: "/admin/direcionamento-lista",
    element: <DirecionamentoLista />,
  },
  {
    path: "/admin/direcionar",
    element: <DirecionamentoForm />,
  },
  {
    path: "/admin/direcionar/pesquisar",
    element: <Pesquisar />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
