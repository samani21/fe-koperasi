// utils/Get.ts
import { apiClient } from "./apiClient";
import { getToken } from "./Cookies";

export async function Get<T>(path: string): Promise<T> {
    const token = getToken();
    try {
        const response = await apiClient.get<T>(path);
        return response.data;
    } catch (error: any) {
        // Jika token tidak ada, auto logout
        // if (!token) {
        //     window.location.href = '/auth/login';
        //     return Promise.reject(error);
        // }

        // Kembalikan langsung error Axios tanpa mengubah jadi Error runtime
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}
