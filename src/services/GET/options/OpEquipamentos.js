import { urlBase } from '../../Config.js';

export default async function OpEquipamentos(areaumida) {

    try {
        const response = await fetch(urlBase + `/api/v1/options/tipo_equipamento/${areaumida}`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        console.log(error);
        return null;
    }
}