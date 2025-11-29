'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, LogOut } from "lucide-react"
import { useApp } from "@/lib/context/AppProvider"

export function Header() {
    const { signOut } = useApp()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                        <Shield className="h-6 w-6 text-secondary" />
                        <span className="hidden font-bold sm:inline-block">
                            Carteira de Vacinação
                        </span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Dashboard
                        </Link>
                        <Link href="/calendario" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Calendário
                        </Link>
                        <Link href="/vacinas" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Minhas Vacinas
                        </Link>
                        <Link href="/perfil" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Perfil
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center">
                        <Button variant="ghost" size="sm" onClick={signOut}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
