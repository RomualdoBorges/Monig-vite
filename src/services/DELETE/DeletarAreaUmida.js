import { urlBase } from '../Config.js';

export default async function DeletarAreaUmida(id) {

  try {
    const response = await fetch(urlBase + `/api/v1/remover/area-umida/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
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