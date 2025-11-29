'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Mail, Lock, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setMessage('')

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                setMessage('Conta criada! Redirecionando...')
                setTimeout(() => router.push('/perfil'), 1500)
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        setIsLoading(true)
        setError('')

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error: any) {
            setError(error.message)
            setIsLoading(false)
        }
    }

    const handlePasswordReset = async () => {
        if (!email) {
            setError('Digite seu email para recuperar a senha')
            return
        }

        setIsLoading(true)
        setError('')
        setMessage('')

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })
            if (error) throw error
            setMessage('Email de recuperação enviado!')
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Link>

                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        {isSignUp ? 'Criar Conta' : 'Bem-vinda de volta'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isSignUp ? 'Comece a cuidar da sua saúde' : 'Entre na sua conta'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? 'Carregando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
                        </button>
                    </form>

                    {/* Forgot Password */}
                    {!isSignUp && (
                        <button
                            onClick={handlePasswordReset}
                            disabled={isLoading}
                            className="w-full mt-3 text-sm text-primary hover:text-primary/80 font-medium transition"
                        >
                            Esqueci minha senha
                        </button>
                    )}



                    {/* Toggle Sign Up/Sign In */}
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                        {' '}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError('')
                                setMessage('')
                            }}
                            className="text-primary hover:text-primary/80 font-semibold transition"
                        >
                            {isSignUp ? 'Entrar' : 'Criar conta'}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    Protegendo você e seu bebê 💕
                </p>
            </div>
        </div>
    )
}
