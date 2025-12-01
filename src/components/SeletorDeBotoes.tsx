interface SeletorDeBotoesProps<T> {
  label: string;
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
  return (
    <div>
      <label className="font-medium text-neutral-400">{label}</label>
      <div
        className={`grid grid-cols-${options.length} p-1 bg-(--yellow) rounded-md border border-gray-300`}
      >
        {options.map((opcao, index) => (
          <button
            key={index}
            type="button"
            className={`text-center rounded-md p-1 ${
              opcao === valorSelecionado
                ? "bg-(--yellow-dark)"
                : "text-neutral-500"
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
