"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";

// ==========================================
// TYPES & INTERFACES
// ==========================================
type Align = "left" | "center" | "right";

interface Column<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    align?: Align;
    render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    page?: number;
    itemsPerPage?: number;
    total?: number;
    onPageChange?: (page: number) => void;
    loading?: boolean;
    error?: string;
    rowKey?: (row: T, index: number) => React.Key;
    emptyMessage?: string;
}

// ==========================================
// HELPERS
// ==========================================
const alignClass: Record<Align, string> = {
    left: "text-left md:justify-start",
    center: "text-center md:justify-center",
    right: "text-right md:justify-end",
};

// Skeleton khusus agar tampilannya pas baik di Card maupun Table
const SkeletonCell = () => (
    <div className="flex justify-between items-center md:block w-full">
        <div className="md:hidden w-1/3 h-3 bg-slate-200/50 rounded-full" />
        <div className="w-1/2 md:w-3/4 h-4 bg-slate-200/70 rounded-full animate-pulse" />
    </div>
);

// Helper untuk Smart Pagination dengan Ellipsis (...)
const getPaginationItems = (currentPage: number, totalPages: number) => {
    // SOP 4: Edge case jika tidak ada halaman
    if (totalPages <= 0) return [];

    // Jika total halaman 7 atau kurang, tampilkan semua (misal: 1 2 3 4 5 6 7)
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Jika posisi user ada di awal halaman (misal: 1 2 3 4 5 ... 100)
    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, '...', totalPages];
    }

    // Jika posisi user ada di akhir halaman (misal: 1 ... 96 97 98 99 100)
    if (currentPage >= totalPages - 3) {
        return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // Jika posisi user ada di tengah halaman (misal: 1 ... 49 50 51 ... 100)
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function DataTable<T>({
    data,
    columns,
    page = 1,
    itemsPerPage = 10,
    total,
    onPageChange,
    loading = false,
    error,
    rowKey,
    emptyMessage = "Tidak ada data",
}: DataTableProps<T>) {

    // --- Pagination Logic ---
    const isPaginated = total !== undefined && onPageChange;
    const totalPages = isPaginated ? Math.ceil((total ?? 0) / itemsPerPage) : 1;
    const from = (page - 1) * itemsPerPage + 1;
    const to = isPaginated ? Math.min(page * itemsPerPage, total!) : data.length;

    // Generate list angka pagination
    const paginationItems = getPaginationItems(page, totalPages);

    return (
        <div className="bg-transparent md:bg-white md:rounded-3xl md:border border-slate-100 md:shadow-sm md:shadow-green-600/5 animate-in fade-in duration-300">

            {/* Table / Card Wrapper */}
            <div className="w-full md:overflow-x-auto pb-4 md:pb-0">
                <table className="w-full text-left border-collapse block md:table">

                    {/* Header (Sembunyikan di Mobile) */}
                    <thead className="hidden md:table-header-group">
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={`px-6 py-5 cursor-default transition-colors ${col.align ? alignClass[col.align].split(' ')[0] : 'text-left'}`}
                                    style={{ width: col.width }}
                                >
                                    <div className={`flex items-center gap-1 ${col.align ? alignClass[col.align].split(' ')[1] : 'justify-start'}`}>
                                        {col.label}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="block md:table-row-group text-sm font-medium text-slate-600">
                        {error ? (
                            <tr className="block md:table-row bg-white rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-slate-100 md:border-none">
                                <td colSpan={columns.length} className="block md:table-cell px-6 py-10 md:py-16 text-center text-rose-500 bg-rose-50/30 md:bg-rose-50/30 rounded-2xl md:rounded-none">
                                    {error}
                                </td>
                            </tr>
                        ) : loading ? (
                            [...Array(itemsPerPage)].map((_, i) => (
                                <tr key={i} className="block md:table-row bg-white rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-slate-100 md:border-none mb-3 md:mb-0 md:border-b md:border-slate-100 last:border-0">
                                    {columns.map((_, j) => (
                                        <td key={j} className="block md:table-cell px-4 py-3 md:px-6 md:py-5 border-b border-slate-50 md:border-none last:border-none">
                                            <SkeletonCell />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr className="block md:table-row bg-white rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-slate-100 md:border-none">
                                <td colSpan={columns?.length} className="block md:table-cell px-6 py-12 md:py-16 text-center text-slate-400 rounded-2xl md:rounded-none">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Inbox className="w-10 h-10 text-slate-300 mb-2" />
                                        <span>{emptyMessage}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={rowKey ? rowKey(row, index) : index}
                                    className="block md:table-row bg-white hover:bg-green-50/30 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-slate-100 md:border-none mb-3 md:mb-0 md:border-b md:border-slate-100 last:border-0 transition-colors duration-200 group"
                                >
                                    {columns.map((col, id) => (
                                        <td
                                            key={id}
                                            className={`block md:table-cell px-4 py-3 md:px-6 md:py-4 border-b border-slate-50 md:border-none last:border-none ${col.align ? alignClass[col.align].split(' ')[0] : 'text-left'}`}
                                        >
                                            <div className="flex md:block justify-between items-center gap-4">
                                                {/* Label Mobile */}
                                                <span className="md:hidden text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                    {col.label}
                                                </span>

                                                {/* Konten Value */}
                                                <div className={`text-slate-700 text-right md:text-left group-hover:text-green-700 transition-colors flex items-center md:items-start flex-1 md:flex-none justify-end ${col.align ? alignClass[col.align].split(' ')[1] : 'md:justify-start'}`}>
                                                    {col.render
                                                        ? col.render(row, index)
                                                        : (row as any)[col.key]}
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="bg-white rounded-2xl md:rounded-none md:rounded-b-3xl px-4 py-4 md:px-6 md:py-5 border border-slate-100 md:border-t md:border-x-0 md:border-b-0 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm md:shadow-none">

                {/* Total Indicator */}
                <span className="text-[13px] md:text-sm font-medium text-slate-400 text-center sm:text-left">
                    Menampilkan <span className="font-bold text-slate-700">{data.length > 0 ? from : 0}</span> hingga{' '}
                    <span className="font-bold text-slate-700">{data.length > 0 ? to : 0}</span>{' '}
                    dari <span className="font-bold text-slate-700">{total || 0}</span> data
                </span>

                {/* Pagination Controls */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => onPageChange?.(Math.max(1, page - 1))}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:border-green-300 hover:bg-green-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-4 md:h-4" />
                    </button>

                    <div className="flex items-center gap-1 flex-wrap justify-center">
                        {paginationItems.map((item, i) => (
                            <React.Fragment key={i}>
                                {item === '...' ? (
                                    <span className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-slate-400 font-medium">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => onPageChange?.(item as number)}
                                        className={`w-8 h-8 md:w-9 md:h-9 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 flex items-center justify-center ${page === item
                                            ? 'bg-green-600 text-white shadow-md shadow-green-600/25 border border-green-600'
                                            : 'border border-transparent bg-transparent hover:bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:border-green-300 hover:bg-green-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all active:scale-95"
                    >
                        <ChevronRight className="w-4 h-4 md:w-4 md:h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}