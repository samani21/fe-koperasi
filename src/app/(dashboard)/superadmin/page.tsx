"use client"

import Dashboard from "../Components/Dashboard";



export default function App() {
    return (
        <div className="flex h-screen bg-slate-50 font-sans selection:bg-green-200 selection:text-green-900 overflow-hidden relative">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative">
                <Dashboard role={'superadmin'} />
            </main>
        </div>
    );
}