import type { IAgenda } from "./IAgenda.tsx";

function AgendaCard({ agenda }: { agenda: IAgenda }) {
  return (
    <li className="grid grid-cols-4 gap-2 text-center bg-(--blue) rounded-md p-2">
      <p className="col-span-4 text-center rounded-md shadow pt-1 font-semibold text-neutral-600">
        {agenda.horario}
      </p>
      <h3 className="col-span-1 text-sm text-start">Terapia:</h3>
      <div className="col-span-3 w-full overflow-x-auto">
        <h3 className="text-sm text-end pr-2 text-nowrap">{agenda.terapia}</h3>
      </div>
      <h3 className="col-span-1 text-sm text-start">Profissional:</h3>
      <h3 className="col-span-3 text-sm text-end">{agenda.profissional}</h3>
      <h3 className="col-span-1 text-sm text-start">Apoio:</h3>
      <h3 className="col-span-3 text-sm text-end">
        {agenda.apoio ? agenda.apoio : "--"}
      </h3>
    </li>
  );
}

export default AgendaCard;
