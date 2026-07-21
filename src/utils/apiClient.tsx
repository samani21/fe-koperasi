import axios, { AxiosInstance } from "axios";
import { getToken } from "./Cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    // headers: {
    //     "Content-Type": "application/json",
    // },
    headers: {
        'Content-Type': undefined,
    },
});

// 🔥 REQUEST INTERCEPTOR
apiClient.interceptors.request.use(async (config) => {
    const token = getToken();

    // ✅ AUTH USER
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});