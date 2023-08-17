import { urlBase } from "../Config";

export default async function ListaReservatorio(id) {
  try {
    const response = await fetch(
      urlBase + `/api/v1/send_frontend/reservatorios-table/${id}`
    );
    const data = await response.json();
    return data.reservatorios;
  } catch (error) {
    return null;
  }
}
