import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export class UsersService {
	constructor(private supabase: SupabaseClient) {}

	/**
	 * Obtiene todos los usuarios ordenados por fecha de creación
	 */
	async getAllUsers() {
		const { data, error } = await this.supabase.from("profiles").select("*").order("created_at", { ascending: false });

		if (error) {
			throw new Error(`Error al cargar usuarios: ${error.message}`);
		}

		return data || [];
	}

	/**
	 * Obtiene un usuario por su ID
	 */
	async getUserById(userId: string) {
		const { data, error } = await this.supabase.from("profiles").select("*").eq("id", userId).single();

		if (error) {
			throw new Error(`Error al cargar usuario: ${error.message}`);
		}

		return data;
	}

	/**
	 * Actualiza los datos de un usuario
	 * Solo permite actualizar full_name y role (email no se puede cambiar desde aquí)
	 */
	async updateUser(userId: string, updates: Partial<Profile>) {
		// Filtrar campos que no se pueden actualizar directamente
		const safeUpdates: { full_name?: string | null; role?: Profile["role"] } = {};

		if (updates.full_name !== undefined) {
			safeUpdates.full_name = updates.full_name;
		}
		if (updates.role !== undefined) {
			safeUpdates.role = updates.role;
		}

		// Realizar la actualización con select("*") para obtener los datos actualizados
		const { data, error } = await this.supabase
			.from("profiles")
			.update(safeUpdates)
			.eq("id", userId)
			.select("*")
			.single();

		if (error) {
			throw new Error(`Error al actualizar usuario: ${error.message}`);
		}

		return data;
	}

	/**
	 * Actualiza el rol de un usuario
	 */
	async updateUserRole(userId: string, role: Profile["role"]) {
		return this.updateUser(userId, { role });
	}

	/**
	 * Actualiza el perfil de un usuario (solo nombre)
	 */
	async updateUserProfile(userId: string, fullName: string) {
		return this.updateUser(userId, { full_name: fullName });
	}
}

/**
 * Factory function para crear una instancia del servicio
 */
export const createUsersService = (supabase: SupabaseClient) => {
	return new UsersService(supabase);
};
