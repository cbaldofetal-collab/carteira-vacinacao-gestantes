-- =====================================================
-- SEED DATA - Vacinas para Gestantes
-- Execute APÓS o schema.sql
-- =====================================================

INSERT INTO vaccines (name, presentation, recommended_weeks, trimester, doses, dose_interval, priority, contraindicated, contraindication_note, reinforcement_info, observations, educational_info)
VALUES
-- 1. dTpa (Tríplice Bacteriana)
('dTpa (Tríplice Bacteriana)', 
 'Intramuscular', 
 'A partir de 20ª semana (preferencial 2º trimestre)', 
 2, 
 1, 
 'Dose única por gestação', 
 'Alta', 
 false, 
 NULL,
 'Em cada gestação. Intervalo de 15 dias com VSR para melhor eficácia',
 'Preferencialmente no 2º trimestre. Se gestante suscetível, completar durante gestação ou até 45 dias pós-parto. Doses devem ser administradas durante períodos de sazonalidade. Gestante é grupo de risco',
 'Protege contra difteria, tétano e coqueluche. Essencial para transferir anticorpos ao bebê antes do nascimento.'),

-- 2. Hepatite B
('Hepatite B', 
 'Intramuscular', 
 '2º trimestre em diante', 
 2, 
 3, 
 'Esquema 0-1-6 meses', 
 'Alta', 
 false, 
 NULL,
 'Não necessário se esquema completo',
 'Se gestante suscetível, completar durante gestação ou até 45 dias pós-parto',
 'Previne hepatite B, que pode ser transmitida para o bebê durante o parto.'),

-- 3. Influenza (Gripe)
('Influenza (Gripe)', 
 'Intramuscular - Trivalente/Quadrivalente', 
 'Qualquer idade gestacional', 
 NULL, 
 1, 
 'Anual (em cada gestação se aplicável)', 
 'Alta', 
 false, 
 NULL,
 'Anual (em cada gestação se aplicável)',
 'Observar faixa etária recomendada. Variante em circulação. Gestante é grupo de risco',
 'Protege contra gripe sazonal. Gestantes têm maior risco de complicações.'),

-- 4. COVID-19
('COVID-19', 
 'Intramuscular', 
 'Qualquer idade gestacional', 
 NULL, 
 1, 
 'Sim - intervalo mínimo de 6 meses entre doses', 
 'Alta', 
 false, 
 NULL,
 'Sim - intervalo mínimo de 6 meses entre doses',
 'Observar faixa etária recomendada. Variante em circulação. Gestante é grupo de risco',
 'Protege contra COVID-19. Reduz risco de complicações graves na gestação.'),

-- 5. VSR - Abrysvo® (Pfizer)
('VSR - Abrysvo® (Pfizer)', 
 'Intramuscular', 
 '28-36 semanas (preferencial 32-36)', 
 3, 
 1, 
 'Em cada gestação', 
 'Muito Alta', 
 false, 
 NULL,
 'Em cada gestação',
 'Pode ser iniciada a partir de 24 semanas por critério médico. Sem limite de idade gestacional. Sem reforço necessário. EVITAR na gestação a menos que emergência epidemiológica. Conferir protocolo regional',
 'Protege o bebê contra vírus sincicial respiratório nos primeiros meses de vida. Janela ideal: 32-36 semanas para melhor transferência de anticorpos.'),

-- 6. Febre Amarela
('Febre Amarela', 
 'Subcutânea', 
 'Emergências epidemiológicas apenas', 
 NULL, 
 1, 
 'Conforme necessidade', 
 'Conforme necessidade', 
 false, 
 'EVITAR na gestação a menos que emergência epidemiológica',
 'Não recomendado',
 'EVITAR na gestação a menos que emergência epidemiológica. Conferir protocolo regional',
 'Vacina de vírus vivo atenuado. Só deve ser aplicada em situações de emergência epidemiológica.'),

-- 7. Hepatite A
('Hepatite A', 
 'Intramuscular', 
 'Segundo trimestre em diante', 
 2, 
 2, 
 'Intervalo 6-12 meses', 
 'Alta', 
 false, 
 NULL,
 'Não necessário se série completa',
 'Se gestante suscetível/com risco. Pode ser completado no puerpério',
 'Previne hepatite A. Recomendada para gestantes com risco aumentado.'),

-- 8. Meningocócica C
('Meningocócica C', 
 'Intramuscular', 
 'Segundo trimestre em diante', 
 2, 
 1, 
 'Conforme histórico vacinal', 
 'Média', 
 false, 
 NULL,
 'Conforme histórico vacinal',
 'Para gestantes suscetíveis com risco. Pode ser administrada após parto',
 'Protege contra meningite meningocócica tipo C. Indicada para gestantes com risco.'),

-- 9. Meningocócica B
('Meningocócica B', 
 'Intramuscular', 
 'Segundo trimestre em diante', 
 2, 
 2, 
 'Conforme esquema', 
 'Média', 
 false, 
 NULL,
 'Conforme protocolo individual',
 'Para gestantes suscetíveis com risco. Avaliar necessidade caso a caso',
 'Protege contra meningite meningocócica tipo B. Avaliar risco individual.'),

-- 10. Poliomielite (VIP)
('Poliomielite (VIP)', 
 'Intramuscular', 
 'Segundo trimestre em diante', 
 2, 
 3, 
 'Conforme necessidade', 
 'Média', 
 false, 
 NULL,
 'Se esquema incompleto',
 'Se gestante com esquema incompleto ou desconhecido. Preferir VIP (inativada)',
 'Vacina inativada contra poliomielite. Completar esquema se necessário.'),

-- 11. Sarampo, Caxumba, Rubéola (SCR)
('Sarampo, Caxumba, Rubéola (SCR)', 
 'Subcutânea', 
 'NÃO - Contraindicado na gestação', 
 NULL, 
 2, 
 'Aplicar pré-concepção ou pós-parto', 
 'Conforme necessidade', 
 true, 
 'CONTRAINDICADA - Vacinação pré-concepcional importante para mulheres em idade reprodutiva',
 'Conforme protocolo',
 'Preferir VIP (inativada). CONTRAINDICADA - Vacinação pré-concepcional importante para mulheres em idade reprodutiva',
 'Vacina de vírus vivo atenuado. CONTRAINDICADA na gestação. Aplicar antes da gravidez ou após o parto.'),

-- 12. Catapora/Varicela
('Catapora/Varicela', 
 'Subcutânea', 
 'NÃO - Contraindicado na gestação', 
 NULL, 
 2, 
 'Aplicar pré-concepção ou pós-parto', 
 'Conforme necessidade', 
 true, 
 'CONTRAINDICADA - Vacinação pré-concepcional importante',
 'Conforme protocolo',
 'CONTRAINDICADA - Vacinação pré-concepcional importante',
 'Vacina de vírus vivo atenuado. CONTRAINDICADA na gestação. Aplicar antes da gravidez ou após o parto.'),

-- 13. Tétano (dT ou Td)
('Tétano (dT ou Td)', 
 'Intramuscular', 
 'Conforme necessidade de atualização', 
 NULL, 
 3, 
 'Conforme esquema individual', 
 'Média', 
 false, 
 NULL,
 'A cada 10 anos',
 'Se necessário, preferir dTpa por cobertura contra coqueluche (20ª semana em diante)',
 'Protege contra tétano. Reforço a cada 10 anos. Preferir dTpa se possível.')

ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- ✅ VACINAS INSERIDAS COM SUCESSO!
-- =====================================================

SELECT COUNT(*) as total_vaccines FROM vaccines;
