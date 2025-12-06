import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { IAssistido } from "../../pages/admin/assistidos/IAssistido";
import type { IProfissional } from "../../pages/admin/profissionais/IProfissional";
import type { IAgenda } from "../../pages/admin/agendas/IAgenda";
import type { ISessao } from "../../pages/admin/sessoes/ISessao";

class DatabaseService {
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabase: SupabaseClient;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

    if (!this.supabaseKey || !this.supabaseUrl) {
      throw new Error(
        "The Supabase connection could not be established. Missing environment variables."
      );
    }

    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async get_profissional_by_userid(id: string): Promise<IProfissional | null> {
    const query = await this.supabase
      .from("professionals")
      .select("*")
      .eq("user_id", id)
      .single();

    if (query.error) {
      throw new Error(`Error fetching profissional: ${query.error.message}`);
    } else {
      const item = query.data[0];
      if (!item) return null;

      const result: IProfissional = {
        id: item.id,
        status: item.status,
        nome: item.name,
        turno: item.shift,
        funcao: item.function,
      };

      return result;
    }
  }

  async get_assistidos(
    searchTerm: string = "",
    filter: { status?: string; shift?: string; support?: string } = {
      status: "",
      shift: "",
      support: "",
    }
  ): Promise<IAssistido[]> {
    let query = this.supabase
      .from("patients")
      .select("*")
      .ilike("name", `%${searchTerm}%`);

    if (filter.status) query = query.eq("status", filter.status);
    if (filter.shift) query = query.eq("shift", filter.shift);
    if (filter.support) query = query.eq("support_level", filter.support);

    const result = await query.order("name", { ascending: true });

    if (result.error) {
      throw new Error(`Error fetching assistidos: ${result.error.message}`);
    } else {
      const data = result.data.map((item) => ({
        id: item.id,
        status: item.status,
        nome: item.name,
        nivel_suporte: item.support_level,
        precisa_apoio: item.helper_needed,
      })) as IAssistido[];

      return data;
    }
  }

  async get_assistido_by_id(id: string): Promise<IAssistido | null> {
    const query = await this.supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (query.error) {
      throw new Error(`Error fetching assistido: ${query.error.message}`);
    } else {
      const item = query.data[0];
      if (!item) return null;

      const result: IAssistido = {
        id: item.id,
        status: item.status,
        nome: item.name,
        idade: item.age,
        turno: item.shift,
        nivel_suporte: item.support_level,
        precisa_apoio: item.helper_needed,
      };

      return result;
    }
  }

  async update_assistido(assistido: IAssistido): Promise<void> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase
      .from("patients")
      .update({
        name: assistido.nome,
        status: assistido.status,
        age: assistido.idade,
        shift: assistido.turno,
        support_level: assistido.nivel_suporte,
        helper_needed: assistido.precisa_apoio,
        updated_by: user.data.user?.id || null,
      })
      .eq("id", assistido.id);

