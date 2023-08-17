import { urlBase } from '../Config.js';

export default async function AuthTokenValid(token) {

    try {
        const response = await fetch(urlBase + `/api/v1/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
        
    } catch (error) {
        console.error(error);
        return null;
    }
}