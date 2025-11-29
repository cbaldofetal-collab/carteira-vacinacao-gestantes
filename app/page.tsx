import Link from 'next/link'
import { Shield, Calendar, Bell, FileText, Users, Heart } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Carteira de Vacinação</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Sua gestação,{' '}
                <span className="text-primary">organizada</span> e{' '}
                <span className="text-secondary">segura</span>.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Acompanhe suas vacinas, receba alertas personalizados e proteja você e seu bebê com tecnologia e cuidado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-secondary hover:bg-secondary/90 rounded-lg transition shadow-lg hover:shadow-xl"
                >
                  Começar Agora
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-foreground bg-card hover:bg-muted border border-border rounded-lg transition"
                >
                  Já tenho conta
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Por que usar nossa carteira digital?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Bell className="w-8 h-8" />}
                title="Alertas Inteligentes"
                description="Receba notificações no momento certo para cada vacina, baseado na sua semana gestacional."
                color="primary"
              />

              <FeatureCard
                icon={<Calendar className="w-8 h-8" />}
                title="Calendário Personalizado"
                description="Veja quais vacinas tomar em cada trimestre, com prioridades e janelas ideais."
                color="secondary"
              />

              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Compartilhamento"
                description="Compartilhe sua carteira com médicos, enfermeiros e familiares de forma segura."
                color="accent"
              />

              <FeatureCard
                icon={<FileText className="w-8 h-8" />}
                title="Exportar PDF"
                description="Gere relatórios completos para levar às consultas médicas."
                color="primary"
              />

              <FeatureCard
                icon={<Shield className="w-8 h-8" />}
                title="Histórico Completo"
                description="Registre lote, local e profissional de cada vacina aplicada."
                color="secondary"
              />

              <FeatureCard
                icon={<Heart className="w-8 h-8" />}
                title="Informações Educativas"
                description="Aprenda sobre cada vacina: importância, contraindicações e benefícios."
                color="accent"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-center text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">
                Pronta para começar?
              </h3>
              <p className="text-lg mb-8 opacity-90">
                Crie sua conta gratuita e tenha acesso completo a todas as funcionalidades.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-primary bg-white hover:bg-gray-100 rounded-lg transition shadow-lg"
              >
                Criar Conta Grátis
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Carteira de Vacinação para Gestantes</p>
          <p className="mt-2">Protegendo você e seu bebê com tecnologia e cuidado 💕</p>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'secondary' | 'accent'
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
