import { ChevronLeft, Search, UserPlus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DatabaseService from "../../../services/database/DatabaseService.ts";
import type { IProfissional } from "./IProfissional.tsx";
import BottomDialog from "../../../components/BottomDialog";
import ProfissionalCard from "./ProfissionalCard";
import { mostrarNotificacao } from "../../../util/notificacao.ts";

function ProfissionalList() {
  const navigate = useNavigate();
  const database = new DatabaseService();
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    database
      .get_profissionais()
      .then((data) => setProfissionais(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col gap-3 w-screen h-dvh p-4 bg-(--yellow)">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => navigate("/admin")}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">Profissionais</h2>
          <p className="text-sm text-neutral-600">
            {profissionais.length} cadastrados
          </p>
        </div>
        <button
          onClick={() => {
            mostrarNotificacao("Funcionalidade em desenvolvimento.", "info");
          }}
          className="absolute top-0 right-0 p-2 text-neutral-600 hover:text-green-600 transition-colors"
          title="Novo Profissional"
        >
          <UserPlus size={24} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
            onChange={async (e) => {
              const searchTerm = e.target.value;
              try {
                const data = await database.get_profissionais(searchTerm);
                setProfissionais(data);
              } catch (err) {
                console.error(err);
              }
            }}
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="p-2.5 bg-white rounded-lg border border-gray-300 text-neutral-600 hover:text-neutral-800 hover:border-gray-400 transition-colors"
          title="Filtrar"
        >
          <Filter size={20} />
        </button>
      </div>

      <ul className="h-full p-2 flex flex-col gap-3 overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-sm">
        {profissionais && profissionais.length > 0 ? (
          profissionais.map((profissional, index) => (
            <ProfissionalCard
              key={index}
              profissional={profissional}
              onClick={() => navigate(`${profissional.id}`)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <p className="text-center">Nenhum profissional encontrado.</p>
          </div>
        )}
      </ul>

      <BottomDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtros"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Status
            </label>
            <div className="flex gap-2">
              <button className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                Todos
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                Ativo
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                Inativo
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Função
            </label>
            <div className="flex gap-2 flex-wrap">
              <button className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                Todas
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                Terapeuta
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                Psicólogo
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="flex-1 py-3 rounded-lg bg-gray-200 text-neutral-700 font-medium hover:bg-gray-300 transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </BottomDialog>
    </div>
  );
}

export default ProfissionalList;
