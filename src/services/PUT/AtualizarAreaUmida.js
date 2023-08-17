import { urlBase } from "../Config.js";
import Cookies from "js-cookie";

export default async function AtualizarAreaUmida(jsonData) {
  console.log(jsonData)
  try {
    const id = Cookies.get("idAreaUmida");
    const response = await fetch(urlBase + `/api/v1/editar/area-umida/${id}`, {
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
