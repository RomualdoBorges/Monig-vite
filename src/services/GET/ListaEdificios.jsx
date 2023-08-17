import { urlBase } from "../Config.js";

export default async function ListaEdificios(id) {
  try {
    const response = await fetch(
      urlBase + `/api/v1/send_frontend/edificios-table/${id}`
    );
    const data = await response.json();
    return data.edificios;
  } catch (error) {
    return null;
  }
}
