export interface IAgenda {
  id: string;
  assistido_id: string;
  assistido: string;
  profissional_id: string;
  profissional: string;
  apoio_id: string | null;
  apoio: string | null;
  terapia: string;
  dia_semana: number;
  horario: string;
}
