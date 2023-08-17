import { urlBase } from "../../Config";

export default async function OpReservatorioEdificacao(idEscola) {
  try {
    const response = await fetch(
      urlBase + `/api/v1/send_frontend/reservatorios-table/${idEscola}`
    );
    const data = await response.json();
    const nomesReservatorios = data.reservatorios.map(
      (reservatorio) => reservatorio.nome_do_reservatorio
    );
    return nomesReservatorios;
  } catch (error) {
    return null;
  }
}
