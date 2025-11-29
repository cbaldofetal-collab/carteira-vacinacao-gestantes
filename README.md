# 💉 Carteira de Vacinação para Gestantes

Sistema completo de acompanhamento de vacinação para gestantes com alertas inteligentes, calendário personalizado e compartilhamento com profissionais de saúde.

## 🚀 Funcionalidades

### ✅ Implementadas (Fase 1)
- **Autenticação Completa**
  - Login com email/senha
  - Login com Google
  - Recuperação de senha
  - Cadastro de nova usuária

- **Estrutura do Banco de Dados**
  - 14 vacinas cadastradas (dTpa, Hepatite B, Influenza, COVID-19, VSR, etc.)
  - Sistema de alertas inteligentes
  - Suporte a múltiplas gestações
  - Compartilhamento com familiares/médicos

### 🔨 Em Desenvolvimento (Fase 2)
- Dashboard principal
- Calendário vacinal por trimestre
- Registro de vacinas
- Sistema de notificações
- Geração de PDF
- Modo pós-parto

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)

## 🛠️ Configuração

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor** e execute os scripts na ordem:
   - `supabase/schema.sql` (cria as tabelas)
   - `supabase/seed_vaccines.sql` (insere as 14 vacinas)

3. Vá em **Authentication** → **Providers**:
   - Ative **Email**
   - Desmarque "Confirm email" (para facilitar testes)
   - Ative **Google** (opcional, mas recomendado)

4. Copie suas credenciais em **Project Settings** → **API**:
   - Project URL
   - anon public key

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env.local` e substitua:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```

### 3. Instalar e Rodar

```bash
# Já instalado! Apenas rode:
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **profiles**: Dados da gestante (nome, DPP, alergias)
- **vaccines**: Catálogo de 14 vacinas
- **vaccine_records**: Registros de vacinação
- **alerts**: Sistema de alertas inteligentes
- **pregnancies**: Suporte a múltiplas gestações
- **shared_access**: Compartilhamento com médicos/familiares

## 🎯 Próximos Passos

1. ✅ Autenticação configurada
2. ⏳ Criar Dashboard principal
3. ⏳ Implementar calendário vacinal
4. ⏳ Sistema de registro de vacinas
5. ⏳ Alertas automáticos
6. ⏳ Geração de PDF

## 📱 Tecnologias

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Ícones**: Lucide React
- **Deploy**: Vercel (recomendado)

## 🆘 Problemas Comuns

### "Invalid API key"
- Verifique se copiou corretamente as chaves do Supabase
- Reinicie o servidor: `Ctrl+C` e `npm run dev`

### "Table does not exist"
- Execute os scripts SQL no Supabase SQL Editor
- Ordem: `schema.sql` → `seed_vaccines.sql`

### Login não funciona
- Verifique se desabilitou "Confirm email" no Supabase
- Verifique se o Google OAuth está configurado (se usar)

## 📞 Suporte

Criado com ❤️ para proteger gestantes e seus bebês!
