import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Material = Database["public"]["Tables"]["materiales"]["Row"];
type UbicacionRecogida = Database["public"]["Tables"]["ubicaciones_recogida"]["Row"];
type UbicacionDestino = Database["public"]["Tables"]["ubicaciones_destino"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type CargaInsert = Database["public"]["Tables"]["cargas"]["Insert"];

export class CargaService {
	constructor(private supabase: SupabaseClient) {}

	async getMateriales(): Promise<Material[]> {
		const { data, error } = await this.supabase.from("materiales").select("*").order("nombre");

		if (error) throw error;
		return data || [];
	}

	async getUbicacionesRecogida(): Promise<UbicacionRecogida[]> {
		const { data, error } = await this.supabase.from("ubicaciones_recogida").select("*").order("nombre");

		if (error) throw error;
		return data || [];
	}

	async getUbicacionesDestino(): Promise<UbicacionDestino[]> {
		const { data, error } = await this.supabase.from("ubicaciones_destino").select("*").order("nombre");

		if (error) throw error;
		return data || [];
	}

	async getOperarios(): Promise<Profile[]> {
		const { data, error } = await this.supabase.from("profiles").select("*").eq("role", "operario").order("full_name");

		if (error) throw error;
		return data || [];
	}

	async uploadFotoAlbaran(file: File): Promise<string> {
		const fileExt = file.name.split(".").pop();
		const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
		const filePath = `albaranes/${fileName}`;

		const { error: uploadError } = await this.supabase.storage.from("cargas").upload(filePath, file);

		if (uploadError) throw uploadError;

		const {
			data: { publicUrl }
		} = this.supabase.storage.from("cargas").getPublicUrl(filePath);

		return publicUrl;
	}

	async createCarga(carga: CargaInsert): Promise<void> {
		const { error } = await this.supabase.from("cargas").insert(carga);

		if (error) throw error;
	}
}
