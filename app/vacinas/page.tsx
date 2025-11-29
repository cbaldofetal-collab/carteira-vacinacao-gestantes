'use client'

import { useState } from 'react'
import { useApp } from '@/lib/context/AppProvider'
import { formatDateBR } from '@/lib/utils/pregnancy'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, FileText, Download, Calendar, Package, MapPin, User as UserIcon } from 'lucide-react'

export default function VacinasPage() {
    const { records, deleteVaccineRecord, isLoading } = useApp()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este registro?')) return

        setDeletingId(id)
        try {
            await deleteVaccineRecord(id)
        } catch (error) {
            alert('Erro ao excluir registro')
        } finally {
            setDeletingId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando registros...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Minhas Vacinas</h1>
                            <p className="text-muted-foreground mt-2">
                                {records.length} {records.length === 1 ? 'vacina registrada' : 'vacinas registradas'}
                            </p>
                        </div>
                        <Link
                            href="/vacinas/registrar"
                            className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Adicionar
                        </Link>
                    </div>
                </div>

                {/* Export Button */}
                {records.length > 0 && (
                    <div className="mb-6">
                        <button
                            className="inline-flex items-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition"
                            onClick={async () => {
                                const { jsPDF } = await import('jspdf')
                                const doc = new jsPDF()

                                // Título
                                doc.setFontSize(20)
                                doc.text('Carteira de Vacinação para Gestantes', 105, 20, { align: 'center' })

                                doc.setFontSize(12)
                                doc.text(`Total de vacinas: ${records.length}`, 105, 30, { align: 'center' })

                                // Registros
                                let yPos = 45
                                records.forEach((record, index) => {
                                    if (yPos > 270) {
                                        doc.addPage()
                                        yPos = 20
                                    }

                                    doc.setFontSize(14)
                                    doc.text(`${index + 1}. ${record.vaccine?.name || 'Vacina'}`, 20, yPos)

                                    doc.setFontSize(10)
                                    yPos += 7
                                    doc.text(`Dose: ${record.dose_number}ª`, 25, yPos)
                                    yPos += 5
                                    doc.text(`Data: ${formatDateBR(record.application_date)}`, 25, yPos)

                                    if (record.batch_number) {
                                        yPos += 5
                                        doc.text(`Lote: ${record.batch_number}`, 25, yPos)
                                    }
                                    if (record.application_site) {
                                        yPos += 5
                                        doc.text(`Local: ${record.application_site}`, 25, yPos)
                                    }
                                    if (record.professional_name) {
                                        yPos += 5
                                        doc.text(`Profissional: ${record.professional_name}`, 25, yPos)
                                    }
                                    if (record.notes) {
                                        yPos += 5
                                        doc.text(`Obs: ${record.notes}`, 25, yPos)
                                    }

                                    yPos += 12
                                })

                                doc.save('carteira-vacinacao.pdf')
                            }}
                        >
                            <Download className="w-5 h-5" />
                            Exportar PDF
                        </button>
                    </div>
                )}

                {/* Records List */}
                {records.length === 0 ? (
                    <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-lg">
                        <div className="inline-block p-6 bg-muted rounded-full mb-6">
                            <FileText className="w-16 h-16 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                            Nenhuma vacina registrada
                        </h3>
                        <p className="text-muted-foreground mb-8">
                            Comece registrando as vacinas que você já tomou
                        </p>
                        <Link
                            href="/vacinas/registrar"
                            className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-secondary/90 transition shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Registrar Primeira Vacina
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {records.map((record) => (
                            <div
                                key={record.id}
                                className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-xl font-bold text-foreground">
                                                {record.vaccine?.name || 'Vacina'}
                                            </h3>
                                            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                                                {record.dose_number}ª Dose
                                            </span>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="font-medium text-foreground">Data:</span>
                                                    {formatDateBR(record.application_date)}
                                                </div>
                                                {record.pregnancy_week && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="w-4 h-4" />
                                                        <span className="font-medium text-foreground">Semana:</span>
                                                        {record.pregnancy_week}ª gestacional
                                                    </div>
                                                )}
                                                {record.batch_number && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Package className="w-4 h-4" />
                                                        <span className="font-medium text-foreground">Lote:</span>
                                                        {record.batch_number}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                {record.application_site && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="font-medium text-foreground">Local:</span>
                                                        {record.application_site}
                                                    </div>
                                                )}
                                                {record.professional_name && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <UserIcon className="w-4 h-4" />
                                                        <span className="font-medium text-foreground">Profissional:</span>
                                                        {record.professional_name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {record.notes && (
                                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                                <p className="text-sm font-semibold text-foreground mb-1">
                                                    Observações:
                                                </p>
                                                <p className="text-sm text-muted-foreground">{record.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        disabled={deletingId === record.id}
                                        className="ml-4 p-3 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                        title="Excluir registro"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Card */}
                <div className="mt-8 bg-primary/10 border border-primary/20 rounded-2xl p-6">
                    <h3 className="font-bold text-primary mb-2">📋 Sobre seus registros</h3>
                    <ul className="text-sm text-foreground space-y-1">
                        <li>• Mantenha seus registros atualizados para receber alertas precisos</li>
                        <li>• Guarde o número do lote para rastreabilidade</li>
                        <li>• Você pode exportar sua carteira em PDF a qualquer momento</li>
                        <li>• Compartilhe com seu médico para acompanhamento</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
