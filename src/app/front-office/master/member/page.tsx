'use client'
import DataTable from '@/Components/CRUD/DataTable'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertType, Column, Meta } from '@/Components/CRUD/CRUD';
import { Edit, Trash2Icon } from 'lucide-react';
import { Post } from '@/utils/Post';
import { Delete } from '@/utils/Delete';
import { Get } from '@/utils/Get';
import MainLayout from '@/Components/Layout/MainLayout';
import FilterComponent from '@/Components/CRUD/FilterComponent';
import ModalDelete from '@/Components/CRUD/ModalDelete';
import ModalCrud from '@/Components/CRUD/ModalCrud';
import Alert from '@/Components/CRUD/Alert';
import { MemberType } from '@/app/Types/MemberType';
import CreateOrUpdate from './Components/CreateOrUpdate';
import { formatImage } from '@/utils/FormatImage';

type Props = {}

export default function FrontOfficePage({ }: Props) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });
    const [dateRangeText, setDateRangeText] = useState("");
    // --- DATA & UI STATE ---
    const [dataList, setDataList] = useState<MemberType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<MemberType | null>(null);
    const [deleteData, setDeleteData] = useState<MemberType | null>(null);

    // 1. Auto-hide Alert dengan Cleanup Timer
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
    }, [debouncedSearch, itemsPerPage]);

    // 4. Query String Builder
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


    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: MemberType[]; meta: Meta }>(`front-office/member${queryString}`);
            if (res?.success) {
                // SOP 4: Edge Case fallback jika data kosong
                setDataList(res.data || []);
                setMeta(res.meta);
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data Anggota");
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        try {
            const endpoint = id ? `front-office/member/${id}` : 'front-office/member';
            const res = await Post(endpoint, formData);

            if (res) {
                fetchData(); // Refresh data
                handleCloseModal();
                setShowAlert({ type: 'success', message: id ? 'Berhasil update data' : 'Berhasil simpan data', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        }
    };


    const onDelete = async (id: number | null) => {
        setIsLoading(true);
        try {
            const res = await Delete(`front-office/member/${id}`);
            if (res) {
                fetchData();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Berhasil hapus data', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal menghapus: ' + err.message, isOpen: true });
        } finally {
            setIsLoading(false);
        }
    };


    const handleResetFilter = () => {
        setSearch("");
        setDateRangeText("");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setDataUpdate(null);
            setDeleteData(null);
        }, 300); // Tunggu animasi selesai agar transisi modal mulus
    };

    const handleEdit = useCallback((row: MemberType) => {
        setDataUpdate(row);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((row: MemberType) => {
        setDeleteData(row);
        setIsModalOpen(true);
    }, []);

    const columns: Column<MemberType>[] = useMemo(() => [
        {
            key: "photo", label: "Photo",
            render: (row) => {
                if (row?.photo) {
                    return <img src={formatImage(row?.photo)} className='w-32 ' />
                }
            },
        },
        { key: "full_name", label: "Nama Lengkap Anggota" },
        { key: "member_number", label: "Nomor Anggota" },
        {
            key: "email",
            label: "email",
            align: "center",
            render: (row) => (
                row?.user?.email || '-'
            ),
        },
        {
            key: "nik",
            label: "nik",
            align: "center",
            render: (row) => (
                row?.user?.nik
            ),
        },
        { key: "address", label: "Alamat" },
        { key: "phone", label: "No Hp" },

        {
            key: "actions",
            label: "Aksi",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(row)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Data">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(row)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Data">
                        <Trash2Icon size={18} />
                    </button>
                </div>
            ),
        },
    ], [handleEdit, handleDelete]);

    return (
        <MainLayout>
            <div className='relative space-y-6 pb-6'>
                {/* Judul Halaman */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelola Data Anggota</h1>
                    <p className="text-sm text-gray-500 mt-1">Manajemen pendaftaran dan pembaruan akun Anggota.</p>
                </div>

                <FilterComponent
                    search={search}
                    setSearch={setSearch}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    setPage={setPage}
                    handleReset={handleResetFilter}
                    setIsModalOpenForm={setIsModalOpen}
                    isDateRange={true}
                    setDateRangeText={setDateRangeText}
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

                {deleteData ? (
                    <ModalDelete
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        deleteData={deleteData}
                        handleDelete={onDelete}
                        isLoading={isLoading}
                    />
                ) : (
                    <ModalCrud
                        isOpen={isModalOpen}
                        title={dataUpdate ? "Edit Anggota" : "Tambah Anggota"}
                        onClose={handleCloseModal}
                    >
                        <CreateOrUpdate
                            handleFormSubmit={handleFormSubmit}
                            data={dataUpdate}
                            onCancel={handleCloseModal}
                        />
                    </ModalCrud>
                )}

                {/* ALERT */}
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