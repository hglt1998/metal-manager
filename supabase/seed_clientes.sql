-- Seed data para clientes (ejemplos)
-- Puedes modificar estos datos según tus necesidades

INSERT INTO clientes (nombre, cif, direccion, email_contacto, telefono_contacto, persona_contacto) VALUES
('Transportes López S.L.', 'B12345678', 'Calle Mayor 123, 28001 Madrid', 'contacto@transporteslopez.com', '+34 912345678', 'Juan López García'),
('Logística del Norte S.A.', 'A87654321', 'Avenida Principal 45, 48001 Bilbao', 'info@logisticanorte.com', '+34 944123456', 'María Fernández Ruiz'),
('Distribuciones Mediterráneo', 'B23456789', 'Paseo Marítimo 78, 03001 Alicante', 'admin@distmediterraneo.com', '+34 965789012', 'Carlos Martínez Sánchez')
ON CONFLICT (cif) DO NOTHING;

-- Nota: Para asociar centros a clientes, primero necesitas conocer los IDs de los centros existentes.
-- Puedes ejecutar después queries como:
-- INSERT INTO cliente_centros (cliente_id, centro_id)
-- SELECT c.id, ce.id FROM clientes c, centros ce WHERE c.cif = 'B12345678' AND ce.nombre = 'Centro Madrid';
