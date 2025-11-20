import type { TipoCliente } from "@/types/database";
import { TIPOS_CLIENTE_LABELS } from "@/lib/constants/clientes.constants";

/**
 * Obtiene el label de un tipo de cliente
 */
export function getTipoClienteLabel(tipo: TipoCliente): string {
	return TIPOS_CLIENTE_LABELS[tipo] || tipo;
}

/**
 * Obtiene los labels de múltiples tipos de cliente
 */
export function getTiposClienteLabels(tipos: TipoCliente[]): string[] {
	return tipos.map((tipo) => getTipoClienteLabel(tipo));
}

/**
 * Formatea la visualización de tipos de cliente
 * Si hay un solo tipo, devuelve su label
 * Si hay múltiples, devuelve "X tipos"
 */
export function formatTiposCliente(tipos: TipoCliente[] | null | undefined): string {
	if (!tipos || tipos.length === 0) {
		return "Sin tipo";
	}

	if (tipos.length === 1) {
		return getTipoClienteLabel(tipos[0]);
	}

	return `${tipos.length} tipos`;
}

/**
 * Verifica si un cliente está activo
 */
export function isClienteActivo(activo: boolean | null | undefined): boolean {
	return activo === true;
}

/**
 * Obtiene la clase CSS del estado del cliente (dot)
 */
export function getClienteStatusClass(activo: boolean | null | undefined): string {
	return isClienteActivo(activo) ? "bg-green-500" : "bg-gray-400";
}

/**
 * Obtiene el texto del estado del cliente
 */
export function getClienteStatusText(activo: boolean | null | undefined): string {
	return isClienteActivo(activo) ? "Activo" : "Inactivo";
}

/**
 * Formatea el nombre completo de contacto con email y/o teléfono
 */
export function formatContactoCliente(
	personaContacto: string | null | undefined,
	email: string | null | undefined,
	telefono: string | null | undefined
): string {
	const parts: string[] = [];

	if (personaContacto) {
		parts.push(personaContacto);
	}

	if (email) {
		parts.push(email);
	}

	if (telefono) {
		parts.push(telefono);
	}

	return parts.length > 0 ? parts.join(" - ") : "Sin información de contacto";
}

/**
 * Verifica si un cliente tiene información de contacto
 */
export function hasContactInfo(
	email: string | null | undefined,
	telefono: string | null | undefined
): boolean {
	return !!(email || telefono);
}
