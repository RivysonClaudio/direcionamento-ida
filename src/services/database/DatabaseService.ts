import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { IAssistido } from "../../pages/admin/assistidos/IAssistido";
import type { IProfissional } from "../../pages/admin/profissionais/IProfissional";

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
        funcao: item.function,
      };

      return result;
    }
  }

  async get_assistidos(): Promise<IAssistido[]> {
    const query = await this.supabase
      .from("patients")
      .select("*")
      .order("name", { ascending: true });

    if (query.error) {
      throw new Error(`Error fetching assistidos: ${query.error.message}`);
    } else {
      const result = query.data.map((item) => ({
        id: item.id,
        status: item.status,
        nome: item.name,
        nivel_suporte: item.support_level,
        precisa_apoio: item.helper_needed,
      })) as IAssistido[];

      return result;
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

  async get_profissionais(): Promise<IProfissional[]> {
    const query = await this.supabase
      .from("professionals")
      .select("*")
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
}

export default DatabaseService;
