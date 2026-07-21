"use client";

import React from 'react';
import Link from 'next/link';
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react';

export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800 relative overflow-hidden">

            {/* Efek Latar Belakang (Blurry Ornaments) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Main Card */}
            <div className="max-w-md w-full bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-[2rem] p-8 md:p-12 text-center relative z-10 animate-in fade-in zoom-in-95 duration-500">

                {/* Efek Gradient di atas kartu */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-green-500/15 to-transparent pointer-events-none" />

                {/* Ikon Koperasi */}
                <div className="relative mx-auto w-20 h-20 bg-gradient-to-tr from-green-600 to-green-700 text-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg shadow-green-600/30 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Landmark size={36} strokeWidth={2} />
                </div>

                {/* Teks Sambutan */}
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-3 tracking-tight leading-tight">
                    Selamat Datang di <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                        Koperasi Syariah
                    </span>
                </h1>

                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    Sistem informasi terpadu untuk pengelolaan simpan pinjam dan pembiayaan berbasis syariah yang aman, transparan, dan terpercaya.
                </p>

                {/* Badge Kepercayaan */}
                <div className="flex items-center justify-center gap-2 mb-8 text-xs font-semibold text-green-700 bg-green-50 py-2.5 px-4 rounded-full border border-green-100 w-max mx-auto shadow-sm">
                    <ShieldCheck size={16} />
                    <span>Amanah & Terintegrasi</span>
                </div>

                {/* Tombol Menuju Login */}
                <div className="flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="w-full py-4 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 active:scale-95 group"
                    >
                        <span>Masuk ke Sistem</span>
                        <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Footer Text */}
            <div className="mt-10 text-[10px] font-semibold tracking-widest text-slate-400 uppercase relative z-10 text-center">
                Sistem Koperasi Syariah Terpadu <br className="md:hidden" />
                <span className="hidden md:inline"> &bull; </span>
                Hak Cipta Dilindungi
            </div>
        </div>
    );
}