import { urlBase } from "../Config";

export default async function AtualizarEdificioPrincipal(jsonData) {
  console.log(jsonData);
  try {
    const response = await fetch(
      urlBase + `/api/v1/editar/edificio-principal/${jsonData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      }
    );
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
