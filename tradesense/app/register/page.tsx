"use client"

import React, { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', {
                name,
                email,
                password
            });

            // Redirect to login with the original destination
            const searchParams = new URLSearchParams(window.location.search);
            const redirect = searchParams.get('redirect') || '/dashboard';
            router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        } catch (err: any) {
            // SHOW ACTUAL BACKEND ERROR
            const errorMessage = err.response?.data?.error ||
                err.response?.data?.message ||
                'Registration failed';
            setError(errorMessage);
            console.error('Registration error:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0613] flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#1a0f2e] border border-slate-800 p-8 rounded-xl space-y-4">
                <h1 className="text-2xl font-bold text-white text-center mb-6">Inscription</h1>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Nom Complet"
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-violet-500 outline-none"
                    value={name} onChange={e => setName(e.target.value)} required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-violet-500 outline-none"
                    value={email} onChange={e => setEmail(e.target.value)} required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-violet-500 outline-none"
                    value={password} onChange={e => setPassword(e.target.value)} required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Création...' : 'Créer mon compte'}
                </button>
                <div className="text-center text-sm text-slate-400">
                    Déjà un compte? <Link href="/login" className="text-violet-400 hover:underline">Se connecter</Link>
                </div>
            </form>
        </div>
    );
}
