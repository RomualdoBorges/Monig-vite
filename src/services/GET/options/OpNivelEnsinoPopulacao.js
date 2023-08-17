import Cookies from 'js-cookie';
import { urlBase } from '../../Config.js';

export default async function OpNivelEnsinoPopulacao() {

    try {
        const response = await fetch(urlBase + `/api/v1/options/nivel_populacao/${Cookies.get("idEscola")}`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        return null;
    }
}