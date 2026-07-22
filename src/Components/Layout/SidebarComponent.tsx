"use client";

import React, { Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import { X, Landmark } from 'lucide-react';

import GlassCard from './GlassCard';
import NavItem from './NavItem';
import { MeType } from './Type';
import { menuSidebar } from './MenuSidebar';

type Props = {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    user: MeType | null;
};

export default function SidebarComponent({ isSidebarOpen, setIsSidebarOpen, setLoading, user }: Props) {
    const pathname = usePathname();
    const currentRole = user?.role?.toLowerCase() || '';

    return (
        <aside className={`
            fixed sm:inset-y-4 sm:left-4 z-[60] w-72 h-screen py-4 pl-4 
            transform transition-transform duration-300 ease-in-out 
            lg:relative lg:inset-0 lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
        `}>
            <GlassCard className="h-full flex flex-col overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[32px]">

                {/* Tombol Tutup Mobile */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors lg:hidden rounded-full hover:bg-slate-100"
                >
                    <X size={20} />
                </button>

                {/* Header Branding Sidebar */}
                <div className='flex items-center gap-3 px-6 pt-10 pb-8'>
                    <div className="w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-green-600 to-green-700 text-white shadow-md shadow-green-600/20">
                        <Landmark size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-800 leading-none">
                            Koperasi
                        </h2>
                        <p className="text-xs font-semibold text-green-600 mt-1 truncate">
                            Syariah Simpan Pinjam
                        </p>
                    </div>
                </div>
                <nav className="w-full flex-1 overflow-hidden flex flex-col px-4">
                    <div className='h-full overflow-y-auto no-scrollbar pb-6 space-y-1.5'>
                        {/* Langsung filter dan render begitu currentRole tersedia, tanpa animasi */}
                        {menuSidebar
                            .filter((menu) => menu.role.includes(currentRole))
                            .map((menu, i) => {
                                const isOpen = menu.href === '/' + currentRole
                                    ? pathname === '/' + currentRole
                                    : pathname.startsWith(menu.href);

                                return (
                                    <NavItem
                                        key={i}
                                        icon={menu.Icon}
                                        label={menu.label}
                                        active={isOpen}
                                        parent={menu.href}
                                        setLoading={setLoading}
                                        children={menu.child}
                                        pathNameChild={menu.child ? pathname : undefined}
                                    />
                                );
                            })}
                    </div>
                </nav>

            </GlassCard>
        </aside>
    );
}