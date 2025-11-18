import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Contenedor = Database["public"]["Tables"]["contenedores"]["Row"];
type ContenedorInsert = Database["public"]["Tables"]["contenedores"]["Insert"];
type ContenedorUpdate = Database["public"]["Tables"]["contenedores"]["Update"];

export class ContenedoresService {
	constructor(private supabase: SupabaseClient) {}

	async getAllContenedores() {
		const { data, error } = await this.supabase.from("contenedores").select("*").order("codigo", { ascending: true });

		if (error) {
			throw new Error(`Error al cargar contenedores: ${error.message}`);
		}

		return data || [];
	}

	async getContenedorById(id: string) {
		const { data, error } = await this.supabase.from("contenedores").select("*").eq("id", id).single();

		if (error) {
			throw new Error(`Error al cargar contenedor: ${error.message}`);
		}

		return data;
	}

	async createContenedor(contenedor: ContenedorInsert) {
		const { data, error } = await this.supabase.from("contenedores").insert(contenedor).select("*").single();

		if (error) {
			throw new Error(`Error al crear contenedor: ${error.message}`);
		}

		return data;
	}

	async updateContenedor(id: string, updates: ContenedorUpdate) {
		const { error } = await this.supabase.from("contenedores").update(updates).eq("id", id);

		if (error) {
			throw new Error(`Error al actualizar contenedor: ${error.message}`);
		}

		const { data: updatedContenedor, error: fetchError } = await this.supabase.from("contenedores").select("*").eq("id", id).single();

		if (fetchError) {
			throw new Error(`Error al obtener contenedor actualizado: ${fetchError.message}`);
		}

		return updatedContenedor;
	}

	async deleteContenedor(id: string) {
		const { error } = await this.supabase.from("contenedores").delete().eq("id", id);

		if (error) {
			throw new Error(`Error al eliminar contenedor: ${error.message}`);
		}
	}
}

export const createContenedoresService = (supabase: SupabaseClient) => {
	return new ContenedoresService(supabase);
};
