import { CheckCircle2, Loader2 } from 'lucide-react'
import React from 'react'

type Props = {
    onClose?: () => void;
    isSubmitting: boolean;
}

const ButtonSubmit = ({ onClose, isSubmitting }: Props) => {
    return (
        <div className="flex items-center gap-4 pt-4">
            <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
                Kembali
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                className="flex-grow group relative overflow-hidden py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-md shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
                <div className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>MENGIRIM...</span>
                        </>
                    ) : (
                        <>
                            <span>SIMPAN</span>
                            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>
    )
}

export default ButtonSubmit