"use client"; // Pastikan ini ada jika menggunakan useEffect di Next.js App Router

import React, { useEffect } from 'react';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
    type?: AlertType;
    message: string;
    onClose: () => void;
    autoClose?: boolean; // Opsi tambahan agar fleksibel
    autoCloseDuration?: number; // Waktu bisa disesuaikan
}

export const AlertComponent = ({ type = 'info', message, onClose }: AlertProps) => {
    const styles: Record<AlertType, { container: string; icon: React.ReactNode; button: string }> = {
        success: {
            container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
            icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
            button: 'text-emerald-600 hover:bg-emerald-200 focus:ring-emerald-500'
        },
        error: {
            container: 'bg-red-50 border-red-200 text-red-900',
            icon: <XCircle className="w-5 h-5 text-red-600" />,
            button: 'text-red-600 hover:bg-red-200 focus:ring-red-500'
        },
        warning: {
            container: 'bg-amber-50 border-amber-200 text-amber-900',
            icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
            button: 'text-amber-600 hover:bg-amber-200 focus:ring-amber-500'
        },
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-900',
            icon: <Info className="w-5 h-5 text-blue-600" />,
            button: 'text-blue-600 hover:bg-blue-200 focus:ring-blue-500'
        }
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div className={`flex items-start p-4 border rounded-xl shadow-lg transition-all duration-300 ${currentStyle.container}`} role="alert">
            <div className="flex-shrink-0 mt-0.5">
                {currentStyle.icon}
            </div>
            <div className="ml-3 flex-1 break-words">
                <div className="text-sm font-medium leading-relaxed opacity-95">{message}</div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`ml-3 flex-shrink-0 -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${currentStyle.button}`}
                    aria-label="Tutup notifikasi"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default function Alert({
    type = 'info',
    message,
    onClose,
    autoClose = true,
    autoCloseDuration = 5000
}: AlertProps) {

    useEffect(() => {
        if (!autoClose) return;

        const timer = setTimeout(() => {
            onClose();
        }, autoCloseDuration);

        return () => clearTimeout(timer);
    }, [onClose, autoClose, autoCloseDuration]);

    return (
        <div className="fixed z-[100] top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
            <AlertComponent
                type={type}
                message={message}
                onClose={onClose}
            />
        </div>
    );
}