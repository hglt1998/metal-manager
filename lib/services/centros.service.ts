import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Centro = Database["public"]["Tables"]["centros"]["Row"];
type CentroInsert = Database["public"]["Tables"]["centros"]["Insert"];
type CentroUpdate = Database["public"]["Tables"]["centros"]["Update"];

export class CentrosService {
	constructor(private supabase: SupabaseClient) {}

	/**
	 * Obtiene todos los centros ordenados por nombre
	 */
	async getAllCentros() {
		const { data, error } = await this.supabase.from("centros").select("*").order("nombre", { ascending: true });

		if (error) {
			throw new Error(`Error al cargar centros: ${error.message}`);
		}

		return data || [];
	}

	/**
	 * Obtiene un centro por su ID
	 */
	async getCentroById(centroId: string) {
		const { data, error } = await this.supabase.from("centros").select("*").eq("id", centroId).single();

		if (error) {
			throw new Error(`Error al cargar centro: ${error.message}`);
		}

		return data;
	}

	/**
	 * Crea un nuevo centro
	 */
	async createCentro(centro: CentroInsert) {
		const { data, error } = await this.supabase.from("centros").insert([centro]).select("*").single();

		if (error) {
			throw new Error(`Error al crear centro: ${error.message}`);
		}

		return data;
	}

	/**
	 * Actualiza un centro existente
	 */
	async updateCentro(centroId: string, updates: CentroUpdate) {
		const { data, error } = await this.supabase.from("centros").update(updates).eq("id", centroId).select("*").single();

		if (error) {
			throw new Error(`Error al actualizar centro: ${error.message}`);
		}

		return data;
	}

	/**
	 * Elimina un centro
	 */
	async deleteCentro(centroId: string) {
		const { error } = await this.supabase.from("centros").delete().eq("id", centroId);

		if (error) {
			throw new Error(`Error al eliminar centro: ${error.message}`);
		}
	}
}

/**
 * Factory function para crear una instancia del servicio
 */
export const createCentrosService = (supabase: SupabaseClient) => {
	return new CentrosService(supabase);
};
