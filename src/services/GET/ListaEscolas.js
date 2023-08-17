import { urlBase } from "../Config.js";

export default async function ListaEscolas(id) {
  try {
    const response = await fetch(urlBase + `/api/v1/send_frontend/escolas`);
    const data = await response.json();
    return data.return;
  } catch (error) {
    return null;
  }
}
