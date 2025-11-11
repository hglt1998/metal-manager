export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type UserRole = "admin" | "operario" | "planificador_rutas";

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
					precio_kg: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					nombre: string;
					precio_kg?: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					nombre?: string;
					precio_kg?: number;
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
		};
	};
}
