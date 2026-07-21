"use client";
import { Bell, ChevronDown, LogOut, Menu, Settings, User, ShieldCheck, AlertCircle, User2 } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import GlassCard from './GlassCard';
import { usePathname } from 'next/navigation';
import { MeType } from './Type';

type Props = {
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    handleLogout: () => void;
    user: MeType | null;
}

const Header = ({
    setIsSidebarOpen,
    handleLogout, user
}: Props) => {
    const [profileOpen, setProfileOpen] = useState(false);

    const profileContainerRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [statusAnggota, setStatusAnggota] = useState<'aktif' | 'nonaktif'>('nonaktif');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setStatusAnggota(user?.is_active ? 'aktif' : 'nonaktif')
    }, [user])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileContainerRef.current && !profileContainerRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumb = segments.map((seg, index) => {
        if (index === 0) return "Home";
        return seg.charAt(0).toUpperCase() + seg.slice(1);
    });

    const renderStatusBadge = () => {
        if (statusAnggota === 'nonaktif') {
            return (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1">
                    <AlertCircle size={10} className="stroke-[3]" />
                    <span>Non-Aktif</span>
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-green-50 text-green-700 border border-green-200 shadow-sm">
                <ShieldCheck size={12} className="text-green-600" />
                <span className="tracking-wide uppercase text-[8px]">Aktif</span>
            </span>
        );
    };

    return (
        <div className={`fixed lg:absolute w-full lg:pr-4 lg:top-4 z-50`}>
            <GlassCard className="py-2.5 px-5 flex items-center justify-between gap-4">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2.5 bg-green-50 text-green-700 rounded-xl lg:hidden hover:bg-green-100 transition-all active:scale-95"
                >
                    <Menu size={20} />
                </button>

                <nav className="hidden lg:block text-sm">
                    <ol className="flex items-center text-slate-500">
                        {breadcrumb.map((p, i) => (
                            <li key={i} className="flex items-center">
                                <a href="#" className={`${i === breadcrumb.length - 1 ? 'font-semibold text-green-700 drop-shadow-sm' : 'font-medium text-slate-400'} hover:text-green-600 transition-colors`}>{p}</a>
                                {i < breadcrumb.length - 1 && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mx-2.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="flex items-center gap-3">
                    <div className="h-8 w-[1px] bg-slate-200/80 mx-1 hidden sm:block"></div>

                    {isLoading ? (
                        <div className="flex items-center gap-3 pl-1">
                            <div className="text-right hidden sm:flex flex-col items-end gap-2">
                                <div className="h-3 w-14 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
                                <div className="h-4 w-20 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-md"></div>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer"></div>
                        </div>
                    ) : (
                        <div ref={profileContainerRef} className="relative">
                            <div
                                className="flex items-center gap-3 pl-1 group cursor-pointer select-none"
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <div className="text-right ">
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-green-700 transition-colors flex items-center justify-end gap-1">
                                        {user?.name} <ChevronDown size={12} className={`text-slate-400 group-hover:text-green-600 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                    </p>
                                    <div className="mt-1 flex justify-end">
                                        {renderStatusBadge()}
                                    </div>
                                </div>

                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 relative ${statusAnggota === 'nonaktif'
                                    ? 'bg-rose-100 text-rose-500 border border-rose-200'
                                    : 'bg-gradient-to-tr from-green-600 to-green-700 text-white shadow-[0_4px_12px_rgba(22,163,74,0.2)] group-hover:shadow-[0_4px_16px_rgba(22,163,74,0.3)]'
                                    }`}>
                                    <User2 size={20} />
                                </div>
                            </div>

                            {profileOpen && (
                                <div className="absolute top-14 right-0 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] w-60 z-100 overflow-hidden transform origin-top-right transition-all">
                                    <div className="px-4 py-3.5 border-b border-slate-50 bg-slate-50/40">
                                        <p className="font-bold text-xs text-slate-800">{user?.name}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{user?.email || user?.nik}</p>
                                    </div>
                                    <div className="p-1">
                                        <button className="flex items-center w-full px-3 py-2 text-xs text-slate-600 hover:text-green-700 hover:bg-green-50/50 rounded-xl transition-all">
                                            <User className="w-4 h-4 mr-2.5 text-slate-400" /> Profil Saya
                                        </button>
                                        <button className="flex items-center w-full px-3 py-2 text-xs text-slate-600 hover:text-green-700 hover:bg-green-50/50 rounded-xl transition-all">
                                            <Settings className="w-4 h-4 mr-2.5 text-slate-400" /> Pengaturan
                                        </button>
                                        <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                                        <button className="flex items-center w-full px-3 py-2 text-xs text-rose-500 hover:bg-rose-50/60 rounded-xl transition-all font-medium" onClick={handleLogout}>
                                            <LogOut className="w-4 h-4 mr-2.5 text-rose-400" /> Keluar Aplikasi
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    )
}

export default Header