// =====================================================
// TYPES - Carteira de Vacinação para Gestantes
// =====================================================

export interface UserProfile {
    id: string
    name: string
    email?: string
    due_date: string // ISO date
    birth_date?: string
    blood_type?: string
    allergies?: string[]
    phone?: string
    created_at: string
    updated_at: string
}

export interface Vaccine {
    id: string
    name: string
    presentation?: string
    recommended_weeks?: string
    trimester?: number | null
    doses: number
    dose_interval?: string
    priority?: string
    contraindicated: boolean
    contraindication_note?: string
    reinforcement_info?: string
    observations?: string
    educational_info?: string
    created_at: string
}

export interface VaccineRecord {
    id: string
    user_id: string
    vaccine_id: string
    dose_number: number
    application_date: string // ISO date
    batch_number?: string
    application_site?: string
    professional_name?: string
    photo_url?: string
    notes?: string
    pregnancy_week?: number
    created_at: string
    // Joined data
    vaccine?: Vaccine
}

export interface Alert {
    id: string
    user_id: string
    vaccine_id?: string
    alert_type: 'ideal_window' | 'next_dose' | 'overdue' | 'postpartum' | 'annual'
    alert_date: string // ISO date
    message: string
    is_read: boolean
    is_sent: boolean
    created_at: string
    // Joined data
    vaccine?: Vaccine
}

export interface SharedAccess {
    id: string
    owner_id: string
    shared_with_email: string
    access_type: 'view' | 'edit' | 'medical'
    is_active: boolean
    created_at: string
    expires_at?: string
}

export interface Pregnancy {
    id: string
    user_id: string
    due_date: string // ISO date
    is_current: boolean
    outcome?: 'ongoing' | 'delivered' | 'miscarriage' | 'other'
    delivery_date?: string
    notes?: string
    created_at: string
}

// Helper types
export interface VaccineWithRecords extends Vaccine {
    records: VaccineRecord[]
    nextDoseDate?: string
    isComplete: boolean
    isOverdue: boolean
    isInIdealWindow: boolean
}

export interface DashboardData {
    currentWeek: number
    trimester: 1 | 2 | 3
    daysUntilDueDate: number
    vaccinesCompleted: number
    vaccinesPending: number
    vaccinesOverdue: number
    upcomingVaccines: VaccineWithRecords[]
    alerts: Alert[]
}
