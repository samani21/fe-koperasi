'use client'
import {
    ChevronDown, Calendar, Filter, Users, UserCog, XCircle, Zap, ShieldCheck, CalendarDays, ArrowRight, UserCircle2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import MainLayout from '@/Components/Layout/MainLayout';
import useDashboardData from './useDashboardData';
import Link from 'next/link';

type Props = {
    role: string
}

const Dashboard = ({ role }: Props) => {
    const {
        isLoading, isDateModalOpen, setIsDateModalOpen,
        startDate, setStartDate, endDate, setEndDate, activeFilterLabel,
        stats, chartData, applyQuickFilter, applyYearFilter, applyCustomFilter,
        recentMembers // <-- Pastikan ini sudah diexport dari useDashboardData
    } = useDashboardData();

    const currentYear = new Date().getFullYear();
    const recentYears = [currentYear, currentYear - 1, currentYear - 2];
    const url = role === 'superadmin' ? "/superadmin/master/member" : "/front-office/master/member"

    return (
        <MainLayout>
            <main className={isDateModalOpen ? "p-4 sm:p-8 animate-fade-in relative z-[100]" : "p-4 sm:p-8 animate-fade-in relative z-10"}>

                {/* Header Section */}
                <div className="mb-8 flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center capitalize">
                            Dashboard {role === 'superadmin' ? 'Super Admin' : 'Front Office'}
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Ringkasan performa dan keanggotaan Koperasi Syariah.</p>
                    </div>
                </div>

                {/* Filter Action Bar */}
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6 p-4 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                    <h2 className="text-lg font-bold text-gray-800 px-2">Ringkasan Data</h2>
                    <button
                        onClick={() => setIsDateModalOpen(true)}
                        className="group flex items-center gap-3 px-5 py-2.5 bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-2xl hover:shadow-md hover:border-green-200 hover:bg-white transition-all"
                    >
                        <div className="p-1.5 bg-green-100 rounded-xl group-hover:bg-green-600 transition-colors">
                            <Calendar className="w-4 h-4 text-green-700 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Periode Aktif</span>
                            <span className="text-sm font-bold text-gray-800">{activeFilterLabel}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-2 group-hover:text-green-600 transition-colors" />
                    </button>
                </div>

                {/* Kartu Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="group relative overflow-hidden p-6 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full translate-x-10 -translate-y-10 pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-5 relative z-10">
                            <div className="bg-gradient-to-br from-green-500 to-green-700 p-3.5 rounded-2xl shadow-lg shadow-green-600/30 group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl xl:text-3xl font-extrabold text-gray-900 tracking-tight">{isLoading ? '...' : stats?.total_member || 0}</h3>
                            <p className="text-sm font-semibold text-gray-500 mt-1">Total Anggota</p>
                        </div>
                    </div>
                    {
                        role === 'superadmin' &&
                        <div className="group relative overflow-hidden p-6 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full translate-x-10 -translate-y-10 pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-5 relative z-10">
                                <div className="bg-gradient-to-br from-green-500 to-green-700 p-3.5 rounded-2xl shadow-lg shadow-green-600/30 group-hover:scale-110 transition-transform duration-300">
                                    <UserCog className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl xl:text-3xl font-extrabold text-gray-900 tracking-tight">{isLoading ? '...' : stats?.total_fo || 0}</h3>
                                <p className="text-sm font-semibold text-gray-500 mt-1">Total Front Office</p>
                            </div>
                        </div>
                    }
                </div>

                {/* Layout Utama: Grafik (Kiri) & List Member Terbaru (Kanan) */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Grafik Anggota (2 Kolom) -> Perbaikan class dari lg:col-span-3 menjadi lg:col-span-2 */}
                    <div className="lg:col-span-2 p-6 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Grafik Pertumbuhan Anggota</h2>
                                <p className="text-xs font-medium text-gray-500 mt-1">
                                    Menampilkan data <span className="text-green-700 font-bold">{chartData?.length > 0 ? chartData[0].type : 'Pendaftaran'}</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            {isLoading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                        <defs>
                                            <linearGradient id="colorMember" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} dy={10} />
                                        <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,1)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                            itemStyle={{ color: '#15803d', fontWeight: '900' }}
                                            formatter={(value) => [`${value} Orang`, 'Penambahan Anggota']}
                                            labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#16a34a"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorMember)"
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#15803d', className: "shadow-lg shadow-green-600" }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Daftar Member Terbaru (1 Kolom) -> Perbaikan class dari lg:col-span-3 menjadi lg:col-span-1 */}
                    <div className="lg:col-span-1 p-6 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Anggota Terbaru</h2>
                            <Link href={url} className="group flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-full transition-all">
                                Lihat Semua
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[350px]">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 animate-pulse">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))
                            ) : recentMembers && recentMembers.length > 0 ? (
                                recentMembers.map((member: any) => (
                                    <div key={member.id} className="flex items-center gap-4 group p-2 hover:bg-white rounded-2xl transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shrink-0 border border-green-200 text-green-600">
                                            <UserCircle2 className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-green-700 transition-colors">
                                                {member.full_name}
                                            </p>
                                            <p className="text-xs font-medium text-gray-500 truncate mt-0.5">
                                                No: {member.member_number}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                    <Users className="w-10 h-10 text-slate-300 mb-2" />
                                    <p className="text-sm font-medium text-slate-500">Belum ada anggota baru</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MODAL FILTER TANGGAL (TETAP SAMA) */}
                {isDateModalOpen && (
                    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fade-in">
                        <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-white transform transition-all scale-in">
                            <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-white/50">
                                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                                    <div className="p-2 bg-green-100 rounded-xl">
                                        <Filter className="w-5 h-5 text-green-700" />
                                    </div>
                                    Filter Waktu
                                </h3>
                                <button onClick={() => setIsDateModalOpen(false)} className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-full transition-all">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <p className="text-xs font-extrabold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-500" /> Pilih Cepat (Hari)
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[7, 15, 30].map(days => (
                                            <button
                                                key={days}
                                                onClick={() => applyQuickFilter(days)}
                                                className="px-2 py-3 text-sm font-bold text-gray-600 bg-white/60 rounded-xl border border-gray-200/60 hover:border-green-500 hover:bg-green-50 hover:text-green-700 hover:shadow-md hover:shadow-green-100 transition-all"
                                            >
                                                {days} Hari
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-extrabold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-purple-500" /> Pilih Tahun
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {recentYears.map(year => (
                                            <button
                                                key={year}
                                                onClick={() => applyYearFilter(year)}
                                                className="px-2 py-3 text-sm font-bold text-gray-600 bg-white/60 rounded-xl border border-gray-200/60 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md hover:shadow-purple-100 transition-all"
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-extrabold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" /> Rentang Kustom
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Mulai</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                                className="w-full px-3 py-3 bg-white border border-gray-200/80 rounded-xl text-sm text-gray-700 font-bold focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all cursor-pointer shadow-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Selesai</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={e => setEndDate(e.target.value)}
                                                className="w-full px-3 py-3 bg-white border border-gray-200/80 rounded-xl text-sm text-gray-700 font-bold focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all cursor-pointer shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100/50 bg-gray-50/50 flex justify-end gap-3">
                                <button onClick={() => setIsDateModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200">
                                    Batal
                                </button>
                                <button
                                    onClick={applyCustomFilter}
                                    disabled={!startDate || !endDate}
                                    className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    Terapkan Filter
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
                    .scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                    
                    /* Custom Scrollbar untuk List Member */
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                    .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
                `}</style>
            </main>
        </MainLayout>
    );
};

export default Dashboard