export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type UserRole = "admin" | "operario";
export type UnidadMedida = "Kilogramos" | "Toneladas";

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					email: string;
					full_name: string | null;
					role: UserRole;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email: string;
					full_name?: string | null;
					role?: UserRole;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					full_name?: string | null;
					role?: UserRole;
					created_at?: string;
					updated_at?: string;
				};
			};
			materiales: {
				Row: {
					id: string;
					nombre: string;
					densidad: number;
					precio_kg: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					nombre: string;
					densidad: number;
					precio_kg: number;
					created_at?: string;
				};
				Update: {
					id?: string;
					nombre?: string;
					densidad?: number;
					precio_kg?: number;
					created_at?: string;
				};
			};
			ubicaciones_recogida: {
				Row: {
					id: string;
					nombre: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					nombre: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					nombre?: string;
					created_at?: string;
				};
			};
			ubicaciones_destino: {
				Row: {
					id: string;
					nombre: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					nombre: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					nombre?: string;
					created_at?: string;
				};
			};
			cargas: {
				Row: {
					id: string;
					material_id: string;
					centro_recogida_id: string;
					centro_destino_id: string;
					peso: number;
					unidad_medida: UnidadMedida;
					total: number;
					operario_id: string;
					foto_albaran: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					material_id: string;
					centro_recogida_id: string;
					centro_destino_id: string;
					peso: number;
					unidad_medida: UnidadMedida;
					total: number;
					operario_id: string;
					foto_albaran?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					material_id?: string;
					centro_recogida_id?: string;
					centro_destino_id?: string;
					peso?: number;
					unidad_medida?: UnidadMedida;
					total?: number;
					operario_id?: string;
					foto_albaran?: string | null;
					created_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			user_role: UserRole;
			unidad_medida: UnidadMedida;
		};
	};
}
