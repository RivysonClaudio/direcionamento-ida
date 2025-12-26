export interface IOcorrencia {
  id: string;
  professional_id: string | null;
  professional_nome?: string;
  type: string;
  from: string;
  to: string;
  description: string | null;
  batch_id: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: string | null;
}
