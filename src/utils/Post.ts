import Cookies from "js-cookie";
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

        // Deteksi jika Backend mengembalikan status 401 (Unauthorized)
        if (error.response?.status === 401) {

            // CEK APAKAH INI JALUR LOGIN
            const isLoginEndpoint = path.includes('login');

            // HANYA lempar user ke halaman login JIKA mereka BUKAN sedang mencoba login
            if (!isLoginEndpoint) {
                // Hapus semua state sesi agar benar-benar bersih
                Cookies.remove('token');
                Cookies.remove('user');
                Cookies.remove('role');

                // Lempar ("mental") user kembali ke halaman login
                window.location.href = '/login';
            }

            // JIKA ini adalah endpoint login, kita lewati blok ini 
            // dan biarkan catch mengembalikan error ke komponen RightSection!
        }

        // Kembalikan langsung error Axios tanpa mengubah jadi Error runtime
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}