import { urlBase } from "../Config.js";

export default async function HidrometroCadastrado(id) {
  try {
    const response = await fetch(
      urlBase + `/api/v1/send_frontend/hidrometro/${id}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
