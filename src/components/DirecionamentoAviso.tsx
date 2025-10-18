import { useNavigate } from "react-router-dom";

function DirecionamentoAviso() {
  const navigate = useNavigate();

  return (
    <div className="p-3 rounded-md shadow-neutral-500 shadow-md bg-(--red)">
      <div className="flex items-center justify-center gap-2 p-2 pb-3">
        <div className="w-5 h-5 rounded-full bg-red-500 border-4 border-red-400"></div>
        <p>1 Direcionamento pendente</p>
      </div>
      <button
        onClick={() => navigate("/admin/direcionamento-lista")}
        className="w-full p-2 rounded-md bg-red-400"
      >
        Direcionar
      </button>
    </div>
  );
}

export default DirecionamentoAviso;
