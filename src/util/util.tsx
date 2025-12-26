import type { IAgenda } from "../pages/admin/agendas/IAgenda.tsx";

export default class Util {
  static today_date(): string {
    const today: Date = new Date();

    const dateStr = today.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  }

  static iso_date(dayOffset: number): string {
    const date: Date = new Date();

    if (dayOffset === -1) {
      date.setDate(date.getDate() - 1);
    } else if (dayOffset === 1) {
      date.setDate(date.getDate() + 1);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${day}`;

    return isoDate;
  }

  static week: Record<number, string> = {
    2: "Segunda-feira",
    3: "Terça-feira",
    4: "Quarta-feira",
    5: "Quinta-feira",
    6: "Sexta-feira",
  };

  static week_day: number = new Date().getDay() + 1;

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

  static handleFocus(inputRef: React.RefObject<HTMLElement | null>) {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  }

  static generate_uuid(): string {
    // Fallback para ambientes onde crypto.randomUUID não está disponível
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Implementação alternativa compatível com todos os navegadores
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
