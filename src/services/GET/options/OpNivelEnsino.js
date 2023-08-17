import { urlBase } from '../../Config.js';

export default async function OpNivelEnsino() {

    try {
        const response = await fetch(urlBase + `/api/v1/options/niveis`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        console.log(error);
        return null;
    }
}