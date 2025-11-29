-- =====================================================
-- CARTEIRA DE VACINAÇÃO PARA GESTANTES - DATABASE SCHEMA
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: profiles (Perfil da Gestante)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  due_date DATE NOT NULL, -- Data Prevista do Parto
  birth_date DATE,
  blood_type TEXT,
  allergies TEXT[], -- Alergias a vacinas
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- TABELA: vaccines (Catálogo de Vacinas)
-- =====================================================
CREATE TABLE IF NOT EXISTS vaccines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  presentation TEXT, -- Intramuscular, Subcutânea, etc
  recommended_weeks TEXT, -- Ex: "20-36", "Qualquer idade gestacional"
  trimester INTEGER, -- 1, 2, 3, ou NULL para qualquer
  doses INTEGER DEFAULT 1,
  dose_interval TEXT, -- Ex: "0-1-6 meses", "6-12 meses"
  priority TEXT, -- Alta, Muito Alta, Média, etc
  contraindicated BOOLEAN DEFAULT false,
  contraindication_note TEXT,
  reinforcement_info TEXT, -- Informações sobre reforços
  observations TEXT,
  educational_info TEXT, -- Informações educativas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- TABELA: vaccine_records (Registros de Vacinação)
-- =====================================================
CREATE TABLE IF NOT EXISTS vaccine_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  vaccine_id UUID REFERENCES vaccines ON DELETE CASCADE NOT NULL,
  dose_number INTEGER DEFAULT 1, -- 1ª, 2ª, 3ª dose
  application_date DATE NOT NULL,
  batch_number TEXT, -- Lote
  application_site TEXT, -- Local (posto, clínica, etc)
  professional_name TEXT, -- Nome do profissional
  photo_url TEXT, -- URL da foto do cartão
  notes TEXT,
  pregnancy_week INTEGER, -- Semana gestacional na aplicação
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- TABELA: alerts (Alertas e Lembretes)
-- =====================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  vaccine_id UUID REFERENCES vaccines,
  alert_type TEXT NOT NULL, -- 'ideal_window', 'next_dose', 'overdue', 'postpartum'
  alert_date DATE NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false, -- Se já foi enviado por email/push
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- TABELA: shared_access (Compartilhamento com Familiares/Médicos)
-- =====================================================
CREATE TABLE IF NOT EXISTS shared_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  shared_with_email TEXT NOT NULL,
  access_type TEXT NOT NULL, -- 'view', 'edit', 'medical'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABELA: pregnancies (Múltiplas Gestações)
-- =====================================================
CREATE TABLE IF NOT EXISTS pregnancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  due_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT true,
  outcome TEXT, -- 'ongoing', 'delivered', 'miscarriage', etc
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- ÍNDICES para Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS vaccine_records_user_id_idx ON vaccine_records(user_id);
CREATE INDEX IF NOT EXISTS vaccine_records_vaccine_id_idx ON vaccine_records(vaccine_id);
CREATE INDEX IF NOT EXISTS alerts_user_id_idx ON alerts(user_id);
CREATE INDEX IF NOT EXISTS alerts_alert_date_idx ON alerts(alert_date);
CREATE INDEX IF NOT EXISTS shared_access_owner_id_idx ON shared_access(owner_id);
CREATE INDEX IF NOT EXISTS pregnancies_user_id_idx ON pregnancies(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccine_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;

-- Policies para PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies para VACCINES (público para usuários autenticados)
CREATE POLICY "Authenticated users can view vaccines" ON vaccines FOR SELECT TO authenticated USING (true);

-- Policies para VACCINE_RECORDS
CREATE POLICY "Users can view own records" ON vaccine_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON vaccine_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON vaccine_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON vaccine_records FOR DELETE USING (auth.uid() = user_id);

-- Policies para ALERTS
CREATE POLICY "Users can view own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);

-- Policies para SHARED_ACCESS
CREATE POLICY "Users can view own shares" ON shared_access FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own shares" ON shared_access FOR ALL USING (auth.uid() = owner_id);

-- Policies para PREGNANCIES
CREATE POLICY "Users can view own pregnancies" ON pregnancies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pregnancies" ON pregnancies FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para profiles
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ✅ SCHEMA CRIADO COM SUCESSO!
-- =====================================================

-- Próximo passo: Execute o script seed_vaccines.sql para popular as vacinas
