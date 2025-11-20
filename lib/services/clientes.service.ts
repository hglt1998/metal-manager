import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Cliente = Database["public"]["Tables"]["clientes"]["Row"];
type ClienteInsert = Database["public"]["Tables"]["clientes"]["Insert"];
type ClienteUpdate = Database["public"]["Tables"]["clientes"]["Update"];
type ClienteCentro = Database["public"]["Tables"]["cliente_centros"]["Row"];
type ClienteCentroInsert = Database["public"]["Tables"]["cliente_centros"]["Insert"];
type Centro = Database["public"]["Tables"]["centros"]["Row"];

export interface ClienteWithCentros extends Cliente {
	centros?: Centro[];
}

export class ClientesService {
	constructor(private supabase: SupabaseClient) {}

	async getAllClientes(): Promise<ClienteWithCentros[]> {
		const { data, error } = await this.supabase
			.from("clientes")
			.select(`
				*,
				cliente_centros (
					centro_id,
					centros (*)
				)
			`)
			.order("nombre", { ascending: true });

		if (error) throw error;

		// Transform the data to flatten centros
		return (data || []).map((cliente: any) => ({
			...cliente,
			centros: cliente.cliente_centros?.map((cc: any) => cc.centros) || [],
			cliente_centros: undefined,
		}));
	}

	async getClienteById(clienteId: string): Promise<ClienteWithCentros> {
		const { data, error } = await this.supabase
			.from("clientes")
			.select(`
				*,
				cliente_centros (
					centro_id,
					centros (*)
				)
			`)
			.eq("id", clienteId)
			.single();

		if (error) throw error;

		// Transform the data to flatten centros
		return {
			...data,
			centros: data.cliente_centros?.map((cc: any) => cc.centros) || [],
			cliente_centros: undefined,
		} as ClienteWithCentros;
	}

	async createCliente(cliente: ClienteInsert, centroIds: string[] = []): Promise<ClienteWithCentros> {
		// Create cliente
		const { data: newCliente, error: clienteError } = await this.supabase
			.from("clientes")
			.insert(cliente)
			.select()
			.single();

		if (clienteError) throw clienteError;

		// Associate centros if provided
		if (centroIds.length > 0) {
			const clienteCentros: ClienteCentroInsert[] = centroIds.map((centroId) => ({
				cliente_id: newCliente.id,
				centro_id: centroId,
			}));

			const { error: centrosError } = await this.supabase
				.from("cliente_centros")
				.insert(clienteCentros);

			if (centrosError) throw centrosError;
		}

		// Fetch the complete cliente with centros
		return this.getClienteById(newCliente.id);
	}

	async updateCliente(
		clienteId: string,
		updates: ClienteUpdate,
		centroIds?: string[]
	): Promise<ClienteWithCentros> {
		// Update cliente
		const { data: updatedCliente, error: updateError } = await this.supabase
			.from("clientes")
			.update(updates)
			.eq("id", clienteId)
			.select()
			.single();

		if (updateError) throw updateError;

		// Update centros association if provided
		if (centroIds !== undefined) {
			// Delete existing associations
			const { error: deleteError } = await this.supabase
				.from("cliente_centros")
				.delete()
				.eq("cliente_id", clienteId);

			if (deleteError) throw deleteError;

			// Create new associations
			if (centroIds.length > 0) {
				const clienteCentros: ClienteCentroInsert[] = centroIds.map((centroId) => ({
					cliente_id: clienteId,
					centro_id: centroId,
				}));

				const { error: insertError } = await this.supabase
					.from("cliente_centros")
					.insert(clienteCentros);

				if (insertError) throw insertError;
			}
		}

		// Fetch the complete cliente with centros
		return this.getClienteById(clienteId);
	}

	async deleteCliente(clienteId: string): Promise<void> {
		const { error } = await this.supabase.from("clientes").delete().eq("id", clienteId);

		if (error) throw error;
	}

	async getCentrosByClienteId(clienteId: string): Promise<Centro[]> {
		const { data, error } = await this.supabase
			.from("cliente_centros")
			.select("centros(*)")
			.eq("cliente_id", clienteId);

		if (error) throw error;

		return (data || []).map((cc: any) => cc.centros);
	}
}

export function createClientesService(supabase: SupabaseClient) {
	return new ClientesService(supabase);
}
