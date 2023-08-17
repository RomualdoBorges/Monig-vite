import { urlBase } from "../Config.js";

export default async function ListaPopulacao(id) {
  try {
    const response = await fetch(
      urlBase + `/api/v1/send_frontend/populacao-table/${id}`
    );
    const data = await response.json();
    return data.populacao;
  } catch (error) {
    return null;
  }
}
