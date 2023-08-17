import { urlBase } from "../../Config";

export default async function OpOperacaoAreaUmida() {
  try {
    const response = await fetch(
      urlBase + `/api/v1/options/operacao_area_umida`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}
