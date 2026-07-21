import Cookies from "js-cookie";


export const getToken = () => {
    try {
        // Pengecekan window memastikan ini hanya dieksekusi di sisi client
        if (typeof window !== "undefined") {
            const token = Cookies.get("token");
            return token ? token : null;
        }
        return null;
    } catch (e) {
        // console.error("Error getting token from cookies:", e);
        return null;
    }
};