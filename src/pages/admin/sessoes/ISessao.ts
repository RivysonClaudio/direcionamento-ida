export interface ISessao {
  id: string;
  data: string;
  status: "PENDENTE" | "AGENDADO" | "CANCELADO";
  terapia: string;
  horario: string;
  assistido_id: string;
  assistido_situacao?: string;
  assistido_nome: string;
  profissional_id?: string;
  profissional_situacao?: string;
  profissional_nome?: string;
  apoio_id?: string;
  apoio_situacao?: string;
  apoio_nome?: string;
  observacoes?: string;
}
