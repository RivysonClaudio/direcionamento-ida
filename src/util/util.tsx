import type { IAgenda } from "../pages/admin/agendas/IAgenda.tsx";

export default class Util {
  static today_date(): string {
    const hoje: Date = new Date();

    return hoje.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  static week: Record<number, string> = {
    2: "Segunda-feira",
    3: "Terça-feira",
    4: "Quarta-feira",
    5: "Quinta-feira",
    6: "Sexta-feira",
  };

  static sort_agenda_by_time(agendas: IAgenda[]): IAgenda[] {
    return agendas.sort((a, b) => {
      const timeA = a.horario.split(":").map(Number);
      const timeB = b.horario.split(":").map(Number);

      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0];
      }
      return timeA[1] - timeB[1];
    });
  }

  static toProperCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      const prepositions = ["da", "de", "do", "das", "dos", "e"];
      if (prepositions.includes(txt.toLowerCase())) {
        return txt.toLowerCase();
      } else {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    });
  }
}
