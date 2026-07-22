'use client'
import DataTable from '@/Components/CRUD/DataTable'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertType, Column, Meta } from '@/Components/CRUD/CRUD';
import { Get } from '@/utils/Get';
import MainLayout from '@/Components/Layout/MainLayout';
import FilterComponent from '@/Components/CRUD/FilterComponent';
import Alert from '@/Components/CRUD/Alert'; // Pastikan di-import
import { MemberType } from '@/app/Types/MemberType';

type Props = {}


export default function MemberPage({ }: Props) { // Ubah nama fungsi biar sesuai konteks
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [dataList, setDataList] = useState<MemberType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // 1. Auto-hide Alert
    useEffect(() => {
        if (showAlert?.isOpen) {
            const timer = setTimeout(() => {
                setShowAlert(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    // 2. Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 800);
        return () => clearTimeout(handler);
    }, [search]);

    // 3. Reset Halaman ke 1 jika filter pencarian/limit berubah
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, itemsPerPage, dateRangeText]); // Tambahkan dateRangeText sbg trigger reset

    // 4. Parser Tanggal (Aman dari Invalid Date)
    const parsedDate = useMemo(() => {
        if (!dateRangeText.includes(" - ")) return { start_date: "", end_date: "" };

        const monthMap: Record<string, string> = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
            Jul: "07", Agt: "08", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
        };

        const formatDate = (dateStr: string) => {
            if (!dateStr) return "";
            const parts = dateStr.trim().split(" ");
            if (parts.length !== 3) return "";
            const [day, month, year] = parts;
            return `${year}-${monthMap[month] || "01"}-${day.padStart(2, "0")}`;
        };

        const [start, end] = dateRangeText.split(" - ");
        return { start_date: formatDate(start), end_date: formatDate(end) };
    }, [dateRangeText]);

    // 5. Query String Builder
    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", itemsPerPage.toString());

        if (debouncedSearch.trim()) params.append("search", debouncedSearch);
        if (parsedDate.start_date) params.append("start_date", parsedDate.start_date);
        if (parsedDate.end_date) params.append("end_date", parsedDate.end_date);

        return `?${params.toString()}`;
    }, [parsedDate, page, debouncedSearch, itemsPerPage]);

    // 6. Fetching API
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: MemberType[]; meta: Meta }>(`super-admin/member${queryString}`);
            if (res?.success) {
                // SOP 4: Fallback data list
                setDataList(res.data || []);
                setMeta(res.meta);
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data Member");
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleResetFilter = () => {
        setSearch("");
        setDateRangeText("");
    };

    const columns: Column<MemberType>[] = useMemo(() => [
        { key: "member_number", label: "Nomor Anggota" },
        { key: "full_name", label: "Nama" },
        {
            key: "email",
            label: "Email",
            render: (row) => row?.user?.email || '-' // Fallback jika relasi user hilang
        },
        {
            key: "nik",
            label: "NIK",
            render: (row) => row?.user?.nik || '-' // Fallback
        },
        { key: "address", label: "Alamat" },
    ], []);

    return (
        <MainLayout>
            <div className='relative space-y-6 pb-6'>
                {/* Judul Halaman */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Daftar Member</h1>
                    <p className="text-sm text-gray-500 mt-1">Daftar seluruh anggota koperasi yang terdaftar.</p>
                </div>

                <FilterComponent
                    search={search}
                    setSearch={setSearch}
                    itemsPerPage={itemsPerPage}
                    dateRangeText={dateRangeText}
                    setDateRangeText={setDateRangeText}
                    setItemsPerPage={setItemsPerPage}
                    setPage={setPage}
                    handleReset={handleResetFilter}
                    setIsModalOpenForm={() => { }}
                    isDateRange={true} // AKTIFKAN KARENA BACKEND SUDAH SUPPORT
                    hiddenAdd={true}
                />

                <div className="mt-6">
                    <DataTable<MemberType>
                        data={dataList}
                        columns={columns}
                        page={page}
                        itemsPerPage={itemsPerPage}
                        total={meta?.total}
                        onPageChange={setPage}
                        loading={loading}
                        error={error}
                        rowKey={(row) => row.id}
                    />
                </div>

                {/* SOP 1: Alert Component harus di-render */}
                {showAlert?.isOpen && (
                    <Alert
                        type={showAlert.type}
                        message={showAlert.message}
                        onClose={() => setShowAlert(null)}
                    />
                )}
            </div>
        </MainLayout>
    )
}