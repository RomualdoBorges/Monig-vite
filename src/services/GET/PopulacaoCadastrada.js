import { urlBase } from '../Config.js';

export default async function PopulacaoCadastrada(id) {

    try {
        const response = await fetch(urlBase + `/api/v1/send_frontend/populacao/${id}`);
        const data = await response.json();
        return data.populacao;
    } catch ( error ) {
        console.log(error);
        return null;
    }
}