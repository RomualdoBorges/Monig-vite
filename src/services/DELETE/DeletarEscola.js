import { urlBase } from "../Config";

export default async function DeletarEscola(id) {
  try {
    const response = await fetch(urlBase + `/api/v1/remover/escolas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
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
