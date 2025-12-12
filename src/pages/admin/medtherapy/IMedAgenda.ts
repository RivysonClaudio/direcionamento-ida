export interface IMedAgenda {
  agenda_med_id: number;
  patient_med_id: number;
  patient_id: string;
  patient_name: string;
  schedule_id: string | null;
  week_day: number;
  session_time: string;
  med_description: string;
  agenda_med_sync: boolean;
}
