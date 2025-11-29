'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/lib/context/AppProvider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, User, Calendar, Droplet, Phone, AlertTriangle, X } from 'lucide-react'

export default function PerfilPage() {
    const { user, refreshData } = useApp()
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        name: '',
        due_date: '',
        birth_date: '',
        blood_type: '',
        phone: '',
        allergies: [] as string[],
    })
    const [allergyInput, setAllergyInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                due_date: user.due_date || '',
                birth_date: user.birth_date || '',
                blood_type: user.blood_type || '',
                phone: user.phone || '',
                allergies: user.allergies || [],
            })
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')
        setError('')

        try {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) throw new Error('Não autenticado')

            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: authUser.id,
                    ...formData,
                    email: authUser.email,
                    updated_at: new Date().toISOString(),
                })

            if (updateError) throw updateError

            setMessage('Perfil atualizado com sucesso!')
            await refreshData()

            setTimeout(() => {
                router.push('/dashboard')
            }, 1500)
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar perfil')
        } finally {
            setIsLoading(false)
        }
    }

    const addAllergy = () => {
        if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
            setFormData({
                ...formData,
                allergies: [...formData.allergies, allergyInput.trim()],
            })
            setAllergyInput('')
        }
    }

    const removeAllergy = (allergy: string) => {
        setFormData({
            ...formData,
            allergies: formData.allergies.filter((a) => a !== allergy),
        })
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
                    <p className="text-muted-foreground mt-2">
                        Complete suas informações para receber alertas personalizados
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                    {/* Messages */}
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nome */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Nome Completo *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                    placeholder="Seu nome"
                                />
                            </div>
                        </div>

                        {/* Data Prevista do Parto */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Data Prevista do Parto (DPP) *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="date"
                                    required
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Esta data é usada para calcular sua semana gestacional e alertas
                            </p>
                        </div>

                        {/* Data de Nascimento */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Data de Nascimento
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="date"
                                    value={formData.birth_date}
                                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                />
                            </div>
                        </div>

                        {/* Tipo Sanguíneo */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Tipo Sanguíneo
                            </label>
                            <div className="relative">
                                <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <select
                                    value={formData.blood_type}
                                    onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                >
                                    <option value="">Selecione</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>

                        {/* Telefone */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Telefone
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                        {/* Alergias */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                <AlertTriangle className="inline w-4 h-4 mr-1" />
                                Alergias a Vacinas
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={allergyInput}
                                    onChange={(e) => setAllergyInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                                    className="flex-1 px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                    placeholder="Ex: Ovo, Látex..."
                                />
                                <button
                                    type="button"
                                    onClick={addAllergy}
                                    className="px-6 py-3 bg-secondary/10 text-secondary rounded-lg font-semibold hover:bg-secondary/20 transition"
                                >
                                    Adicionar
                                </button>
                            </div>
                            {formData.allergies.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.allergies.map((allergy) => (
                                        <span
                                            key={allergy}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm"
                                        >
                                            {allergy}
                                            <button
                                                type="button"
                                                onClick={() => removeAllergy(allergy)}
                                                className="hover:text-red-900"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-secondary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                        >
                            {isLoading ? (
                                'Salvando...'
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Salvar Perfil
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Info Card */}
                <div className="mt-8 bg-primary/10 border border-primary/20 rounded-2xl p-6">
                    <h3 className="font-bold text-primary mb-2">💡 Dica</h3>
                    <p className="text-sm text-foreground">
                        Mantenha suas informações atualizadas para receber alertas precisos sobre vacinas e acompanhamento personalizado.
                    </p>
                </div>
            </div>
        </div>
    )
}
