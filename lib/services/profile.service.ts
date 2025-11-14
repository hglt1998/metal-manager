import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export class ProfileService {
	constructor(private supabase: SupabaseClient) {}

	/**
	 * Obtiene el perfil del usuario actual autenticado
	 */
	async getCurrentProfile() {
		const {
			data: { user },
		} = await this.supabase.auth.getUser();

		if (!user) {
			throw new Error("Usuario no autenticado");
		}

		const { data, error } = await this.supabase.from("profiles").select("*").eq("id", user.id).single();

		if (error) {
			throw new Error(`Error al cargar perfil: ${error.message}`);
		}

		return data;
	}

	/**
	 * Obtiene un perfil por su ID
	 */
	async getProfileById(userId: string) {
		const { data, error } = await this.supabase.from("profiles").select("*").eq("id", userId).single();

		if (error) {
			throw new Error(`Error al cargar perfil: ${error.message}`);
		}

		return data;
	}

	/**
	 * Actualiza el perfil del usuario actual
	 * Solo permite actualizar full_name
	 */
	async updateCurrentProfile(updates: { full_name?: string | null }) {
		const {
			data: { user },
		} = await this.supabase.auth.getUser();

		if (!user) {
			throw new Error("Usuario no autenticado");
		}

		const { data, error } = await this.supabase.from("profiles").update(updates).eq("id", user.id).select("*").single();

		if (error) {
			throw new Error(`Error al actualizar perfil: ${error.message}`);
		}

		return data;
	}
}

/**
 * Factory function para crear una instancia del servicio
 */
export const createProfileService = (supabase: SupabaseClient) => {
	return new ProfileService(supabase);
};
