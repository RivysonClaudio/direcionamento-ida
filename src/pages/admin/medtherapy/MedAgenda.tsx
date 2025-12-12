import { ChevronLeft, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IMedAgenda } from "./IMedAgenda";
import DatabaseService from "../../../services/database/DatabaseService";
import { useEffect, useState } from "react";
import MedAgendaCard from "./MedAgendaCard";

function MedAgenda() {
  const navigate = useNavigate();
  const database = new DatabaseService();
  const [agendas, setAgendas] = useState<IMedAgenda[]>([]);
  const [filteredAgendas, setFilteredAgendas] = useState<IMedAgenda[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAgendas();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAgendas(agendas);
    } else {
      setFilteredAgendas(
        agendas.filter(
          (agenda) =>
            agenda.patient_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            agenda.med_description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, agendas]);

  const loadAgendas = () => {
    database
      .get_medtherapy_agenda()
      .then((data) => {
        setAgendas(data);
        setFilteredAgendas(data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col gap-3 h-full p-4">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => navigate("/admin")}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">
            Sincronização Med
          </h2>
          <p className="text-sm text-neutral-600">
            {filteredAgendas.length} agendas
          </p>
        </div>
        <button
          onClick={loadAgendas}
          className="absolute top-0 right-0 p-2 text-neutral-600 hover:text-blue-600 transition-colors"
          title="Atualizar"
        >
          <RefreshCw size={24} />
        </button>
      </div>

      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar por paciente ou descrição..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="h-full p-2 flex flex-col gap-3 overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-sm">
        {filteredAgendas && filteredAgendas.length > 0 ? (
          filteredAgendas.map((agenda, index) => (
            <MedAgendaCard key={index} agenda={agenda} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <p className="text-center">Nenhuma agenda encontrada.</p>
          </div>
        )}
      </ul>
    </div>
  );
}

export default MedAgenda;
