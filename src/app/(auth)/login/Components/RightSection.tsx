'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { activeScheme, themeStyles } from './Theme'
import { getToken } from '@/utils/Cookies';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, ShieldAlert, Timer, User, X } from 'lucide-react';
import { Post } from '@/utils/Post';
interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

type Props = {}

function RightSection({ }: Props) {
    const router = useRouter();
    const token = getToken();

    // --- UI States ---
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form, setForm] = useState({ login_id: '', password: '' });

    // --- Rate Limiter (Lockout) States ---
    const [attempts, setAttempts] = useState<number>(0);
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [lockTimer, setLockTimer] = useState<number>(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        // Cek Sesi
        const userCookie = Cookies.get('user');
        const roleCookie = Cookies.get('role');

        if (token && userCookie) {
            try {
                const parsedUser = JSON.parse(userCookie);
                const role = (parsedUser.role || roleCookie || '').toLowerCase();

                let targetUrl = '/member';
                if (role === 'superadmin' || role === 'admin') {
                    targetUrl = '/superadmin';
                } else if (role === 'frontoffice' || role === 'fo') {
                    targetUrl = '/fo';
                }

                router.push(targetUrl);
                return;
            } catch (error) {
                // console.error("Gagal membaca data pengguna", error);
            }
        }

        // Cek Lockout
        const savedAttempts = parseInt(localStorage.getItem('login_attempts') || '0', 10);
        const lockoutUntil = parseInt(localStorage.getItem('login_lockout') || '0', 10);
        const currentTime = new Date().getTime();

        if (lockoutUntil > currentTime) {
            setIsLocked(true);
            setLockTimer(Math.ceil((lockoutUntil - currentTime) / 1000));
        } else {
            setAttempts(savedAttempts);
            if (savedAttempts >= 5) {
                resetLockout();
            }
        }
    }, [token, router]);


    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLocked && lockTimer > 0) {
            interval = setInterval(() => {
                setLockTimer((prev) => prev - 1);
            }, 1000);
        } else if (isLocked && lockTimer <= 0) {
            resetLockout();
        }
        return () => clearInterval(interval);
    }, [isLocked, lockTimer]);


    const resetLockout = () => {
        setIsLocked(false);
        setAttempts(0);
        setLockTimer(0);
        localStorage.removeItem('login_attempts');
        localStorage.removeItem('login_lockout');
    };

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const handleFailedAttempt = useCallback((errorMessage: string) => {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('login_attempts', newAttempts.toString());

        if (newAttempts >= 5) {
            const lockoutTime = new Date().getTime() + 60000;
            localStorage.setItem('login_lockout', lockoutTime.toString());
            setIsLocked(true);
            setLockTimer(60);
            showToast('Terlalu banyak percobaan. Coba lagi dalam 1 menit.', 'error');
        } else {
            showToast(`${errorMessage} (Percobaan ${newAttempts}/5)`, 'error');
        }
    }, [attempts, showToast]);

    const handleInputChange = (field: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLocked) {
            showToast(`Sistem terkunci sementara. Tunggu ${lockTimer} detik.`, 'error');
            return;
        }

        if (!form.login_id) return showToast('Email / NIK tidak boleh kosong.', 'error');
        if (form.password.length < 6) return showToast('Kata sandi minimal 6 karakter.', 'error');

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('login_id', form.login_id);
            formData.append('password', form.password);

            const res = await Post<any, any>('auth/login', formData);

            if (res?.data?.token) {
                const userRole = (res.data.role || res.data.user?.role || '').toLowerCase();

                // Simpan kredensial
                Cookies.set('token', res.data.token, { expires: 1, path: '/' });
                Cookies.set('user', JSON.stringify(res.data.user), { expires: 1, path: '/' });
                Cookies.set('role', userRole, { expires: 1, path: '/' }); // Tambahan untuk konsistensi dengan MainLayout

                resetLockout();
                showToast('Login berhasil! Mengalihkan...', 'success');

                // Tentukan rute
                let targetUrl = '/member';
                if (userRole === 'superadmin' || userRole === 'admin') targetUrl = '/superadmin';
                else if (userRole === 'frontoffice' || userRole === 'fo') targetUrl = '/fo';

                setTimeout(() => {
                    router.push(targetUrl);
                    router.refresh(); // Memaksa layout mengambil data cookies terbaru
                }, 800);
            } else {
                handleFailedAttempt(res?.message || 'Login gagal. Periksa kembali data Anda.');
            }
        } catch (error: any) {
            handleFailedAttempt(error?.message || 'Gagal terhubung ke server. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-start">
            <div className='h-full flex flex-col justify-center'>
                <div className="animate-fadeIn mb-8">
                    <h3 className="text-2xl font-bold tracking-tight mb-2 text-slate-800">
                        Selamat Datang
                    </h3>
                    <p className={`text-sm ${themeStyles.textMuted} leading-relaxed`}>
                        Silakan masuk menggunakan Email atau NIK Anda yang telah terdaftar.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">

                    {/* Toast Notifikasi */}
                    {toasts.length > 0 && (
                        <div className="flex flex-col gap-2 w-full mb-2">
                            {toasts.map((toast) => (
                                <div key={toast.id} className={`flex items-center gap-3 p-3.5 rounded-xl shadow-sm border animate-slideIn ${toast.type === 'error'
                                    ? 'bg-rose-500 border-rose-600 text-white'
                                    : 'bg-green-600 border-green-700 text-white'
                                    }`}>
                                    {toast.type === 'error' ? <ShieldAlert className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                                    <p className="text-xs font-semibold flex-1 leading-relaxed">{toast.message}</p>
                                    <button type="button" onClick={() => setToasts(prev => prev.filter((t) => t.id !== toast.id))} className="text-white hover:text-slate-200">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Email atau NIK</label>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${themeStyles.input} transition-all`}>
                            <User size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="contoh@email.com atau 16 digit NIK"
                                className="bg-transparent w-full border-none outline-none text-sm font-semibold focus:ring-0 placeholder:text-slate-400 text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                value={form.login_id}
                                onChange={(e) => handleInputChange('login_id', e.target.value)}
                                required
                                disabled={isLocked || isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Kata Sandi</label>
                        </div>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${themeStyles.input} transition-all`}>
                            <Lock size={18} className="text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Masukkan kata sandi"
                                className="bg-transparent w-full border-none outline-none text-sm font-semibold focus:ring-0 placeholder:text-slate-400 text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                value={form.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                required
                                disabled={isLocked || isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-400 hover:text-green-700 transition-colors disabled:opacity-50"
                                disabled={isLocked || isLoading}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !form.login_id || !form.password || isLocked}
                        className={`w-full mt-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2
                                        ${isLocked
                                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                                : `bg-gradient-to-r ${activeScheme.primary} shadow-lg hover:shadow-green-700/30 active:scale-[0.98]`
                            } disabled:opacity-70`}
                    >
                        {isLocked ? (
                            <>
                                <Timer className="w-5 h-5" />
                                <span>Coba lagi dalam {lockTimer}s</span>
                            </>
                        ) : isLoading ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                <span>Memverifikasi...</span>
                            </>
                        ) : (
                            <>
                                <span>Masuk ke Sistem</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RightSection