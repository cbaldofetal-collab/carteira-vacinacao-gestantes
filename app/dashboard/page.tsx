'use client'

import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/context/AppProvider'
import { formatDateBR } from '@/lib/utils/pregnancy'
import Link from 'next/link'
import { Heart, Calendar, Shield, Activity, Bell, Plus, CheckCircle, AlertCircle, Syringe } from 'lucide-react'

export default function DashboardPage() {
    const { user, dashboardData, alerts, records, isLoading } = useApp()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
        )
    }

    if (!user || !dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Erro ao carregar dados</p>
                    <Link href="/login">
                        <Button>Voltar ao login</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container max-w-7xl py-6 space-y-6">
                {/* Welcome Section */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                        Olá, {user.name}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Acompanhe suas vacinas e proteja você e seu bebê.
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Semana Gestacional */}
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Semana Gestacional
                            </CardTitle>
                            <Heart className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{dashboardData.currentWeek}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {dashboardData.trimester}º Trimestre
                            </p>
                        </CardContent>
                    </Card>

                    {/* Data Prevista */}
                    <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Data Prevista (DPP)
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-secondary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-secondary">
                                {dashboardData.daysUntilDueDate} dias
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatDateBR(user.due_date)}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Vacinas Completas */}
                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Vacinas Completas
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-accent">{dashboardData.vaccinesCompleted}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Registradas no sistema
                            </p>
                        </CardContent>
                    </Card>

                    {/* Vacinas Pendentes */}
                    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Vacinas Pendentes
                            </CardTitle>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-500">{dashboardData.vaccinesPending}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Para tomar
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Alertas */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5 text-primary" />
                                        Alertas Importantes
                                    </CardTitle>
                                    <CardDescription>Vacinas e lembretes</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {alerts.length > 0 ? (
                                alerts.slice(0, 3).map((alert) => (
                                    <div
                                        key={alert.id}
                                        className="flex items-start space-x-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20"
                                    >
                                        <div className="rounded-full bg-secondary/20 p-2">
                                            <Bell className="h-4 w-4 text-secondary" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">{alert.message}</p>
                                            {alert.vaccine && (
                                                <p className="text-xs text-muted-foreground">
                                                    Vacina: {alert.vaccine.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground p-3">
                                    Nenhum alerta no momento. Tudo em dia! 🎉
                                </div>
                            )}

                            <div className="flex items-start space-x-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                                <div className="rounded-full bg-accent/20 p-2">
                                    <Shield className="h-4 w-4 text-accent" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Mantenha sua carteira atualizada</p>
                                    <p className="text-xs text-muted-foreground">
                                        Registre as vacinas assim que tomá-las
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações Rápidas</CardTitle>
                            <CardDescription>Acesse suas funcionalidades</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/vacinas/registrar">
                                <Button variant="outline" className="w-full justify-start">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Registrar Vacina
                                </Button>
                            </Link>
                            <Link href="/calendario">
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Ver Calendário
                                </Button>
                            </Link>
                            <Link href="/vacinas">
                                <Button variant="outline" className="w-full justify-start">
                                    <Syringe className="mr-2 h-4 w-4" />
                                    Minhas Vacinas
                                </Button>
                            </Link>
                            <Link href="/perfil">
                                <Button variant="outline" className="w-full justify-start">
                                    <Heart className="mr-2 h-4 w-4" />
                                    Meu Perfil
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Últimas Vacinas */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Últimas Vacinas Registradas</CardTitle>
                                <CardDescription>Seu histórico recente</CardDescription>
                            </div>
                            <Link href="/vacinas">
                                <Button variant="ghost" size="sm">
                                    Ver todas
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {records.slice(0, 3).map((record) => (
                                <div
                                    key={record.id}
                                    className="flex items-center justify-between p-4 rounded-lg border"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{record.vaccine?.name || 'Vacina'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDateBR(record.application_date)} • Dose {record.dose_number}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                                            Completa
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {records.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhuma vacina registrada ainda.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
