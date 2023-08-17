import { urlBase } from '../../Config.js';

export default async function OpDescricaoEquipamentos() {

    try {
        const response = await fetch(urlBase + `/api/v1/options/descricao_equipamento`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        console.log(error);
        return null;
    }
}