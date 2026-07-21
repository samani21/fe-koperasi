// utils/Post.ts
import { apiClient } from "./apiClient";
import { AxiosRequestConfig } from "axios";

export async function Post<T, D>(
    path: string,
    data: D,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const response = await apiClient.post<T>(path, data, config);
        return response.data;
    } catch (error: any) {
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}
