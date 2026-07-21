"use client"

import DashboardSuperAdmin from "./Components/DashboardSuperAdmin";

export default function App() {
    return (
        <div className="flex h-screen bg-slate-50 font-sans selection:bg-green-200 selection:text-green-900 overflow-hidden relative">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative">
                <DashboardSuperAdmin />
            </main>
        </div>
    );
}