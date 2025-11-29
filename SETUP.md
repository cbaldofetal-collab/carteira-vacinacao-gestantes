# 🚀 PRÓXIMOS PASSOS - Configuração do Supabase

## 1️⃣ Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta (se não tiver)
4. Clique em "New Project"
5. Escolha:
   - **Name**: carteira-vacinacao-gestantes
   - **Database Password**: (crie uma senha forte e guarde!)
   - **Region**: South America (São Paulo)
6. Aguarde 2-3 minutos para o projeto ser criado

---

## 2️⃣ Executar Scripts SQL

### Script 1: Criar Tabelas (schema.sql)

1. No painel do Supabase, clique em **SQL Editor** (ícone </> no menu lateral)
2. Clique em **New Query**
3. Abra o arquivo `supabase/schema.sql` deste projeto
4. Copie TODO o conteúdo
5. Cole no SQL Editor
6. Clique em **Run** (botão verde)
7. Aguarde a mensagem de sucesso ✅

### Script 2: Inserir Vacinas (seed_vaccines.sql)

1. Ainda no SQL Editor, clique em **New Query** novamente
2. Abra o arquivo `supabase/seed_vaccines.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **Run**
6. Você deve ver: `total_vaccines: 13` ✅

---

## 3️⃣ Configurar Autenticação

1. No painel do Supabase, clique em **Authentication** (ícone de cadeado)
2. Clique em **Providers**
3. Configure **Email**:
   - Certifique-se que está **Enabled**
   - **DESMARQUE** "Confirm email" (para facilitar testes)
   - Clique em **Save**

4. (Opcional) Configure **Google**:
   - Clique em **Google**
   - Ative o toggle
   - Você precisará criar um projeto no Google Cloud Console
   - Por enquanto, pode pular esta etapa

---

## 4️⃣ Copiar Credenciais

1. No painel do Supabase, clique em **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** key (começa com `eyJ...`)

---

## 5️⃣ Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` neste projeto
2. Substitua:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=cole_a_project_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=cole_a_anon_key_aqui
   ```

---

## 6️⃣ Rodar o Projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## ✅ Checklist

- [ ] Projeto criado no Supabase
- [ ] Script `schema.sql` executado
- [ ] Script `seed_vaccines.sql` executado
- [ ] Autenticação por email configurada
- [ ] "Confirm email" desabilitado
- [ ] Credenciais copiadas
- [ ] `.env.local` atualizado
- [ ] Servidor rodando (`npm run dev`)

---

## 🆘 Problemas?

### "relation does not exist"
→ Você não executou o `schema.sql`. Volte ao passo 2️⃣

### "Invalid API key"
→ Verifique se copiou corretamente as credenciais no passo 4️⃣

### "Email not confirmed"
→ Certifique-se de desabilitar "Confirm email" no passo 3️⃣

---

**Depois de concluir estes passos, você terá:**
✅ Sistema de login funcionando
✅ Banco de dados com 13 vacinas
✅ Pronto para desenvolver o Dashboard!
