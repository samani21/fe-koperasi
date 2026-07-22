'use client'
import { MemberType } from '@/app/Types/MemberType';
import { Get } from '@/utils/Get';
import React, { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie';

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
    const [recentMembers, setRecentMembers] = useState<MemberType[]>([]);

    const fetchDashboard = useCallback(async () => {
        if (!startDate || !endDate) return;
        setIsLoading(true);

        try {
            const userCookie = Cookies.get('user');
            let userRole = 'member'; // Fallback default role

            if (userCookie) {
                try {
                    const parsedUser = JSON.parse(userCookie);
                    userRole = parsedUser?.role || Cookies.get('role') || 'member';
                } catch (err) {
                    userRole = Cookies.get('role') || 'member';
                }
            } else {
                userRole = Cookies.get('role') || 'member';
            }

            const normalizedRole = userRole.toLowerCase();

            // Tentukan endpoint berdasarkan role user
            const endpoint = (normalizedRole === 'superadmin' || normalizedRole === 'admin')
                ? `super-admin/dashboard?start_date=${startDate}&end_date=${endDate}`
                : `front-office/dashboard?start_date=${startDate}&end_date=${endDate}`;

            const response = await Get<{ success: boolean, data: any }>(endpoint);

            if (response && response.data) {
                setStats(response.data.stats);
                setChartData(response.data.chartData);
                setRecentMembers(response.data.recent_members);
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
        applyQuickFilter, applyYearFilter, applyCustomFilter, recentMembers
    };
};

export default useDashboardData;