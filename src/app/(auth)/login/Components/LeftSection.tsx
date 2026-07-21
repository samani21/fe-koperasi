import { DollarSign, Landmark, ShieldAlert, Users, Wallet } from 'lucide-react'
import React from 'react'
import { activeScheme, themeStyles } from './Theme'

type Props = {}

const LeftSection = (props: Props) => {
    return (
        <div className="hidden lg:block lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden bg-slate-500/[0.02] border-r border-slate-500/10">
            <div className={`absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-tr from-slate-100 via-white/80 to-transparent pointer-events-none z-0`} />
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className={`bg-gradient-to-tr ${activeScheme.primary} w-12 h-12 flex rounded-md items-center justify-center text-white font-black text-base shadow-lg`}>
                            <Landmark size={28} className='text-white' />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight leading-none text-slate-800">Koperasi Syariah</h1>
                        </div>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                        Pembiayaan Mudah & <br />
                        <span className={`bg-gradient-to-r ${activeScheme.textGrad} bg-clip-text text-transparent`}>
                            Sesuai Syariat.
                        </span>
                    </h2>
                    <p className={`text-xs ${themeStyles.textMuted} mt-3 max-w-md leading-relaxed`}>
                        Sistem informasi terintegrasi untuk pengelolaan data anggota, simpanan, dan pembiayaan secara aman, cepat, dan transparan.
                    </p>
                </div>

                {/* Mini Dashboard Preview */}
                <div className="w-full relative flex items-center justify-center py-4">
                    <div className={`w-full max-w-md rounded-2xl border ${themeStyles.cardGlass} p-4 shadow-xl backdrop-blur-md relative overflow-hidden`}>
                        <div className="flex items-center justify-between border-b border-slate-500/10 pb-3 mb-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                            </div>
                            <span className="text-[9px] font-mono tracking-wider text-slate-400">sistem.koperasisyariah.id</span>
                            <div className="w-6" />
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 mb-4">
                            <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                                <span className="text-[8px] text-slate-400 block uppercase font-mono">Total Aset</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <Wallet className={`w-3.5 h-3.5 ${activeScheme.text}`} />
                                    <span className="text-[11px] font-bold">14.2M</span>
                                </div>
                                <span className="text-[7px] text-green-600 font-bold block mt-0.5">+12.4%</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                                <span className="text-[8px] text-slate-400 block uppercase font-mono">Pembiayaan</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <DollarSign className={`w-3.5 h-3.5 ${activeScheme.text}`} />
                                    <span className="text-[11px] font-bold">8.5M</span>
                                </div>
                                <span className="text-[7px] text-green-600 font-bold block mt-0.5">+5.1%</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                                <span className="text-[8px] text-slate-400 block uppercase font-mono">Anggota</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <Users className={`w-3.5 h-3.5 ${activeScheme.text}`} />
                                    <span className="text-[11px] font-bold">1,850</span>
                                </div>
                                <span className="text-[7px] text-green-600 font-bold block mt-0.5">+12 New</span>
                            </div>
                        </div>

                        <div className="h-28 w-full bg-slate-500/5 rounded-xl border border-slate-500/5 p-3 flex flex-col justify-between relative overflow-hidden">
                            <div className="flex justify-between items-center z-10">
                                <span className="text-[8px] text-slate-400 block uppercase font-mono">Tren Pertumbuhan</span>
                                <span className="text-[8px] bg-green-600/10 text-green-600 px-1.5 py-0.5 rounded font-mono font-bold">Live</span>
                            </div>
                            <svg className="absolute inset-0 w-full h-full p-2 mt-4 z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={activeScheme.accentColor} stopOpacity="0.3" />
                                        <stop offset="100%" stopColor={activeScheme.accentColor} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <line x1="0" y1="20" x2="100" y2="20" className={themeStyles.gridLines} strokeWidth="0.5" strokeDasharray="3 3" />
                                <line x1="0" y1="50" x2="100" y2="50" className={themeStyles.gridLines} strokeWidth="0.5" strokeDasharray="3 3" />
                                <line x1="0" y1="80" x2="100" y2="80" className={themeStyles.gridLines} strokeWidth="0.5" strokeDasharray="3 3" />
                                <path d="M 0 80 Q 20 40, 40 65 T 80 30 T 100 20 L 100 95 L 0 95 Z" fill="url(#chartGrad)" />
                                <path d="M 0 80 Q 20 40, 40 65 T 80 30 T 100 20" fill="none" stroke={activeScheme.accentColor} strokeWidth="1.8" />
                            </svg>
                            <div className="flex justify-between text-[7px] text-slate-400 mt-auto z-10 pt-1 font-mono">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span>Jul</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-6 right-8 bg-green-700 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce duration-[3000ms]">
                        <ShieldAlert size={11} className="text-white" />
                        <span>Amanah & Terpercaya</span>
                    </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/5 flex items-center justify-between">
                    <div>
                        <span className="text-[8px] text-slate-400 block uppercase tracking-wider font-bold">Status Sistem</span>
                        <p className="text-xs font-black truncate max-w-[200px] text-green-700">
                            Online & Stabil
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LeftSection