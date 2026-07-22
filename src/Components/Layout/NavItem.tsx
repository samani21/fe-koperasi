"use client";

import React, { ElementType, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react'; // Icon Lock dihapus karena sudah tidak dipakai

// ==========================================
// TYPES & INTERFACES
// ==========================================
export interface NavChild {
    label: string;
    href: string;
}

interface NavItemProps {
    icon: ElementType;
    label: string;
    active: boolean;
    children?: NavChild[];
    parent: string;
    pathNameChild?: string;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

// ==========================================
// COMPONENT
// ==========================================
export default function NavItem({
    icon: Icon,
    label,
    active,
    children,
    parent,
    pathNameChild,
    setLoading,
}: NavItemProps) {
    const route = useRouter();

    // Inisialisasi state langsung dari props 'active' untuk mencegah UI berkedut saat refresh
    const [isOpen, setIsOpen] = useState<boolean>(active);
    const hasChildren = Boolean(children && children.length > 0);

    // Pantau perubahan dari luar, buka/tutup otomatis jika status aktif berubah
    useEffect(() => {
        setIsOpen(active);
    }, [active]);

    const handleClick = (e: React.MouseEvent) => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        } else {
            route.push(parent);
            setLoading(!active); // Aktifkan loading hanya jika pindah ke halaman baru
        }
    };

    // Helper untuk memastikan URL gabungan aman dari "double slash" (//)
    const resolvePath = (childHref: string) => {
        return childHref.startsWith('/')
            ? childHref
            : `${parent}/${childHref}`.replace(/\/+/g, '/');
    };

    return (
        <div className="w-full">
            {/* Tombol Utama (Parent) */}
            <button
                onClick={handleClick}
                className={`group flex items-center justify-between w-full p-3 rounded-2xl transition-all duration-300 
                    ${active
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                        : 'text-slate-500 hover:bg-green-50 hover:text-green-700'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Icon
                        size={20}
                        className={`transition-transform duration-300 
                            ${active ? 'scale-110' : 'group-hover:scale-110'}
                        `}
                    />
                    <span className="font-semibold text-sm">{label}</span>
                </div>

                <div className="flex items-center gap-2">
                    {hasChildren && (
                        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    )}
                </div>
            </button>

            {/* Submenu (Anak) */}
            {hasChildren && (
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="ml-9 flex flex-col gap-1 border-l-2 border-green-100 pl-4 py-1">
                        {children?.map((child, idx) => {
                            const childUrl = resolvePath(child.href);
                            const isActive = pathNameChild === childUrl;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        route.push(childUrl);
                                        setLoading(!isActive);
                                    }}
                                    className={`text-left py-2 px-2 rounded-lg text-xs font-medium transition-colors ${isActive
                                        ? 'text-green-600 bg-green-50'
                                        : 'text-slate-400 hover:text-green-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {child.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}