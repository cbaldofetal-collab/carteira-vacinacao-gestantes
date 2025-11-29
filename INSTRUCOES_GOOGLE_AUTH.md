# Configuração do Google Auth no Supabase

Para que o botão "Continuar com Google" funcione, você precisa configurar as credenciais no Supabase.

### Passo 1: Pegar a URL de Callback no Supabase
1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá em **Authentication** > **Providers**.
3. Clique em **Google**.
4. Copie a **Callback URL** (algo como `https://seu-projeto.supabase.co/auth/v1/callback`). Deixe essa aba aberta.

### Passo 2: Criar Credenciais no Google Cloud
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto (ex: "Carteira Vacinação").
3. Vá em **APIs & Services** > **OAuth consent screen**.
   - Escolha **External**.
   - Preencha **App name** e **User support email**.
   - Salve e continue.
4. Vá em **Credentials** > **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: "Supabase Login".
   - **Authorized redirect URIs**: Cole a URL que você copiou do Supabase no Passo 1.
   - Clique em **Create**.
5. Copie o **Client ID** e o **Client Secret**.

### Passo 3: Configurar no Supabase
1. Volte para a aba do Supabase (Authentication > Providers > Google).
2. Cole o **Client ID** e o **Client Secret**.
3. Ative a opção **Enable Sign in with Google**.
4. Clique em **Save**.

### Passo 4: Configurar URLs de Redirecionamento
1. No Supabase, vá em **Authentication** > **URL Configuration**.
2. Em **Site URL**, coloque: `http://localhost:3000`
3. Em **Redirect URLs**, adicione:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000`
4. Clique em **Save**.

---
**Pronto!** Agora tente fazer login com Google novamente.
