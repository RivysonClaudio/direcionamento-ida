import { AlertCircle } from "lucide-react";

function DirecionamentoAviso() {
  return (
    <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle size={20} className="text-red-500" />
      <h2 className="text-sm font-medium text-red-700">
        1 Direcionamento pendente
      </h2>
    </div>
  );
}

export default DirecionamentoAviso;
