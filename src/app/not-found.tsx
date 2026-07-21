"use client";
import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">

                {/* Efek Latar Belakang */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none" />

                {/* Ikon Error */}
                <div className="mx-auto w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-rose-100">
                    <ShieldAlert size={40} strokeWidth={1.5} />
                </div>
                {/* Teks */}
                <h1 className="\text-6xl font-black text-slate-800 mb-2 tracking-tight">404</h1>
                <h2 className="text-xl font-bold text-slate-700 mb-3">Halaman Tidak Ditemukan</h2>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    Maaf, alamat atau subdomain yang Anda tuju tidak terdaftar di sistem kami, atau Anda tidak memiliki akses ke halaman ini.
                </p>

                {/* Tombol Navigasi */}
                <div className="flex flex-col gap-3">
                    {/* UPDATE: Menggunakan absolute URL ke subdomain member */}
                    <Link
                        href="http://localhost:3000/login"
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Home size={18} />
                        Kembali ke Halaman Login
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Kembali Sebelumnya
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                Sistem Koperasi Syariah Terpadu
            </div>
        </div>
    );
}