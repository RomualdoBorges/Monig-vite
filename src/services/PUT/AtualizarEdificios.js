import { urlBase } from '../Config.js';

export default async function AtualizarEdificio(jsonData) {

  try {
    const response = await fetch(urlBase + `/api/v1/editar/edificios/${jsonData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonData)
    });

    const data = await response.json();
    localStorage.setItem('edificio', JSON.stringify(data.data));
    localStorage.setItem('id_edificio', data.data.id);
    console.log(localStorage.getItem('id_edificio') + ' ')
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
