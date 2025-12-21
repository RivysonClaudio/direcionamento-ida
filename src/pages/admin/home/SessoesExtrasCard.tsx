import { useEffect, useState } from "react";
import DatabaseService from "../../../services/database/DatabaseService";

function SessoesExtrasCard() {
  const [extraSessionsCount, setExtraSessionsCount] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}`
  );

  useEffect(() => {
    const database = new DatabaseService();
    const [year, month] = selectedPeriod.split("-").map(Number);

    database
      .get_extra_sessions_count_by_month(year, month)
      .then((count) => setExtraSessionsCount(count))
      .catch((err) => console.error(err));
  }, [selectedPeriod]);

  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-neutral-800">
        Contagem de Sessões ABA Extras
      </h3>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-neutral-600 mb-1 block">Período</label>
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 bg-white text-sm text-neutral-700 outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs text-neutral-600 mb-1">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            {extraSessionsCount}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SessoesExtrasCard;
