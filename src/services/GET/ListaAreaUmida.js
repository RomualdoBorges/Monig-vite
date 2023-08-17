import { urlBase } from '../Config.js';

export default async function ListaAreaUmida(id) {
    try {
        const response = await fetch(urlBase + `/api/v1/send_frontend/area_umidas_table/${id}`);
        const data = await response.json();
        return data.area_umidas;
    } catch(error) {
        return null
    }
}