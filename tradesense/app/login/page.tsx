"use client"
// FILE: frontend/app/login/page.tsx
import React, { useState, Suspense } from 'react';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            window.location.href = redirect; // Force refresh to update auth state
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0613] flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#1a0f2e] border border-slate-800 p-8 rounded-xl space-y-4">
                <h1 className="text-2xl font-bold text-white text-center mb-6">Connexion</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white"
                    value={email} onChange={e => setEmail(e.target.value)} required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white"
                    value={password} onChange={e => setPassword(e.target.value)} required
                />
                <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded transition-colors">
                    Se Connecter
                </button>
                <div className="text-center text-sm text-slate-400">
                    Pas de compte? <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-violet-400 hover:underline">S'inscrire</Link>
                </div>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0613] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div></div>}>
            <LoginContent />
        </Suspense>
    );
}
