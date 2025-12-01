import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DatabaseService from "../../../services/database/DatabaseService.ts";
import type { IProfissional } from "./IProfissional.tsx";

function ProfissionalList() {
  const navigate = useNavigate();
  const database = new DatabaseService();
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  useEffect(() => {
    database
      .get_profissionais()
      .then((data) => setProfissionais(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col gap-3 w-screen h-dvh p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <ChevronLeft
          onClick={() => navigate("/admin")}
          className="absolute top-0 left-0 text-neutral-600 h-full"
        />
        <h2 className="text-center">Profissionais</h2>
      </div>
      <div className="p-1">
        <input
          type="text"
          placeholder="Pesquisar"
          className="w-full text-center bg-yellow-200 rounded-md p-1 outline-none"
        />
      </div>
      <ul className="h-full p-2 flex flex-col gap-4 overflow-y-auto rounded-md bg-white">
        {profissionais && profissionais.length > 0 ? (
          profissionais.map((profissional, index) => (
            <li key={index} className="p-2 rounded-md shadow-md bg-(--yellow)">
              <div className="flex items-baseline gap-2">
                <div
                  className={`w-2 h-2 rounded-full
                        ${
                          profissional.status == "ATIVO"
                            ? "bg-(--green)"
                            : "bg-(--red)"
                        }
                    `}
                ></div>
                <p className="text-start text-base flex-1 truncate">
                  {profissional.nome}
                </p>
              </div>
              <p className="text-sm text-neutral-500">
                {profissional.funcao ? profissional.funcao : "--"}
              </p>
            </li>
          ))
        ) : (
          <p className="text-center text-neutral-500">
            Nenhum profissional encontrado.
          </p>
        )}
      </ul>
    </div>
  );
}

export default ProfissionalList;
