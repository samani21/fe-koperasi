// utils/Put.ts
import { apiClient } from "./apiClient";

export async function Put<T, D>(path: string, data: D): Promise<T> {
    try {
        const response = await apiClient.put<T>(path, data);
        return response.data;
    } catch (error: any) {
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}