    if (query.error) {
      throw query.error;
    }
  }

  async get_profissionais(searchTerm: string = ""): Promise<IProfissional[]> {
    const query = await this.supabase
      .from("professionals")
      .select("*")
      .ilike("name", `%${searchTerm}%`)
      .order("name", { ascending: true });

    if (query.error) {
      throw new Error(`Error fetching profissionais: ${query.error.message}`);
    } else {
      const result = query.data.map((item) => ({
        id: item.id,
        status: item.status,
        nome: item.name,
        funcao: item.function,
      })) as IProfissional[];

      return result;
    }
  }

  async get_profissional_by_id(id: string): Promise<IProfissional | null> {
    const query = await this.supabase
      .from("professionals")
      .select("*")
      .eq("id", id)
      .single();

    if (query.error) {
      throw new Error(`Error fetching assistido: ${query.error.message}`);
    } else {
      const item = query.data[0];
      if (!item) return null;

      const result: IProfissional = {
        id: item.id,
        status: item.status,
        nome: item.name,
        turno: item.shift,
        funcao: item.function,
      };

      return result;
    }
  }

  async update_profissional(profissional: IProfissional): Promise<void> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase
      .from("professionals")
      .update({
        name: profissional.nome,
        status: profissional.status,
        shift: profissional.turno,
        updated_by: user.data.user?.id || null,
      })
      .eq("id", profissional.id);

    if (query.error) {
      throw query.error;
    }
  }

  async get_all_agendas_count_by_week_day(): Promise<
    Array<{ week_day: number; session_time: string; count: number }>
  > {
    const query = await this.supabase
      .from("vw_schedules_count")
      .select("*")
      .order("week_day", { ascending: true })
      .order("session_time", { ascending: true });

    if (query.error) {
      throw new Error(`Error fetching agenda counts: ${query.error.message}`);
    }

    return query.data.map((item) => ({
      week_day: item.week_day,
      session_time: item.session_time,
      count: item.count,
    }));
  }

  async get_agenda_by_id(
    column_name: string,
    column_value: string
  ): Promise<IAgenda[]> {
    const query = await this.supabase
      .from("vw_schedules")
      .select("*")
      .eq(column_name, column_value)
      .order("week_day", { ascending: true })
      .order("session_time", { ascending: true });

    if (query.error) {
      throw new Error(`Error fetching agenda: ${query.error.message}`);
    } else {
      const result = query.data.map((item) => ({
        id: item.id,
        assistido_id: item.patient_id,
        assistido: item.patient,
        profissional_id: item.professional_id,
        profissional: item.professional,
        apoio_id: item.helper_id,
        apoio: item.helper,
        dia_semana: item.week_day,
        horario: item.session_time,
        terapia: item.therapy,
      })) as IAgenda[];

      return result;
    }
  }

  async get_sessoes_by_date(date: string): Promise<ISessao[]> {
    const query = await this.supabase
      .from("vw_therapy_sessions")
      .select("*")
      .eq("date", date)
      .order("session_time", { ascending: true });

    if (query.error) {
      throw new Error(`Error fetching sessao: ${query.error.message}`);
    } else {
      const result = query.data.map((item) => ({
        id: item.id,
        data: item.date,
        status: item.status,
        terapia: item.therapy,
        horario: item.session_time,
        assistido_id: item.patient_id,
        assistido_nome: item.patient_name,
        assistido_situacao: item.patient_status,
        profissional_id: item.professional_id,
        profissional_situacao: item.professional_status,
        profissional_nome: item.professional_name,
        apoio_id: item.helper_id,
        apoio_nome: item.helper_name,
        apoio_situacao: item.helper_status,
        observacoes: item.observations,
      })) as ISessao[];

      return result;
    }
  }

  async get_sessoes_pendentes_by_date(date: string): Promise<ISessao[]> {
    const query = await this.supabase
      .from("vw_therapy_sessions")
      .select("*")
      .eq("date", date)
      .eq("status", "PENDENTE")
      .order("session_time", { ascending: true });

    if (query.error) {
      throw new Error(`Error fetching sessao: ${query.error.message}`);
    } else {
      const result = query.data.map((item) => ({
        id: item.id,
        data: item.date,
        status: item.status,
        terapia: item.therapy,
        horario: item.session_time,
        assistido_id: item.patient_id,
        assistido_nome: item.patient_name,
        assistido_situacao: item.patient_status,
        profissional_id: item.professional_id,
        profissional_situacao: item.professional_status,
        profissional_nome: item.professional_name,
        apoio_id: item.helper_id,
        apoio_nome: item.helper_name,
        apoio_situacao: item.helper_status,
        observacoes: item.observations,
      })) as ISessao[];

      return result;
    }
  }

  async get_sessao_by_id(id: string): Promise<ISessao | null> {
    const query = await this.supabase
      .from("vw_therapy_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (query.error) {
      throw new Error(`Error fetching sessao: ${query.error.message}`);
    } else {
      const item = query.data[0];
      if (!item) return null;

      const result: ISessao = {
        id: item.id,
        data: item.date,
        status: item.status,
        terapia: item.therapy,
        horario: item.session_time,
        assistido_id: item.patient_id,
        assistido_nome: item.patient_name,
        assistido_situacao: item.patient_status,
        profissional_id: item.professional_id,
        profissional_situacao: item.professional_status,
        profissional_nome: item.professional_name,
        apoio_id: item.helper_id,
        apoio_nome: item.helper_name,
        apoio_situacao: item.helper_status,
        observacoes: item.observations,
      };

      return result;
    }
  }

  async create_sessao(sessao: ISessao): Promise<string> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase
      .from("therapy_sessions")
      .insert({
        date: sessao.data,
        session_time: sessao.horario,
        therapy: sessao.terapia,
        patient_id: sessao.assistido_id,
        professional_id: sessao.profissional_id || null,
        helper_id: sessao.apoio_id || null,
        status: sessao.status,
        observations: sessao.observacoes || null,
        created_by: user.data.user?.id || null,
        updated_by: user.data.user?.id || null,
      })
      .select("id")
      .single();

    if (query.error) {
      throw query.error;
    }

    return query.data.id;
  }

  async update_sessao(sessao: ISessao): Promise<void> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase
      .from("therapy_sessions")
      .update({
        date: sessao.data,
        session_time: sessao.horario,
        therapy: sessao.terapia,
        patient_id: sessao.assistido_id,
        professional_id: sessao.profissional_id || null,
        helper_id: sessao.apoio_id || null,
        status: sessao.status,
        observations: sessao.observacoes || null,
        updated_by: user.data.user?.id || null,
      })
      .eq("id", sessao.id);

    if (query.error) {
      throw query.error;
    }
  }

  async dispatch_generat_sessao_job(
    data_sessoes: string,
    dia_semana: number
  ): Promise<number> {
    const { data, error } = await this.supabase.rpc(
      "generate_therapy_sessions",
      {
        run_date: data_sessoes,
        run_week_day: dia_semana,
      }
    );

    if (error) {
      throw error;
    }

    return data as number;
  }

  async update_sessions_on_professional_status_change(
    p_id: string,
    session_date: string
  ): Promise<number> {
    const { data, error } = await this.supabase.rpc(
      "update_sessions_on_professional_status_change",
      { p_id, session_date }
    );

    if (error) {
      throw error;
    }

    return data as number;
  }
}

export default DatabaseService;
