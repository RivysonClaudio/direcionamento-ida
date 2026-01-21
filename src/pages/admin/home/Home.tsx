import Util from "../../../util/util.tsx";
import SalaOcupacaoCard from "./SalaOcupacaoCard.tsx";
import SessoesExtrasCard from "./SessoesExtrasCard.tsx";
import AgendaSemanalCard from "./AgendaSemanalCard.tsx";
import ProfissionaisDisponiveisCard from "./ProfissionaisDisponiveisCard.tsx";
import AgendaMedSyncCard from "./AgendaMedSyncCard.tsx";

function Home() {
  const user = localStorage.getItem("user")?.split(" ")[0] || "User";

  return (
    <div className="flex flex-col gap-4 h-full p-4 overflow-auto">
      <div className="relative py-2 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-neutral-600">{Util.today_date()}</p>
          <h1 className="text-2xl font-bold text-neutral-800">Olá, {user}!</h1>
        </div>
      </div>

      <div className="h-dvh overflow-auto pb-4 flex flex-col gap-4 scrollbar-hidden">
        <SessoesExtrasCard />
        <AgendaSemanalCard />
        <AgendaMedSyncCard />
        <SalaOcupacaoCard />
        <ProfissionaisDisponiveisCard />
      </div>
    </div>
  );
}
export default Home;
