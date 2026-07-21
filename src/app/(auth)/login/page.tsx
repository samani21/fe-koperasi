"use client";
import { themeStyles } from './Components/Theme';
import LeftSection from './Components/LeftSection';
import RightSection from './Components/RightSection';

// TYPES & INTERFACES
interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

export default function AuthView() {
    return (
        <div className={`min-h-screen ${themeStyles.bg} flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-x-hidden transition-colors duration-500`}>
            <div className="max-w-6xl w-full z-10 flex flex-col gap-4">
                <div className={`grid lg:grid-cols-12 gap-0 rounded-[32px] overflow-hidden border ${themeStyles.card} transition-all duration-1000 transform translate-y-0 `}>
                    <LeftSection />
                    <RightSection />
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}