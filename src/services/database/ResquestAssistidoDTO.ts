export interface RequestAssistidoDTO {
  id: string;
  name: string;
  status: string;
  age: number;
  shift: string;
  support_level: string;
  helper_needed: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}
