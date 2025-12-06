interface SeletorDeBotoesProps<T> {
  label?: string;
  options: T[];
  valorSelecionado: T;
  onChange: (valor: T) => void;
  formatarOpcao?: (opcao: T) => string;
}

function SeletorDeBotoes<T>({
  label,
  options,
  valorSelecionado,
  onChange,
  formatarOpcao = (opcao) => String(opcao),
}: SeletorDeBotoesProps<T>) {
  const getGridCols = () => {
    const cols: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return cols[options.length] || "grid-cols-2";
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-neutral-600">{label}</label>
      )}
      <div
        className={`grid ${getGridCols()} gap-1 p-1 bg-gray-100 rounded-lg border border-gray-300`}
      >
        {options.map((opcao, index) => (
          <button
            key={index}
            type="button"
            className={`text-sm font-medium rounded-md py-2 px-3 transition-all ${
              opcao === valorSelecionado
                ? "bg-white text-neutral-800 shadow-sm"
                : "bg-transparent text-neutral-500 hover:bg-white/50"
            }`}
            onClick={() => onChange(opcao)}
          >
            {formatarOpcao(opcao)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SeletorDeBotoes;
