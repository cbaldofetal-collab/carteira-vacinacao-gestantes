-- Permitir que usuários autenticados criem seu próprio perfil
create policy "Users can insert their own profile"
on profiles for insert
with check ( auth.uid() = id );

-- Garantir que usuários possam ver seu próprio perfil
create policy "Users can view own profile"
on profiles for select
using ( auth.uid() = id );

-- Garantir que usuários possam atualizar seu próprio perfil
create policy "Users can update own profile"
on profiles for update
using ( auth.uid() = id );
