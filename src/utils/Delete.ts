// utils/Delete.ts
import { apiClient } from "./apiClient";

export async function Delete<T = any>(path: string): Promise<T> {
    try {
        const response = await apiClient.delete<T>(path);
        return response.data;
    } catch (error: any) {
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}
