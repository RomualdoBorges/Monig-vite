import { urlBase } from '../Config.js';

export default async function ListaHidrometro(id) {
    try {
        const response = await fetch(urlBase + `/api/v1/send_frontend/hidrometros-table/${id}`);
        const data = await response.json();
        return data.hidrometro;
    } catch(error) {
        return null
    }
}