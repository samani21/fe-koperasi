"use client"

import { Layers, X } from 'lucide-react';
import React, { useEffect, memo } from 'react';

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    title: string;
    onClose: () => void;
}

const ModalCrud = ({ children, isOpen, title, onClose }: Props) => {

    // 1. UX & Event Handling: Scroll Lock dan Escape Key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            // Mencegah body scroll
            document.body.style.overflow = 'hidden';
            // Dengarkan event keyboard
            window.addEventListener('keydown', handleKeyDown);
        } else {
            // Kembalikan ke normal menggunakan string kosong agar mengikuti default CSS
            document.body.style.overflow = '';
        }

        // Cleanup function saat komponen di-unmount atau state berubah
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        // 2. Perbaikan Z-Index & Standar Aksesibilitas Web (ARIA)
        <div
            className="fixed inset-0 h-full z-[60] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop Section */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true" // Sembunyikan dari screen reader karena hanya efek visual
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Header Section */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl" aria-hidden="true">
                            <Layers className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        {/* ID ini dihubungkan dengan aria-labelledby di container utama */}
                        <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                            {title}
                        </h2>
                    </div>

                    {/* 3. WAJIB: type="button" untuk mencegah bug saat berada di dalam tag <form> */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 text-slate-400 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                        aria-label="Tutup modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body / Content Section */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </div>
            </div>
        </div>
    );
};

// 4. Optimasi Performa: Mencegah render berulang yang tidak perlu
export default memo(ModalCrud);