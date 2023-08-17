import { urlBase } from '../Config.js';

export default async function AtualizacaoPopulacao(jsonData) {

  try {
    const response = await fetch(urlBase + `/api/v1/editar/populacao/${jsonData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonData)
    });

    const data = await response.json();
    localStorage.setItem('populacao', JSON.stringify(data.data));
    localStorage.setItem('id', data.id);
    console.log(localStorage.getItem('id') + ' ')
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