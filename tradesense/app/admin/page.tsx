"use client"

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminPage() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [authError, setAuthError] = useState(false);

    const fetchAll = async () => {
        try {
            const res = await api.get('/admin/challenges');
            setChallenges(res.data.challenges);
            setAuthError(false);
        } catch (err) {
            console.error(err);
            setAuthError(true);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const updateStatus = async (id: number, status: string) => {
        if (!confirm(`Are you sure you want to set status to ${status}?`)) return;
        try {
            await api.put(`/admin/challenges/${id}/override`, { status });
            fetchAll();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (authError) {
        return <div className="p-10 text-center text-red-500">Access Denied. Please login as Admin.</div>
    }

    return (
        <div className="min-h-screen bg-[#0a0613] text-white p-8">
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    Admin Console
                </h1>
                <button onClick={fetchAll} className="text-sm bg-slate-800 px-3 py-1 rounded">Refresh</button>
            </header>

            <div className="bg-[#1a0f2e] border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#0a0613] text-slate-400 uppercase font-bold border-b border-slate-800">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">User ID</th>
                            <th className="p-4">Equity</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Created</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {challenges.map(c => (
                            <tr key={c.id} className="hover:bg-white/5">
                                <td className="p-4 text-slate-400">#{c.id}</td>
                                <td className="p-4">{c.user_id}</td>
                                <td className="p-4 font-mono">${c.current_equity.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${c.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                                            c.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => updateStatus(c.id, 'passed')}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs transition-colors"
                                    >
                                        Pass
                                    </button>
                                    <button
                                        onClick={() => updateStatus(c.id, 'failed')}
                                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs transition-colors"
                                    >
                                        Fail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
