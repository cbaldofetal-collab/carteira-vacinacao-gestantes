'use client'

import React from 'react'
import { useApp } from '@/lib/context/AppProvider'
import { isInIdealWindow } from '@/lib/utils/pregnancy'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, AlertCircle, XCircle, Info, Plus } from 'lucide-react'

export default function CalendarioPage() {
    const { user, vaccines, records, dashboardData, isLoading } = useApp()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando calendário...</p>
                </div>
            </div>
        )
    }

    if (!user || !dashboardData) {
        return null
    }

    // Group vaccines by trimester
    const vaccinesByTrimester = {
        1: vaccines.filter(v => v.trimester === 1),
        2: vaccines.filter(v => v.trimester === 2),
        3: vaccines.filter(v => v.trimester === 3),
        any: vaccines.filter(v => v.trimester === null),
    }

    const getVaccineStatus = (vaccine: any) => {
        const hasRecord = records.some(r => r.vaccine_id === vaccine.id)

        if (hasRecord) {
            return { status: 'completed', label: 'Completa', color: 'accent' }
        }

        if (vaccine.contraindicated) {
            return { status: 'contraindicated', label: 'Contraindicada', color: 'red' }
        }

        const inWindow = isInIdealWindow(dashboardData.currentWeek, vaccine.recommended_weeks)

        if (inWindow) {
            return { status: 'ideal', label: 'Janela Ideal', color: 'primary' }
        }

        return { status: 'pending', label: 'Pendente', color: 'gray' }
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground">Calendário Vacinal</h1>
                    <p className="text-muted-foreground mt-2">
                        Veja todas as vacinas recomendadas para cada fase da gestação
                    </p>
                </div>

                {/* Current Status */}
                <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white mb-8 shadow-lg">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-white/80 text-sm mb-1">Semana Atual</p>
                            <p className="text-3xl font-bold">{dashboardData.currentWeek}</p>
                        </div>
                        <div>
                            <p className="text-white/80 text-sm mb-1">Trimestre</p>
                            <p className="text-3xl font-bold">{dashboardData.trimester}º</p>
                        </div>
                        <div>
                            <p className="text-white/80 text-sm mb-1">Completas</p>
                            <p className="text-3xl font-bold">{dashboardData.vaccinesCompleted}</p>
                        </div>
                        <div>
                            <p className="text-white/80 text-sm mb-1">Pendentes</p>
                            <p className="text-3xl font-bold">{dashboardData.vaccinesPending}</p>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-8">
                    <h3 className="font-bold text-lg mb-4 text-foreground">Legenda</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-accent" />
                            <span className="text-sm text-muted-foreground">Completa</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <span className="text-sm text-muted-foreground">Janela Ideal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Pendente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm text-muted-foreground">Contraindicada</span>
                        </div>
                    </div>
                </div>

                {/* Vaccines by Trimester */}
                <div className="space-y-8">
                    {/* 1º Trimestre */}
                    <TrimesterSection
                        title="1º Trimestre (0-13 semanas)"
                        vaccines={vaccinesByTrimester[1]}
                        currentWeek={dashboardData.currentWeek}
                        getVaccineStatus={getVaccineStatus}
                    />

                    {/* 2º Trimestre */}
                    <TrimesterSection
                        title="2º Trimestre (14-27 semanas)"
                        vaccines={vaccinesByTrimester[2]}
                        currentWeek={dashboardData.currentWeek}
                        getVaccineStatus={getVaccineStatus}
                    />

                    {/* 3º Trimestre */}
                    <TrimesterSection
                        title="3º Trimestre (28-40 semanas)"
                        vaccines={vaccinesByTrimester[3]}
                        currentWeek={dashboardData.currentWeek}
                        getVaccineStatus={getVaccineStatus}
                    />

                    {/* Qualquer Período */}
                    {vaccinesByTrimester.any.length > 0 && (
                        <TrimesterSection
                            title="Qualquer Período da Gestação"
                            vaccines={vaccinesByTrimester.any}
                            currentWeek={dashboardData.currentWeek}
                            getVaccineStatus={getVaccineStatus}
                        />
                    )}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link
                        href="/vacinas/registrar"
                        className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-secondary/90 transition shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Registrar Vacina Tomada
                    </Link>
                </div>
            </div>
        </div>
    )
}

interface TrimesterSectionProps {
    title: string
    vaccines: any[]
    currentWeek: number
    getVaccineStatus: (vaccine: any) => any
}

function TrimesterSection({ title, vaccines, currentWeek, getVaccineStatus }: TrimesterSectionProps) {
    if (vaccines.length === 0) return null

    return (
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
            <div className="space-y-4">
                {vaccines.map((vaccine) => {
                    const status = getVaccineStatus(vaccine)
                    return <VaccineCard key={vaccine.id} vaccine={vaccine} status={status} />
                })}
            </div>
        </div>
    )
}

interface VaccineCardProps {
    vaccine: any
    status: any
}

function VaccineCard({ vaccine, status }: VaccineCardProps) {
    const [showDetails, setShowDetails] = React.useState(false)

    const statusIcons: Record<string, React.ReactNode> = {
        completed: <CheckCircle className="w-6 h-6 text-accent" />,
        ideal: <Clock className="w-6 h-6 text-primary" />,
        pending: <AlertCircle className="w-6 h-6 text-muted-foreground" />,
        contraindicated: <XCircle className="w-6 h-6 text-red-600" />,
    }

    const statusColors: Record<string, string> = {
        accent: 'bg-accent/10 border-accent/20',
        primary: 'bg-primary/10 border-primary/20',
        gray: 'bg-muted border-border',
        red: 'bg-red-50 border-red-200',
    }

    return (
        <div className={`border-2 rounded-lg p-4 ${statusColors[status.color] || statusColors.gray}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">{statusIcons[status.status] || statusIcons.pending}</div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground">{vaccine.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {vaccine.presentation} • {vaccine.recommended_weeks}
                        </p>
                        {vaccine.doses > 1 && (
                            <p className="text-sm text-muted-foreground">
                                {vaccine.doses} doses • {vaccine.dose_interval}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color === 'accent' ? 'bg-accent/20 text-accent' :
                                    status.color === 'primary' ? 'bg-primary/20 text-primary' :
                                        status.color === 'red' ? 'bg-red-100 text-red-700' :
                                            'bg-muted text-muted-foreground'
                                }`}>
                                {status.label}
                            </span>
                            {vaccine.priority && (
                                <span className="text-xs px-3 py-1 rounded-full font-medium bg-secondary/20 text-secondary">
                                    Prioridade: {vaccine.priority}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="ml-4 p-2 hover:bg-background rounded-lg transition"
                >
                    <Info className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            {showDetails && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                    {vaccine.educational_info && (
                        <div>
                            <p className="text-sm font-semibold text-foreground mb-1">Informações:</p>
                            <p className="text-sm text-muted-foreground">{vaccine.educational_info}</p>
                        </div>
                    )}
                    {vaccine.observations && (
                        <div>
                            <p className="text-sm font-semibold text-foreground mb-1">Observações:</p>
                            <p className="text-sm text-muted-foreground">{vaccine.observations}</p>
                        </div>
                    )}
                    {vaccine.contraindication_note && (
                        <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-red-700 mb-1">⚠️ Contraindicação:</p>
                            <p className="text-sm text-red-600">{vaccine.contraindication_note}</p>
                        </div>
                    )}
                    {vaccine.reinforcement_info && (
                        <div>
                            <p className="text-sm font-semibold text-foreground mb-1">Reforços:</p>
                            <p className="text-sm text-muted-foreground">{vaccine.reinforcement_info}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
