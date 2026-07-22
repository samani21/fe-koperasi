import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    deleteData: any | null;
    handleDelete: (id: number | null) => void;
    isLoading?: boolean; // Tambahan prop untuk mendeteksi status loading
};

const ModalDelete = ({ isOpen, onClose, deleteData, handleDelete, isLoading = false }: Props) => {
    // Efek untuk mengunci scroll body saat modal terbuka
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop: Jangan izinkan klik luar jika sedang loading */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={!isLoading ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Tombol Close di pojok kanan atas */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Tutup Modal"
                >
                    <X size={20} />
                </button>

                <div className="p-6 sm:p-8 text-center">
                    {/* Ikon Warning */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>

                    {/* Judul & Deskripsi */}
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Hapus Data?
                    </h2>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                        Anda yakin ingin menghapus data <strong className="text-slate-800">{deleteData?.name || "ini"}</strong>?
                        Aksi ini bersifat permanen dan tidak dapat dibatalkan.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDelete(deleteData?.id ?? null)}
                            disabled={isLoading}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Menghapus...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    <span>Ya, Hapus</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDelete;