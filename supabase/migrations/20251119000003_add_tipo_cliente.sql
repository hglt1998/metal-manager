-- Add tipo_cliente field to clientes table
-- This field stores an array of client types

ALTER TABLE public.clientes
ADD COLUMN tipo_cliente TEXT[] DEFAULT '{}' NOT NULL;

-- Add a comment to describe the field
COMMENT ON COLUMN public.clientes.tipo_cliente IS 'Array de tipos de cliente: remitente, destinatario, proveedor, cliente, agente_aduanas, transitario, transportista';

-- Create an index for better query performance on tipo_cliente
CREATE INDEX idx_clientes_tipo_cliente ON public.clientes USING GIN (tipo_cliente);
