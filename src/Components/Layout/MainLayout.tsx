"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

import Header from './Header';
import { Get } from '@/utils/Get';
import { MeType } from './Type';
import SidebarComponent from './SidebarComponent';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface Props {
    children: React.ReactNode;
    page?: string;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function MainLayout({ children, page }: Props) {
    const pathname = usePathname();

    // --- UI States & Refs ---
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isMobileActionMenuOpen, setIsMobileActionMenuOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<MeType | null>(null);

    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const mobileBtnRef = useRef<HTMLButtonElement>(null);

    // --- Helpers ---
    const closeMobileActionMenu = () => setIsMobileActionMenuOpen(false);

    // ==========================================
    // AUTH & ROUTING LOGIC
    // ==========================================
    const handleLogout = useCallback(() => {
        setLoading(true);
        Cookies.remove('token', { path: '/' });
        Cookies.remove('user', { path: '/' });
        Cookies.remove('role', { path: '/' });
        window.location.href = '/login';
    }, []);

    const enforceRoleAccess = useCallback((userRole: string) => {
        if (!userRole) return false;

        const role = userRole.toLowerCase();
        let expectedPath = '/member';

        if (role === 'superadmin' || role === 'admin') {
            expectedPath = '/superadmin';
        } else if (role === 'frontoffice' || role === 'fo') {
            expectedPath = '/front-office';
        }

        if (!pathname.startsWith(expectedPath)) {
            window.location.href = expectedPath;
            return false;
        }

        return true;
    }, [pathname]);

    const getMe = useCallback(async () => {
        try {
            const res = await Get<{ success: boolean; data: MeType }>('auth/me');

            if (res?.data) {
                Cookies.set('user', JSON.stringify(res.data), { expires: 1, path: '/' });
                Cookies.set('role', res.data.role, { expires: 1, path: '/' });

                if (enforceRoleAccess(res.data.role)) {
                    setUser(res.data);
                    setLoading(false);
                }
            } else {
                handleLogout();
            }
        } catch (error) {
            handleLogout();
        }
    }, [handleLogout, enforceRoleAccess]);

    // ==========================================
    // EFFECTS
    // ==========================================
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                isMobileActionMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                mobileBtnRef.current &&
                !mobileBtnRef.current.contains(event.target as Node)
            ) {
                setIsMobileActionMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isMobileActionMenuOpen]);

    useEffect(() => {
        const token = Cookies.get('token');
        const userCookie = Cookies.get('user');

        if (!token) {
            handleLogout();
            return;
        }

        if (token && !userCookie) {
            getMe();
            return;
        }

        try {
            const parsedUser = JSON.parse(userCookie as string);
            const role = parsedUser.role || Cookies.get('role');

            if (role && enforceRoleAccess(role)) {
                setUser(parsedUser);
                setLoading(false);
            }
        } catch (error) {
            handleLogout();
        }
    }, [getMe, handleLogout, enforceRoleAccess]);

    // ==========================================
    // RENDER LOMPATAN AWAL (LOADING SCREEN)
    // ==========================================
    // if (loading) {
    //     return (
    //         <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    //             <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-green-950/20 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="mx-auto flex flex-col lg:flex-row gap-6">
                <SidebarComponent
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    setLoading={setLoading}
                    user={user}
                />

                <main className="relative h-screen flex-1 flex flex-col lg:pr-4 overflow-hidden">
                    <Header
                        setIsSidebarOpen={setIsSidebarOpen}
                        handleLogout={handleLogout}
                        user={user}
                    />

                    <div className="overflow-auto no-scrollbar mt-18 lg:mt-20 px-4 lg:px-0">
                        <div className="mt-4">
                            {page && (
                                <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-2">
                                    {page}
                                </h1>
                            )}
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}