import type { TipoCliente } from "@/types/database";

/**
 * Labels para los tipos de cliente
 */
export const TIPOS_CLIENTE_LABELS: Record<TipoCliente, string> = {
	remitente: "Remitente",
	destinatario: "Destinatario",
	proveedor: "Proveedor",
	cliente: "Cliente",
	agente_aduanas: "Agente de Aduanas",
	transitario: "Transitario",
	transportista: "Transportista",
};

/**
 * Array de todos los tipos de cliente disponibles
 */
export const TIPOS_CLIENTE_OPTIONS: Array<{ value: TipoCliente; label: string }> = [
	{ value: "remitente", label: TIPOS_CLIENTE_LABELS.remitente },
	{ value: "destinatario", label: TIPOS_CLIENTE_LABELS.destinatario },
	{ value: "proveedor", label: TIPOS_CLIENTE_LABELS.proveedor },
	{ value: "cliente", label: TIPOS_CLIENTE_LABELS.cliente },
	{ value: "agente_aduanas", label: TIPOS_CLIENTE_LABELS.agente_aduanas },
	{ value: "transitario", label: TIPOS_CLIENTE_LABELS.transitario },
	{ value: "transportista", label: TIPOS_CLIENTE_LABELS.transportista },
];
