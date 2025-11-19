import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Vehiculo = Database["public"]["Tables"]["vehiculos"]["Row"];
type VehiculoInsert = Database["public"]["Tables"]["vehiculos"]["Insert"];
type VehiculoUpdate = Database["public"]["Tables"]["vehiculos"]["Update"];

export class VehiculosService {
	constructor(private supabase: SupabaseClient) {}

	async getAllVehiculos() {
		const { data, error } = await this.supabase.from("vehiculos").select("*").order("matricula", { ascending: true });

		if (error) {
			throw new Error(`Error al cargar vehículos: ${error.message}`);
		}

		return data || [];
	}

	async getVehiculoById(id: string) {
		const { data, error } = await this.supabase.from("vehiculos").select("*").eq("id", id).single();

		if (error) {
			throw new Error(`Error al cargar vehículo: ${error.message}`);
		}

		return data;
	}

	async createVehiculo(vehiculo: VehiculoInsert) {
		const { data, error } = await this.supabase.from("vehiculos").insert(vehiculo).select("*").single();

		if (error) {
			throw new Error(`Error al crear vehículo: ${error.message}`);
		}

		return data;
	}

	async updateVehiculo(id: string, updates: VehiculoUpdate) {
		const { error } = await this.supabase.from("vehiculos").update(updates).eq("id", id);

		if (error) {
			throw new Error(`Error al actualizar vehículo: ${error.message}`);
		}

		const { data: updatedVehiculo, error: fetchError } = await this.supabase.from("vehiculos").select("*").eq("id", id).single();

		if (fetchError) {
			throw new Error(`Error al obtener vehículo actualizado: ${fetchError.message}`);
		}

		return updatedVehiculo;
	}

	async deleteVehiculo(id: string) {
		const { error } = await this.supabase.from("vehiculos").delete().eq("id", id);

		if (error) {
			throw new Error(`Error al eliminar vehículo: ${error.message}`);
		}
	}
}

export const createVehiculosService = (supabase: SupabaseClient) => {
	return new VehiculosService(supabase);
};
