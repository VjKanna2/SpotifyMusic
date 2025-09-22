import axios from "axios"
import { BASE_URL } from "./Urls"
import { ForceLogout } from "./AuthHandlers";

const API = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

const refreshToken = async () => {
    try {
        const response = await API.post('auth/token')
        if (response.data?.Status == 'Token Refreshed') {
            return true;
        }
    } catch (error) {
        console.error('Error while refreshing token :', error);
        ForceLogout();
    }
}

export const GET = async (url) => {
    try {
        const response = await API.get(url);
        if (response.data.Status == "Token Expired") {
            const refresh = await refreshToken()
            if (refresh) {
                const response = await API.get(url);
                return { result: response, error: null }
            }
        }
        return { result: response, error: null }
    } catch (error) {
        return { result: null, error: error }
    }
}

export const POST = async (url, payload) => {
    try {
        const response = await API.post(url, payload);
        if (response.data.Status == "Token Expired") {
            const refresh = await refreshToken()
            if (refresh) {
                const response = await API.post(url, payload);
                return { result: response, error: null }
            }
        }
        return { result: response, error: null }
    } catch (error) {
        return { result: null, error: error }
    }
}