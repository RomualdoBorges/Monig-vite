import { urlBase } from '../Config.js';

export default async function EdificioCadastrado(id) {
  try {
    const response = await fetch(urlBase + `/api/v1/send_frontend/edificio/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
