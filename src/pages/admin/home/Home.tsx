import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DirecionamentoAviso from "../../../components/DirecionamentoAviso.tsx";
import DatabaseService from "../../../services/database/DatabaseService.ts";
import Util from "../../../util/util.tsx";
import { useEffect, useState } from "react";
import type { IAssistido } from "../assistidos/IAssistido.tsx";
import type { IProfissional } from "../profissionais/IProfissional.tsx";

function Home() {
  const navigate = useNavigate();
  const database = new DatabaseService();
  const user = localStorage.getItem("user")?.split(" ")[0] || "User";
  const [assistidos, setAssistidos] = useState<IAssistido[]>([]);
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);

  useEffect(() => {
    database.get_assistidos().then((data) => setAssistidos(data));
    database.get_profissionais().then((data) => setProfissionais(data));
  }, []);

  return (
    <div className="flex flex-col gap-3 w-screen h-dvh p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <h2 className="text-center">{Util.today_date()}</h2>
        <LogOut
          onClick={() => navigate("/login")}
          className="absolute top-0 right-0 p-1 text-neutral-600 h-full"
        />
      </div>
      <div className="py-4">
        <h1 className="text-2xl font-bold text-center">Olá {user}!</h1>
      </div>
      <DirecionamentoAviso />
      <div className="h-full"></div>
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => navigate("/admin/sessoes")}
          className="col-span-2 shadow-md flex gap-4 px-4 py-2 justify-center items-center rounded-md bg-white"
        >
          <span>Sessões</span>
        </div>
        <div
          onClick={() => navigate("/admin/assistidos")}
          className="shadow-md flex gap-4 px-4 py-2 justify-center items-center rounded-md bg-white"
        >
          <span>{assistidos.length}</span>
          <span>Assistidos</span>
        </div>
        <div
          onClick={() => navigate("/admin/profissionais")}
          className="shadow-md flex gap-4 px-4 py-2 justify-center items-center rounded-md bg-white"
        >
          <span>{profissionais.length}</span>
          <span>Profissionais</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
