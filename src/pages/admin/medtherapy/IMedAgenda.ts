export interface IMedAgenda {
  agenda_med_id: number | null;
  patient_id: string;
  patient_name: string;
  schedule_id: string | null;
  week_day: number;
  session_time: string;
  med_description: string | null;
  agenda_med_sync: "sync" | "only_in_app" | "only_in_med";
  is_ignored: string | null;
}
