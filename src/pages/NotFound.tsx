import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import logoIda from "../assets/logo_ida_img.png";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="text-center max-w-md">
        <img
          src={logoIda}
          alt="IDA"
          className="h-24 w-auto mx-auto mb-8 drop-shadow-md"
        />

        <div className="mb-6">
          <h1 className="text-8xl font-bold text-blue-200 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
            Ops! Página não encontrada
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Parece que você se perdeu. A página que você está procurando não
            existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Voltar
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center font-medium"
          >
            <Home size={20} />
            Ir para o início
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
