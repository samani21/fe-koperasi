"use client";

import React, { ElementType, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Lock } from 'lucide-react';

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
    isLocked?: boolean;
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
    isLocked = false
}: NavItemProps) {
    const route = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const hasChildren = Boolean(children && children.length > 0);

    useEffect(() => {
        if (isLocked) {
            setIsOpen(false);
        } else {
            setIsOpen(active);
        }
    }, [active, isLocked]);

    const handleClick = (e: React.MouseEvent) => {
        if (isLocked) {
            e.preventDefault();
            return;
        }

        if (hasChildren) {
            setIsOpen(!isOpen);
        } else {
            route.push(parent);
            setLoading(!active); // Aktifkan loading hanya jika pindah ke halaman baru
        }
    };

    // Helper untuk memastikan URL gabungan aman dari "double slash" (//)
    const resolvePath = (childHref: string) => {
        // Jika childHref sudah merupakan absolute path (misal: "/superadmin/users"), gunakan langsung.
        // Jika tidak, gabungkan dengan parent (misal parent="/superadmin", child="users" -> "/superadmin/users")
        return childHref.startsWith('/')
            ? childHref
            : `${parent}/${childHref}`.replace(/\/+/g, '/');
    };

    return (
        <div className="w-full">
            {/* Tombol Utama (Parent) */}
            <button
                onClick={handleClick}
                disabled={isLocked}
                className={`group flex items-center justify-between w-full p-3 rounded-2xl transition-all duration-300 
                    ${isLocked
                        ? 'opacity-60 cursor-not-allowed bg-slate-50/50 text-slate-400'
                        : active
                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                            : 'text-slate-500 hover:bg-green-50 hover:text-green-700'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Icon
                        size={20}
                        className={`transition-transform duration-300 
                            ${(active && !isLocked) ? 'scale-110' : ''} 
                            ${!isLocked ? 'group-hover:scale-110' : ''}
                        `}
                    />
                    <span className="font-semibold text-sm">{label}</span>
                </div>

                <div className="flex items-center gap-2">
                    {isLocked && <Lock size={14} className="text-slate-400" />}

                    {hasChildren && !isLocked && (
                        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    )}
                </div>
            </button>

            {/* Submenu (Anak) */}
            {hasChildren && !isLocked && (
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