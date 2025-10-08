import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_API_URL}/api`,
    withCredentials: true,
});

export const getRequest = (route) => API.get(route);
export const postRequest = (route, data) => API.post(route, data);
export const putRequest = (route, data) => API.put(route, data);
export const patchRequest = (route) => API.patch(route);
export const deleteRequest = (route) => API.delete(route);

export const logoutRequest = (route) => API.post(route);