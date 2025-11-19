import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Remolque = Database["public"]["Tables"]["remolques"]["Row"];
type RemolqueInsert = Database["public"]["Tables"]["remolques"]["Insert"];
type RemolqueUpdate = Database["public"]["Tables"]["remolques"]["Update"];

export class RemolquesService {
	constructor(private supabase: SupabaseClient) {}

	async getAllRemolques() {
		const { data, error } = await this.supabase.from("remolques").select("*").order("matricula", { ascending: true });

		if (error) {
			throw new Error(`Error al cargar remolques: ${error.message}`);
		}

		return data || [];
	}

	async getRemolqueById(id: string) {
		const { data, error } = await this.supabase.from("remolques").select("*").eq("id", id).single();

		if (error) {
			throw new Error(`Error al cargar remolque: ${error.message}`);
		}

		return data;
	}

	async createRemolque(remolque: RemolqueInsert) {
		const { data, error } = await this.supabase.from("remolques").insert(remolque).select("*").single();

		if (error) {
			throw new Error(`Error al crear remolque: ${error.message}`);
		}

		return data;
	}

	async updateRemolque(id: string, updates: RemolqueUpdate) {
		const { error } = await this.supabase.from("remolques").update(updates).eq("id", id);

		if (error) {
			throw new Error(`Error al actualizar remolque: ${error.message}`);
		}

		const { data: updatedRemolque, error: fetchError } = await this.supabase.from("remolques").select("*").eq("id", id).single();

		if (fetchError) {
			throw new Error(`Error al obtener remolque actualizado: ${fetchError.message}`);
		}

		return updatedRemolque;
	}

	async deleteRemolque(id: string) {
		const { error } = await this.supabase.from("remolques").delete().eq("id", id);

		if (error) {
			throw new Error(`Error al eliminar remolque: ${error.message}`);
		}
	}
}

export const createRemolquesService = (supabase: SupabaseClient) => {
	return new RemolquesService(supabase);
};
