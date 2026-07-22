'use client'
import { Get } from '@/utils/Get';
import React, { useCallback, useEffect, useState } from 'react'

type Props = {}

// --- TYPES KOPERASI ---
interface StatsType {
    total_member: number;
    total_fo: number;
}

interface MemberChartType {
    name: string; // Bisa Hari (Sen), Minggu (Mng 1), atau Bulan (Jan 24)
    total: number;
    type: string;
}
const useDashboardData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    // Filter State
    const [startDate, setStartDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 6);
        return d.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState<string>(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [activeFilterLabel, setActiveFilterLabel] = useState('7 Hari Terakhir');

    // Data State Koperasi
    const [stats, setStats] = useState<StatsType | null>(null);
    const [chartData, setChartData] = useState<MemberChartType[]>([]);

    const fetchDashboard = useCallback(async () => {
        if (!startDate || !endDate) return;
        setIsLoading(true);

        try {
            // Panggil API backend, mengirim start_date dan end_date
            // Sesuaikan endpoint '/admin/dashboard' dengan route Laravel Anda
            const response = await Get<any>(`super-admin/dashboard?start_date=${startDate}&end_date=${endDate}`);

            // Berdasarkan function Laravel (apiService->successWithData), 
            // datanya kemungkinan bersarang di response.data
            if (response && response.data) {
                setStats(response.data.stats);
                setChartData(response.data.chartData);
            }
        } catch (e: any) {
            // console.error("Gagal memuat data dashboard", e);
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Action: Filter Cepat Berdasarkan Hari
    const applyQuickFilter = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        setActiveFilterLabel(`${days} Hari Terakhir`);
        setIsDateModalOpen(false);
    };

    // Action: Filter Berdasarkan Tahun Tertentu
    const applyYearFilter = (year: number) => {
        const isCurrentYear = year === new Date().getFullYear();
        const start = `${year}-01-01`;
        const end = isCurrentYear
            ? new Date().toISOString().split('T')[0]
            : `${year}-12-31`;

        setStartDate(start);
        setEndDate(end);
        setActiveFilterLabel(`Tahun ${year}`);
        setIsDateModalOpen(false);
    };

    // Action: Filter Kustom dari Input Kalender
    const applyCustomFilter = () => {
        if (startDate && endDate) {
            const sFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(startDate));
            const eFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(endDate));
            setActiveFilterLabel(`${sFormat} - ${eFormat}`);
            setIsDateModalOpen(false);
        }
    };

    return {
        isLoading, isDateModalOpen, setIsDateModalOpen,
        startDate, setStartDate, endDate, setEndDate, activeFilterLabel,
        stats, chartData,
        applyQuickFilter, applyYearFilter, applyCustomFilter
    };
};

export default useDashboardData