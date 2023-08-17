import { urlBase } from "../Config.js";

export default async function CadastroHidrometro(jsonData) {
  try {
    const response = await fetch(urlBase + "/api/v1/cadastros/hidrometros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    const data = await response.json();
    localStorage.setItem("hidrometro", JSON.stringify(data.data));
    localStorage.setItem("id_hidrometro", data.id);
    console.log(localStorage.getItem("id_hidrometro") + " ");
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
