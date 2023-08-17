import { urlBase } from '../Config.js';

export default async function CadastroEscola(jsonData) {

  try {
    
    const response = await fetch(urlBase + "/api/v1/cadastros/escolas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return false;
  }
}
