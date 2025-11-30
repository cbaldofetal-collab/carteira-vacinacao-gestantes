'use client'

import { useState } from 'react'
import { useApp } from '@/lib/context/AppProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Syringe, Calendar, Package, MapPin, User, FileText, CheckCircle, Image as ImageIcon } from 'lucide-react'

export default function RegistrarVacinaPage() {
    const { user, vaccines, dashboardData, addVaccineRecord } = useApp()
    const router = useRouter()

    const [formData, setFormData] = useState({
        vaccine_id: '',
        vaccine_name: '',
        dose_number: 1,
        application_date: new Date().toISOString().split('T')[0],
        batch_number: '',
        application_site: '',
        professional_name: '',
        notes: '',
    })
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPhotoFile(file)
            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()

            let vaccineId = formData.vaccine_id

            // Se não tem vaccine_id mas tem vaccine_name, buscar ou criar a vacina
            if (!vaccineId && formData.vaccine_name) {
                // Primeiro, tentar buscar se já existe
                const { data: existingVaccine } = await supabase
                    .from('vaccines')
                    .select('id')
                    .eq('name', formData.vaccine_name)
                    .single()

                if (existingVaccine) {
                    // Vacina já existe, usar o ID dela
                    vaccineId = existingVaccine.id
                } else {
                    // Vacina não existe, criar nova
                    const { data: newVaccine, error: vaccineError } = await supabase
                        .from('vaccines')
                        .insert({
                            name: formData.vaccine_name,
                            presentation: 'Intramuscular',
                            recommended_weeks: 'Conforme orientação médica',
                            doses: 1,
                            priority: 'Média',
                            contraindicated: false
                        })
                        .select()
                        .single()

                    if (vaccineError) throw vaccineError
                    vaccineId = newVaccine.id
                }
            }

            if (!vaccineId) {
                throw new Error('Selecione ou digite o nome de uma vacina')
            }

            // Upload da foto se houver
            let photoUrl = ''
            if (photoFile) {
                const fileExt = photoFile.name.split('.').pop()
                const fileName = `${user?.id}/${Date.now()}.${fileExt}`

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('vaccine-photos')
                    .upload(fileName, photoFile)

                if (uploadError) throw uploadError

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('vaccine-photos')
                    .getPublicUrl(fileName)

                photoUrl = publicUrl
            }

            await addVaccineRecord({
                vaccine_id: vaccineId,
                dose_number: formData.dose_number,
                application_date: formData.application_date,
                batch_number: formData.batch_number,
                application_site: formData.application_site,
                professional_name: formData.professional_name,
                notes: formData.notes,
                pregnancy_week: dashboardData?.currentWeek,
                photo_url: photoUrl || undefined,
            })

            setSuccess(true)
            setTimeout(() => {
                router.push('/dashboard')
            }, 1500)
        } catch (err: any) {
            setError(err.message || 'Erro ao registrar vacina')
        } finally {
            setIsLoading(false)
        }
    }

    const selectedVaccine = vaccines.find(v => v.id === formData.vaccine_id)

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
                    <h1 className="text-3xl font-bold text-foreground">Registrar Vacina</h1>
                    <p className="text-muted-foreground mt-2">
                        Adicione uma vacina que você já tomou
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-accent/10 border-2 border-accent rounded-2xl p-8 mb-8 text-center">
                        <div className="inline-block p-4 bg-accent/20 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Vacina Registrada!</h3>
                        <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
                    </div>
                )}

                {/* Form Card */}
                {!success && (
                    <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Vaccine Selection */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Vacina *
                                </label>
                                <div className="relative">
                                    <Syringe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.vaccine_name}
                                        onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                        placeholder="Digite o nome da vacina (ex: Hepatite B, dTpa, COVID-19)"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Digite o nome da vacina que você tomou
                                </p>
                            </div>

                            {/* Vaccine Info */}
                            {selectedVaccine && (
                                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                                    <p className="text-sm font-semibold text-primary mb-2">
                                        Informações da Vacina:
                                    </p>
                                    <p className="text-sm text-foreground">
                                        {selectedVaccine.presentation} • {selectedVaccine.recommended_weeks}
                                    </p>
                                    {selectedVaccine.doses > 1 && (
                                        <p className="text-sm text-foreground mt-1">
                                            Total de doses: {selectedVaccine.doses} • {selectedVaccine.dose_interval}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Dose Number */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Número da Dose *
                                </label>
                                <select
                                    required
                                    value={formData.dose_number}
                                    onChange={(e) => setFormData({ ...formData, dose_number: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                >
                                    <option value="1">1ª Dose</option>
                                    <option value="2">2ª Dose</option>
                                    <option value="3">3ª Dose</option>
                                    <option value="4">Reforço</option>
                                </select>
                            </div>

                            {/* Application Date */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Data de Aplicação *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="date"
                                        required
                                        value={formData.application_date}
                                        onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                    />
                                </div>
                            </div>

                            {/* Batch Number */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Número do Lote
                                </label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={formData.batch_number}
                                        onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                        placeholder="Ex: L12345678"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Importante para rastreabilidade
                                </p>
                            </div>

                            {/* Application Site */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Local de Aplicação
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={formData.application_site}
                                        onChange={(e) => setFormData({ ...formData, application_site: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                        placeholder="Ex: UBS Centro, Clínica Dr. Silva"
                                    />
                                </div>
                            </div>

                            {/* Professional Name */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Profissional Responsável
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={formData.professional_name}
                                        onChange={(e) => setFormData({ ...formData, professional_name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background"
                                        placeholder="Nome do enfermeiro(a) ou médico(a)"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Observações
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition resize-none bg-background"
                                        placeholder="Reações, sintomas, etc."
                                    />
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Foto do Comprovante (Opcional)
                                </label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition bg-background file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                                        />
                                    </div>
                                    {photoPreview && (
                                        <div className="relative rounded-lg overflow-hidden border-2 border-border max-w-xs">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Registre a foto do cartão de vacinação
                                </p>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4">
                                <Link
                                    href="/dashboard"
                                    className="flex-1 px-6 py-4 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-muted transition text-center"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-secondary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isLoading ? (
                                        'Salvando...'
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Salvar Registro
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Help Text */}
                <div className="mt-8 bg-primary/10 border border-primary/20 rounded-2xl p-6">
                    <h3 className="font-bold text-primary mb-2">💡 Dica</h3>
                    <p className="text-sm text-foreground">
                        Registre suas vacinas assim que tomá-las para manter seu histórico completo e receber alertas precisos sobre próximas doses.
                    </p>
                </div>
            </div>
        </div>
    )
}
