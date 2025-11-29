-- Criar usuário de teste
-- Você precisa executar isso no SQL Editor do Supabase

-- Primeiro, crie o usuário através da interface do Supabase:
-- 1. Vá em Authentication > Users
-- 2. Clique em "Add user" > "Create new user"
-- 3. Email: teste@teste.com
-- 4. Password: teste123
-- 5. Desmarque "Auto Confirm User" se estiver marcado
-- 6. Clique em "Create user"

-- Depois execute este SQL para criar o perfil:
INSERT INTO profiles (id, name, email, due_date, created_at, updated_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'teste@teste.com'),
  'Gestante Teste',
  'teste@teste.com',
  (CURRENT_DATE + INTERVAL '180 days')::date,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
