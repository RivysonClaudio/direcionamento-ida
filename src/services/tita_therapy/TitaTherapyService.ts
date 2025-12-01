class TitaTherapyService {
  private titaApiTitaUrl: string;
  private titaApiTokenKey: string;

  constructor() {
    this.titaApiTitaUrl = import.meta.env.VITE_TITA_URL;
    this.titaApiTokenKey = import.meta.env.VITE_TITA_TOKEN;

    if (!this.titaApiTitaUrl || !this.titaApiTokenKey) {
      throw new Error(
        "The Tita API connection could not be established. Missing environment variables."
      );
    }
  }

  getPatientsByPage(page: number = 1): Promise<Response> {
    return fetch(
      `${this.titaApiTitaUrl}?page=${page}&token=${this.titaApiTokenKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // async function cadastrar_assistido_no_supabase() {
  //   const tita_therapy_service = new TitaTherapyService();

  //   let current_page = 1;
  //   let total_pages = 1;

  //   do {
  //     const response = await tita_therapy_service.getPatientsByPage(
  //       current_page
  //     );
  //     const data = await response.json();

  //     data.favorecidos.forEach((assistido: IAssistido) => {
  //       database.set_assistido(assistido).catch((err) => console.error(err));
  //     });

  //     total_pages = data.total_pages;
  //     current_page++;
  //   } while (current_page <= total_pages);
  // }
}

export default TitaTherapyService;
