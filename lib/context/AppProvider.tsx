'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { UserProfile, Vaccine, VaccineRecord, Alert, DashboardData } from '@/lib/types'
import { calculateCurrentWeek, calculateTrimester, daysUntilDueDate } from '@/lib/utils/pregnancy'

interface AppContextType {
    user: UserProfile | null
    vaccines: Vaccine[]
    records: VaccineRecord[]
    alerts: Alert[]
    dashboardData: DashboardData | null
    isLoading: boolean
    refreshData: () => Promise<void>
    addVaccineRecord: (record: Partial<VaccineRecord>) => Promise<void>
    deleteVaccineRecord: (id: string) => Promise<void>
    markAlertAsRead: (id: string) => Promise<void>
    signOut: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [vaccines, setVaccines] = useState<Vaccine[]>([])
    const [records, setRecords] = useState<VaccineRecord[]>([])
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadData()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null)
                setVaccines([])
                setRecords([])
                setAlerts([])
                setDashboardData(null)
                router.push('/login')
            } else if (event === 'SIGNED_IN') {
                loadData()
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const loadData = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser()

            if (!authUser) {
                setIsLoading(false)
                return
            }

            // Load user profile
            let { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()

            // Se não tiver perfil, cria um automaticamente
            if (!profile) {
                const newProfile = {
                    id: authUser.id,
                    email: authUser.email,
                    name: authUser.user_metadata.full_name || authUser.email?.split('@')[0] || 'Gestante',
                    due_date: new Date(new Date().setDate(new Date().getDate() + 180)).toISOString().split('T')[0], // Data padrão: hoje + 6 meses
                }

                const { data: createdProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert(newProfile)
                    .select()
                    .single()

                if (!createError && createdProfile) {
                    profile = createdProfile
                }
            }

            if (profile) {
                setUser(profile)
            }

            // Load all vaccines
            const { data: vaccinesData } = await supabase
                .from('vaccines')
                .select('*')
                .order('name')

            if (vaccinesData) {
                setVaccines(vaccinesData)
            }

            // Load user's vaccine records
            const { data: recordsData } = await supabase
                .from('vaccine_records')
                .select('*, vaccine:vaccines(*)')
                .eq('user_id', authUser.id)
                .order('application_date', { ascending: false })

            if (recordsData) {
                setRecords(recordsData)
            }

            // Load alerts
            const { data: alertsData } = await supabase
                .from('alerts')
                .select('*, vaccine:vaccines(*)')
                .eq('user_id', authUser.id)
                .eq('is_read', false)
                .order('alert_date')

            if (alertsData) {
                setAlerts(alertsData)
            }

            // Calculate dashboard data
            if (profile) {
                const currentWeek = calculateCurrentWeek(profile.due_date)
                const trimester = calculateTrimester(currentWeek)
                const daysUntil = daysUntilDueDate(profile.due_date)

                const vaccinesCompleted = recordsData?.length || 0
                const vaccinesPending = (vaccinesData?.length || 0) - vaccinesCompleted
                const vaccinesOverdue = alertsData?.filter(a => a.alert_type === 'overdue').length || 0

                setDashboardData({
                    currentWeek,
                    trimester,
                    daysUntilDueDate: daysUntil,
                    vaccinesCompleted,
                    vaccinesPending,
                    vaccinesOverdue,
                    upcomingVaccines: [],
                    alerts: alertsData || [],
                })
            }
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const refreshData = async () => {
        await loadData()
    }

    const addVaccineRecord = async (record: Partial<VaccineRecord>) => {
        if (!user) return

        try {
            const { error } = await supabase.from('vaccine_records').insert({
                user_id: user.id,
                ...record,
            })

            if (error) throw error
            await refreshData()
        } catch (error) {
            console.error('Error adding vaccine record:', error)
            throw error
        }
    }

    const deleteVaccineRecord = async (id: string) => {
        try {
            const { error } = await supabase
                .from('vaccine_records')
                .delete()
                .eq('id', id)

            if (error) throw error
            await refreshData()
        } catch (error) {
            console.error('Error deleting vaccine record:', error)
            throw error
        }
    }

    const markAlertAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('alerts')
                .update({ is_read: true })
                .eq('id', id)

            if (error) throw error
            await refreshData()
        } catch (error) {
            console.error('Error marking alert as read:', error)
        }
    }

    const signOut = async () => {
        try {
            await supabase.auth.signOut()
            setUser(null)
            setVaccines([])
            setRecords([])
            setAlerts([])
            setDashboardData(null)
            router.push('/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <AppContext.Provider
            value={{
                user,
                vaccines,
                records,
                alerts,
                dashboardData,
                isLoading,
                refreshData,
                addVaccineRecord,
                deleteVaccineRecord,
                markAlertAsRead,
                signOut,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
