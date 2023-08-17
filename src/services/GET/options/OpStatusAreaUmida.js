import { urlBase } from '../../Config.js';

export default async function OpStatusAreaUmida() {

    try {
        const response = await fetch(urlBase + `/api/v1/options/status_area_umida`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        return null;
    }
}