import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { IAssistido } from "../../pages/admin/assistidos/IAssistido";
import type { IProfissional } from "../../pages/admin/profissionais/IProfissional";
import type { IAgenda } from "../../pages/admin/agendas/IAgenda";
import type { ISessao } from "../../pages/admin/sessoes/ISessao";
import type { IMedAgenda } from "../../pages/admin/medtherapy/IMedAgenda";

class DatabaseService {
  private static instance: DatabaseService;
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

    this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: window.localStorage,
      },
    });
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
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
        role: item.role,
        observacoes: item.observacoes,
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
        med_id: item.patient_med_id,
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
        med_id: item.patient_med_id,
      };

      return result;
    }
  }

  async create_assistido(assistido: IAssistido): Promise<void> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase.from("patients").insert({
      name: assistido.nome ?? null,
      status: assistido.status ?? null,
      age: assistido.idade ?? null,
      shift: assistido.turno ?? null,
      support_level: assistido.nivel_suporte ?? null,
      helper_needed: assistido.precisa_apoio ?? null,
      patient_med_id: assistido.med_id ?? null,
      created_by: user.data.user?.id || null,
      updated_by: user.data.user?.id || null,
    });

    if (query.error) {
      throw query.error;
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
        patient_med_id: assistido.med_id,
        updated_by: user.data.user?.id || null,
      })
      .eq("id", assistido.id);

    if (query.error) {
      throw query.error;
    }
  }

  async get_profissionais(
    searchTerm: string = "",
    filter: { status?: string; shift?: string; function?: string } = {
      status: "",
      shift: "",
      function: "",
    }
  ): Promise<IProfissional[]> {
    let query = this.supabase
      .from("professionals")
      .select("*")
      .ilike("name", `%${searchTerm}%`);

    if (filter.status) query = query.eq("status", filter.status);
    if (filter.shift) query = query.eq("shift", filter.shift);
    if (filter.function) query = query.eq("function", filter.function);

    const result = await query.order("name", { ascending: true });

    if (result.error) {
      throw new Error(`Error fetching profissionais: ${result.error.message}`);
    } else {
      const data = result.data.map((item) => ({
        id: item.id,
        status: item.status,
        nome: item.name,
        funcao: item.function,
        turno: item.shift,
        role: item.role,
        observacoes: item.observation,
      })) as IProfissional[];

      return data;
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
        role: item.role,
        observacoes: item.observation,
      };

      return result;
    }
  }

  async create_profissional(profissional: IProfissional): Promise<void> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase.from("professionals").insert({
      name: profissional.nome ?? null,
      status: profissional.status ?? null,
      shift: profissional.turno ?? null,
      function: profissional.funcao ?? null,
      role: profissional.role ?? null,
      observation: profissional.observacoes ?? null,
      created_by: user.data.user?.id || null,
      updated_by: user.data.user?.id || null,
    });

    if (query.error) {
      throw query.error;
    }
  }

  async update_profissional(profissional: IProfissional): Promise<void> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase
      .from("professionals")
      .update({
        name: profissional.nome,
        status: profissional.status,
        function: profissional.funcao,
        shift: profissional.turno,
        observation: profissional.observacoes,
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
    let query = this.supabase.from("vw_schedules").select("*");

    if (column_name === "id") query = query.eq("id", column_value);
    if (column_name === "patient_id")
      query = query.eq("patient_id", column_value);
    if (column_name === "professional_id")
      query = query.or(
        `professional_id.eq.${column_value},helper_id.eq.${column_value}`
      );

    const result = await query
      .order("week_day", { ascending: true })
      .order("session_time", { ascending: true });

    if (result.error) {
      throw new Error(`Error fetching agenda: ${result.error.message}`);
    } else {
      const data = result.data.map((item) => ({
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
        sala: item.room,
      })) as IAgenda[];

      return data;
    }
  }

  async create_agenda(agenda: IAgenda): Promise<void> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase.from("schedules").insert({
      patient_id: agenda.assistido_id,
      professional_id: agenda.profissional_id || null,
      helper_id: agenda.apoio_id || null,
      week_day: agenda.dia_semana,
      session_time: agenda.horario,
      therapy: agenda.terapia,
      room: agenda.sala || null,
      created_by: user.data.user?.id || null,
      updated_by: user.data.user?.id || null,
    });

    if (query.error) {
      throw query.error;
    }
  }

  async update_agenda(agenda: IAgenda): Promise<void> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase
      .from("schedules")
      .update({
        patient_id: agenda.assistido_id,
        professional_id: agenda.profissional_id || null,
        helper_id: agenda.apoio_id || null,
        week_day: agenda.dia_semana,
        session_time: agenda.horario,
        therapy: agenda.terapia,
        room: agenda.sala || null,
        updated_by: user.data.user?.id || null,
      })
      .eq("id", agenda.id);

    if (query.error) {
      throw query.error;
    }
  }

  async delete_agenda(id: string): Promise<void> {
    const query = await this.supabase
      .from("schedules")
      .update({ is_deleted: true })
      .eq("id", id);

    if (query.error) {
      throw query.error;
    }
  }

  async get_sessoes_by_date(
    date: string,
    filter: {
      status?: string;
      patient_id?: string;
      profissional_id?: string;
      therapy?: string;
      session_time?: string;
      sala?: string | number;
    } = {
      status: "",
      patient_id: "",
      profissional_id: "",
      therapy: "",
      session_time: "",
      sala: "",
    }
  ): Promise<ISessao[]> {
    let query = this.supabase
      .from("vw_therapy_sessions")
      .select("*")
      .eq("date", date);

    if (filter.status) query = query.eq("status", filter.status);
    if (filter.patient_id) query = query.eq("patient_id", filter.patient_id);
    if (filter.profissional_id) {
      query = query.or(
        `professional_id.eq.${filter.profissional_id},helper_id.eq.${filter.profissional_id}`
      );
    }
    if (filter.therapy) query = query.eq("therapy", filter.therapy);
    if (filter.session_time)
      query = query.eq("session_time", filter.session_time);
    if (filter.sala) query = query.eq("room", filter.sala);

    const result = await query.order("session_time", { ascending: true });

    if (result.error) {
      throw new Error(`Error fetching sessao: ${result.error.message}`);
    } else {
      const data = result.data.map((item) => ({
        id: item.id,
        data: item.date,
        status: item.status,
        terapia: item.therapy,
        horario: item.session_time,
        sala: item.room,
        assistido_id: item.patient_id,
        assistido_nome: item.patient_name,
        assistido_situacao: item.patient_status,
        profissional_id: item.professional_id,
        profissional_situacao: item.professional_status,
        profissional_nome: item.professional_name,
        apoio_id: item.helper_id,
        apoio_nome: item.helper_name,
        apoio_situacao: item.helper_status,
        observacoes: item.observation,
      })) as ISessao[];

      return data;
    }
  }

  async get_sessoes_pendentes_by_date(date: string): Promise<number> {
    const query = await this.supabase
      .from("vw_therapy_sessions")
      .select("id")
      .eq("date", date)
      .eq("status", "PENDENTE");

    if (query.error) {
      throw new Error(`Error fetching sessao: ${query.error.message}`);
    } else {
      return query.data.length;
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
        sala: item.room,
        assistido_id: item.patient_id,
        assistido_nome: item.patient_name,
        assistido_situacao: item.patient_status,
        profissional_id: item.professional_id,
        profissional_situacao: item.professional_status,
        profissional_nome: item.professional_name,
        apoio_id: item.helper_id,
        apoio_nome: item.helper_name,
        apoio_situacao: item.helper_status,
        observacoes: item.observation,
      };

      return result;
    }
  }

  async create_sessao(sessao: ISessao): Promise<void> {
    const user = await this.supabase.auth.getUser();

    const query = await this.supabase.from("therapy_sessions").insert({
      date: sessao.data,
      session_time: sessao.horario,
      therapy: sessao.terapia,
      patient_id: sessao.assistido_id,
      professional_id: sessao.profissional_id || null,
      helper_id: sessao.apoio_id || null,
      status: sessao.status,
      observation: sessao.observacoes || null,
      origin: "MANUAL",
      room: sessao.sala || null,
      created_by: user.data.user?.id || null,
      updated_by: user.data.user?.id || null,
    });

    if (query.error) {
      throw query.error;
    }
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
        observation: sessao.observacoes || null,
        room: sessao.sala || null,
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

  async get_assistidos_disponiveis(
    date: string,
    session_time: string,
    searchTerm: string = ""
  ): Promise<IAssistido[]> {
    const { data, error } = await this.supabase.rpc(
      "get_therapy_available_patients",
      {
        p_date: date,
        p_session_time: session_time,
        p_search_name: searchTerm,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching assistidos disponíveis: ${error.message}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      status: item.status,
      nome: item.name,
      nivel_suporte: item.support_level,
      precisa_apoio: item.helper_needed,
      med_id: item.patient_med_id,
    })) as IAssistido[];
  }

  async get_profissionais_disponiveis(
    date: string,
    session_time: string,
    patient_id: string | null,
    searchTerm: string = ""
  ): Promise<IProfissional[]> {
    const { data, error } = await this.supabase.rpc(
      "get_therapy_available_professionals",
      {
        p_date: date,
        p_session_time: session_time,
        p_patient_id: patient_id,
        p_search_name: searchTerm,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching profissionais disponíveis: ${error.message}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      status: item.status,
      nome: item.name,
      turno: item.shift,
      funcao: item.function,
    })) as IProfissional[];
  }

  async get_profissionais_disponiveis_para_agendamento(
    week_day: number | null,
    session_time: string | null,
    searchTerm: string = ""
  ): Promise<Record<string, string>[]> {
    const { data, error } = await this.supabase.rpc(
      "available_professionals_for_scheduling",
      {
        run_week_day: week_day,
        run_session_time: session_time,
        run_search_term: searchTerm,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching profissionais disponíveis para agendamento: ${error.message}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      nome: item.name,
    })) as Record<string, string>[];
  }

  async get_medtherapy_agenda(
    searchTerm: string = "",
    status: "all" | "sync" | "only_in_app" | "only_in_med" = "all",
    shift: "all" | "morning" | "afternoon" = "all",
    page: number = 1,
    pageSize: number = 15
  ): Promise<{ data: IMedAgenda[]; total: number; hasMore: boolean }> {
    // Build query for data
    let dataQuery = this.supabase.from("vw_med_agenda_sync_aba").select("*");

    // Build query for count - select only one column to minimize data transfer
    let countQuery = this.supabase
      .from("vw_med_agenda_sync_aba")
      .select("patient_id");

    if (searchTerm) {
      const searchCondition = `patient_name.ilike.%${searchTerm}%,med_description.ilike.%${searchTerm}%`;
      dataQuery = dataQuery.or(searchCondition);
      countQuery = countQuery.or(searchCondition);
    }

    if (status !== "all") {
      dataQuery = dataQuery.eq("agenda_med_sync", status);
      countQuery = countQuery.eq("agenda_med_sync", status);
    }

    if (shift === "morning") {
      dataQuery = dataQuery.lte("session_time", "12:00");
      countQuery = countQuery.lte("session_time", "12:00");
    } else if (shift === "afternoon") {
      dataQuery = dataQuery.gt("session_time", "12:00");
      countQuery = countQuery.gt("session_time", "12:00");
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Execute both queries in parallel
    const [dataResult, countResult] = await Promise.all([
      dataQuery.order("patient_name", { ascending: true }).range(from, to),
      countQuery,
    ]);

    if (dataResult.error) {
      throw new Error(
        `Error fetching medtherapy agenda: ${dataResult.error.message}`
      );
    }

    const total = countResult.data?.length || 0;
    const hasMore = dataResult.data && dataResult.data.length === pageSize;

    return {
      data: (dataResult.data as IMedAgenda[]) || [],
      total,
      hasMore,
    };
  }

  async get_profissionais_disponiveis_by_date(
    date: string
  ): Promise<Record<string, Array<{ id: string; name: string }>>> {
    const { data, error } = await this.supabase.rpc(
      "get_available_professionals_by_time",
      {
        run_date: date,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching profissionais disponíveis: ${error.message}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data;
  }

  async get_extra_sessions_count_by_month(
    year: number,
    month: number
  ): Promise<number> {
    // Calculate start and end dates for the month
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

    const { data, error } = await this.supabase
      .from("therapy_sessions")
      .select("id", { count: "exact" })
      .eq("status", "AGENDADO")
      .gte("date", startDate)
      .lt("date", endDate)
      .like("therapy", "%(Extra)");

    if (error) {
      throw new Error(`Error fetching extra sessions count: ${error.message}`);
    }

    return data?.length || 0;
  }

  async sign_in(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    localStorage.setItem("authToken", data.session?.access_token || "");

    return data;
  }

  async sign_out() {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  async get_session() {
    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;
  }

  async get_current_user() {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return data.user;
  }

  async update_password(newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  }
}

export default DatabaseService;
