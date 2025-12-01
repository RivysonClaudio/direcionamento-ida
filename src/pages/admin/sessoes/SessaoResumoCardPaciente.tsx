function SessaoResumoCardPaciente() {
  return (
    <li className="grid gap-2 bg-(--yellow) p-2 rounded-md shadow-md">
      <p className="w-full h-full flex items-center border-1 border-neutral-300 p-1 px-2 rounded-md">
        Nome do assistido
      </p>
      <ul className="grid grid-cols-4 gap-1 text-center">
        <li className="bg-(--red) rounded-md">13:15</li>
        <li className="bg-(--green) rounded-md">14:00</li>
        <li className="bg-(--green) rounded-md">14:45</li>
        <li className="bg-(--green) rounded-md">15:30</li>
        <li className="bg-(--green) rounded-md">16:15</li>
        <li className="bg-(--green) rounded-md">17:00</li>
        <li className="bg-(--green) rounded-md">17:45</li>
        <li className="bg-(--green) rounded-md">18:30</li>
      </ul>
    </li>
  );
}

export default SessaoResumoCardPaciente;
