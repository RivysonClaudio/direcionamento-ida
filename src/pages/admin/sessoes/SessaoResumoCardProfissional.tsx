function SessaoResumoCardProfissional() {
  return (
    <li className="grid gap-2 bg-(--yellow) p-2 rounded-md shadow-md">
      <p className="w-full h-full flex items-center border-1 border-neutral-300 p-1 px-2 rounded-md">
        Alana Leticia
      </p>
      <ul className="flex flex-col gap-2">
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-orange-300 rounded-md col-span-1 text-center">
            13:00
          </span>
          <span className="bg-orange-300 rounded-md col-span-3 pl-2">
            Organização de Atendimento
          </span>
        </li>
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-white rounded-md col-span-1 text-center">
            13:15
          </span>
          <span className="bg-white rounded-md col-span-3 pl-2">Livre</span>
        </li>
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-(--green) rounded-md col-span-1 text-center">
            14:00
          </span>
          <span className="bg-(--green) rounded-md col-span-3 pl-2">
            Cauã Mateus
          </span>
        </li>
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-(--green) rounded-md col-span-1 text-center">
            14:45
          </span>
          <span className="bg-(--green) rounded-md col-span-3 pl-2">
            Gael Lira
          </span>
        </li>
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-(--green) rounded-md col-span-1 text-center">
            15:30
          </span>
          <span className="bg-(--green) rounded-md col-span-3 pl-2">
            Cauã Mateus
          </span>
        </li>
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-(--green) rounded-md col-span-1 text-center">
            16:15
          </span>
          <span className="bg-(--green) rounded-md col-span-3 pl-2">
            Gael Lira
          </span>
        </li>
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-white rounded-md col-span-1 text-center">
            17:00
          </span>
          <span className="bg-white rounded-md col-span-3 pl-2">Livre</span>
        </li>
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-white rounded-md col-span-1 text-center">
            17:45
          </span>
          <span className="bg-white rounded-md col-span-3 pl-2">Livre</span>
        </li>
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-purple-200 rounded-md col-span-1 text-center">
            18:30
          </span>
          <span className="bg-purple-200 rounded-md col-span-3 pl-2">
            Tita Therapy
          </span>
        </li>
        <li className="grid grid-cols-4 gap-2">
          <span className="bg-neutral-400 rounded-md col-span-1 text-center">
            19:00
          </span>
          <span className="bg-neutral-400 rounded-md col-span-3 pl-2">
            Liberado
          </span>
        </li>
      </ul>
    </li>
  );
}

export default SessaoResumoCardProfissional;
