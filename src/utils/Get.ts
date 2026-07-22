import Cookies from "js-cookie";
import { apiClient } from "./apiClient";
import { getToken } from "./Cookies";

export async function Get<T>(path: string): Promise<T> {
    const token = getToken();

    try {
        const response = await apiClient.get<T>(path);
        return response.data;
    } catch (error: any) {

        // Deteksi jika Backend mengembalikan status 401 (Unauthorized)
        if (error.response?.status === 401) {
            // Hapus semua state sesi agar benar-benar bersih
            Cookies.remove('token');
            Cookies.remove('user');
            Cookies.remove('role');

            // Lempar ("mental") user kembali ke halaman login
            window.location.href = '/login';

            // Hentikan eksekusi lebih lanjut
            return Promise.reject(error);
        }

        // Kembalikan langsung error Axios tanpa mengubah jadi Error runtime
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}