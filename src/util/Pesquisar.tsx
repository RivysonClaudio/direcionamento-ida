import { ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Pesquisar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const terapias: string[] = [
    "Análise do Comportamento Aplicada (ABA)",
    "Psicomotricidade (PM)",
    "Fonoaudiologia",
    "Terapia Ocupacional (TO)",
    "Fisioterapia",
    "Psicopedagogia",
    "Musicoterapia",
    "Integração Sensorial (IS)",
    "Terapia Cognitivo-Comportamental (TCC)",
    "Terapia Aquática",
  ];

  const item = searchParams.get("item");

  const direcionamentoDados = JSON.parse(
    sessionStorage.getItem("direcionamentoDados") || "{}"
  );

  function onItemClick(selectedItem: string) {
    if (item === "terapia") {
      direcionamentoDados.terapia = selectedItem;
      sessionStorage.setItem(
        "direcionamentoDados",
        JSON.stringify(direcionamentoDados)
      );
      return navigate("/admin/direcionar");
    }
    if (item === "profissional") {
      direcionamentoDados.profissional = selectedItem;
      sessionStorage.setItem(
        "direcionamentoDados",
        JSON.stringify(direcionamentoDados)
      );
      return navigate("/admin/direcionar");
    }
    if (item === "apoio") {
      direcionamentoDados.apoio = selectedItem;
      sessionStorage.setItem(
        "direcionamentoDados",
        JSON.stringify(direcionamentoDados)
      );
      return navigate("/admin/direcionar");
    }
  }

  return (
    <div className="flex flex-col gap-3 w-screen h-screen p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <ChevronLeft
          onClick={() => navigate("/admin/direcionar")}
          className="absolute top-0 left-0 text-neutral-600 h-full"
        />
        <h2>Pesquisar</h2>
      </div>
      <div className="w-full p-2">
        <input
          placeholder={`Pesquisar ${item}`}
          className="w-full bg-(--yellow-dark) rounded-md p-2"
        />
      </div>
      <ul>
        {item === "terapia" &&
          terapias.map((terapia) => (
            <li
              onClick={() => onItemClick(terapia)}
              key={terapia}
              className="p-2 border-b border-(--yellow-dark)"
            >
              {terapia}
            </li>
          ))}

        {(item === "profissional" || item === "apoio") && (
          <li
            onClick={() => onItemClick("Isadora Correia")}
            className="p-2 border-b border-(--yellow-dark)"
          >
            <p>Isadora Correia</p>
            <p className="text-sm text-neutral-500">Fisioterapeuta</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Pesquisar;
