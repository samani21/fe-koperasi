"use client";
import { usePathname } from "next/navigation";

export const useCorrectPath = () => {
    const pathname = usePathname();
    const getCorrectPath = (targetPath: string) => {
        // Bersihkan path target (contoh: menukar //profil menjadi /profil)
        const cleanPath = `/${targetPath}`.replace(/\/+/g, '/');

        // JIKA TANPA SUBDOMAIN (cth: localhost:3000/member/profil)
        // Deteksi dari pathname saat ini untuk menyisipkan prefix otomatis
        if (pathname?.startsWith('/member') && !cleanPath.startsWith('/member')) {
            return `/member${cleanPath === '/' ? '' : cleanPath}`;
        }
        if (pathname?.startsWith('front-office') && !cleanPath.startsWith('front-office')) {
            return `front-office${cleanPath === '/' ? '' : cleanPath}`;
        }
        if (pathname?.startsWith('/superadmin') && !cleanPath.startsWith('/superadmin')) {
            return `/superadmin${cleanPath === '/' ? '' : cleanPath}`;
        }

        return cleanPath;
    };

    return { getCorrectPath };
};