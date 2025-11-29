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

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-card text-muted-foreground">ou</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-background border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continuar com Google
                    </button>

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
