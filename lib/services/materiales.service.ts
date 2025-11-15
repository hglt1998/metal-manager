import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Material = Database["public"]["Tables"]["materiales"]["Row"];
type MaterialInsert = Database["public"]["Tables"]["materiales"]["Insert"];
type MaterialUpdate = Database["public"]["Tables"]["materiales"]["Update"];

export class MaterialesService {
	constructor(private supabase: SupabaseClient) {}

	/**
	 * Obtiene todos los materiales ordenados por material
	 */
	async getAllMateriales() {
		const { data, error } = await this.supabase.from("materiales").select("*").order("material", { ascending: true });

		if (error) {
			throw new Error(`Error al cargar materiales: ${error.message}`);
		}

		return data || [];
	}

	/**
	 * Obtiene un material por su ID
	 */
	async getMaterialById(materialId: string) {
		const { data, error } = await this.supabase.from("materiales").select("*").eq("id", materialId).single();

		if (error) {
			throw new Error(`Error al cargar material: ${error.message}`);
		}

		return data;
	}

	/**
	 * Crea un nuevo material
	 */
	async createMaterial(material: MaterialInsert) {
		const { data, error } = await this.supabase.from("materiales").insert([material]).select("*").single();

		if (error) {
			throw new Error(`Error al crear material: ${error.message}`);
		}

		return data;
	}

	/**
	 * Actualiza un material existente
	 */
	async updateMaterial(materialId: string, updates: MaterialUpdate) {
		const { data, error } = await this.supabase.from("materiales").update(updates).eq("id", materialId).select("*").single();

		if (error) {
			throw new Error(`Error al actualizar material: ${error.message}`);
		}

		return data;
	}

	/**
	 * Elimina un material
	 */
	async deleteMaterial(materialId: string) {
		const { error } = await this.supabase.from("materiales").delete().eq("id", materialId);

		if (error) {
			throw new Error(`Error al eliminar material: ${error.message}`);
		}
	}
}

/**
 * Factory function para crear una instancia del servicio
 */
export const createMaterialesService = (supabase: SupabaseClient) => {
	return new MaterialesService(supabase);
};
