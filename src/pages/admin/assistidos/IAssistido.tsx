export interface IAssistido {
  id: string;
  status: string;
  nome: string;
  idade: number | null;
  turno: string | null;
  nivel_suporte: string | null;
  precisa_apoio: boolean | null;
  med_id: number | null;
}
