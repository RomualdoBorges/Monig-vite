import { urlBase } from "../Config.js";
import Cookies from "js-cookie";
export default async function AtualizarEscola(jsonData) {
  try {
    const id = Cookies.get("idEscola");
    const response = await fetch(urlBase + `/api/v1/editar/escolas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.response) {
      console.log("Dados:", error.response.data);
      console.log("Status:", error.response.status);
      console.log("Headers:", error.response.headers);
    }
    throw error;
  }
}
