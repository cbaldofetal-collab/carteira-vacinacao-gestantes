// =====================================================
// UTILS - Cálculos de Gestação e Alertas
// =====================================================

/**
 * Calcula a semana gestacional atual baseado na DPP
 */
export function calculateCurrentWeek(dueDate: string | Date): number {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
    const now = new Date()

    // DPP é 40 semanas após a concepção
    // Calcular quantas semanas faltam para DPP
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weeksUntilDue = Math.floor(diffDays / 7)

    // Semana atual = 40 - semanas até DPP
    const currentWeek = 40 - weeksUntilDue

    return Math.max(1, Math.min(42, currentWeek))
}

/**
 * Calcula o trimestre baseado na semana gestacional
 */
export function calculateTrimester(week: number): 1 | 2 | 3 {
    if (week <= 13) return 1
    if (week <= 27) return 2
    return 3
}

/**
 * Calcula quantos dias faltam para a DPP
 */
export function daysUntilDueDate(dueDate: string | Date): number {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Verifica se está no puerpério (até 45 dias pós-parto)
 */
export function isPostpartum(dueDate: string | Date): boolean {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
    const now = new Date()
    const diffTime = now.getTime() - due.getTime()
    const daysSinceDue = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    return daysSinceDue >= 0 && daysSinceDue <= 45
}

/**
 * Verifica se a vacina está na janela ideal
 */
export function isInIdealWindow(
    currentWeek: number,
    recommendedWeeks?: string
): boolean {
    if (!recommendedWeeks) return false

    // Parse "28-36 semanas" ou "A partir de 20ª semana"
    if (recommendedWeeks.includes('Qualquer')) return true
    if (recommendedWeeks.includes('NÃO')) return false

    const match = recommendedWeeks.match(/(\d+)-(\d+)/)
    if (match) {
        const min = parseInt(match[1])
        const max = parseInt(match[2])
        return currentWeek >= min && currentWeek <= max
    }

    const startMatch = recommendedWeeks.match(/partir de (\d+)/)
    if (startMatch) {
        const min = parseInt(startMatch[1])
        return currentWeek >= min
    }

    return false
}

/**
 * Formata data para padrão brasileiro
 */
export function formatDateBR(date: string | Date | undefined): string {
    if (!date) return '-'
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return '-'
    return new Intl.DateTimeFormat('pt-BR').format(d)
}

/**
 * Calcula a próxima dose baseado no intervalo
 */
export function calculateNextDoseDate(
    lastDoseDate: string | Date,
    interval: string
): Date | null {
    const last = typeof lastDoseDate === 'string' ? new Date(lastDoseDate) : lastDoseDate

    // Parse "0-1-6 meses" ou "6-12 meses"
    const monthMatch = interval.match(/(\d+)-(\d+) meses/)
    if (monthMatch) {
        const months = parseInt(monthMatch[1])
        const next = new Date(last)
        next.setMonth(next.getMonth() + months)
        return next
    }

    const singleMonthMatch = interval.match(/(\d+) meses/)
    if (singleMonthMatch) {
        const months = parseInt(singleMonthMatch[1])
        const next = new Date(last)
        next.setMonth(next.getMonth() + months)
        return next
    }

    return null
}

/**
 * Gera mensagem de alerta personalizada
 */
export function generateAlertMessage(
    vaccineName: string,
    alertType: string,
    currentWeek: number
): string {
    switch (alertType) {
        case 'ideal_window':
            return `🎯 Você está na janela ideal para a vacina ${vaccineName}! (Semana ${currentWeek})`
        case 'next_dose':
            return `💉 Chegou a hora da próxima dose de ${vaccineName}`
        case 'overdue':
            return `⚠️ A vacina ${vaccineName} está atrasada. Agende com seu médico!`
        case 'postpartum':
            return `👶 Vacina ${vaccineName} disponível no puerpério (até 45 dias pós-parto)`
        case 'annual':
            return `🗓️ Chegou a época de vacinação anual: ${vaccineName}`
        default:
            return `Lembrete: ${vaccineName}`
    }
}

/**
 * Obtém label do trimestre
 */
export function getTrimesterLabel(trimester: 1 | 2 | 3): string {
    const labels = {
        1: '1º Trimestre',
        2: '2º Trimestre',
        3: '3º Trimestre',
    }
    return labels[trimester]
}

/**
 * Obtém label da semana
 */
export function getWeekLabel(week: number): string {
    return `Semana ${week}`
}
