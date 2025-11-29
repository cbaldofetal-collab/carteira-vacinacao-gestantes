-- Adicionar vacinas básicas
INSERT INTO vaccines (name, presentation, recommended_weeks, doses, priority, contraindicated) VALUES
('Hepatite B', 'Intramuscular', 'Qualquer idade gestacional', 3, 'Muito Alta', false),
('dTpa', 'Intramuscular', '20-36 semanas', 1, 'Muito Alta', false),
('Influenza', 'Intramuscular', 'Qualquer idade gestacional', 1, 'Alta', false),
('COVID-19', 'Intramuscular', 'Qualquer idade gestacional', 2, 'Muito Alta', false);
