export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type UserRole = "admin" | "operario" | "planificador_rutas";
export type TipoCentro = "remitente" | "destino" | "ambos";

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
					material: string;
					material_familia: string | null;
					ler_01: string | null;
					ler_02: string | null;
					ler_03: string | null;
					ler_04: string | null;
					precio_kg: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					material: string;
					material_familia?: string | null;
					ler_01?: string | null;
					ler_02?: string | null;
					ler_03?: string | null;
					ler_04?: string | null;
					precio_kg?: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					material?: string;
					material_familia?: string | null;
					ler_01?: string | null;
					ler_02?: string | null;
					ler_03?: string | null;
					ler_04?: string | null;
					precio_kg?: number;
					created_at?: string;
					updated_at?: string;
				};
			};
			centros: {
				Row: {
					id: string;
					nombre: string;
					tipo: TipoCentro;
					direccion: string;
					latitud: number | null;
					longitud: number | null;
					restriccion_altura_m: number | null;
					restriccion_anchura_m: number | null;
					restriccion_peso_kg: number | null;
					horario_apertura: string | null;
					horario_cierre: string | null;
					dias_operacion: string | null;
					contacto_nombre: string | null;
					contacto_telefono: string | null;
					contacto_email: string | null;
					activo: boolean | null;
					notas: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					nombre: string;
					tipo: TipoCentro;
					direccion: string;
					latitud?: number | null;
					longitud?: number | null;
					restriccion_altura_m?: number | null;
					restriccion_anchura_m?: number | null;
					restriccion_peso_kg?: number | null;
					horario_apertura?: string | null;
					horario_cierre?: string | null;
					dias_operacion?: string | null;
					contacto_nombre?: string | null;
					contacto_telefono?: string | null;
					contacto_email?: string | null;
					activo?: boolean | null;
					notas?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					nombre?: string;
					tipo?: TipoCentro;
					direccion?: string;
					latitud?: number | null;
					longitud?: number | null;
					restriccion_altura_m?: number | null;
					restriccion_anchura_m?: number | null;
					restriccion_peso_kg?: number | null;
					horario_apertura?: string | null;
					horario_cierre?: string | null;
					dias_operacion?: string | null;
					contacto_nombre?: string | null;
					contacto_telefono?: string | null;
					contacto_email?: string | null;
					activo?: boolean | null;
					notas?: string | null;
					created_at?: string;
					updated_at?: string;
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
			tipo_centro: TipoCentro;
		};
	};
}
