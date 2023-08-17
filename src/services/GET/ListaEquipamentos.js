import { urlBase } from '../Config.js';

export default async function ListaEquipamentos(id) {
    try {
        const response = await fetch(urlBase + `/api/v1/send_frontend/equipamentos-table/${id}`);
        const data = await response.json();
        return data.equipamentos;
    } catch(error) {
        return null
    }
}