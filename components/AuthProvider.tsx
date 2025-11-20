"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@/types/database";

type Profile = {
	id: string;
	email: string;
	full_name: string | null;
	role: UserRole | null; // puede ser null mientras no haya rol asignado
};

type AuthContextType = {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, fullName?: string) => Promise<void>;
	signOut: () => Promise<void>;
	isAdmin: boolean;
	isOperario: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	// Cliente estable en toda la vida del componente
	const supabase = useMemo(() => createClient(), []);

	const loadProfile = useCallback(
		async (userId: string) => {
			const { data, error } = await supabase
				.from("profiles")
				// Mejor especificar columnas por si la tabla crece
				.select("id, email, full_name, role")
				.eq("id", userId)
				.maybeSingle();

			if (error) {
				console.error("Error loading profile:", error);
				setProfile(null);
				return;
			}

			// Si no hay fila, data será null => dejamos el perfil en null
			setProfile(data ?? null);
		},
		[supabase]
	);

	useEffect(() => {
		let isMounted = true;

		const initAuth = async () => {
			setLoading(true);

			const { data, error } = await supabase.auth.getUser();

			// Si el error es simplemente que no hay sesión, lo tomamos como "no logeado"
			if (error && error.message === "Auth session missing!") {
				setUser(null);
				setProfile(null);
				setLoading(false);
				return;
			}

			if (error) {
				console.error("Error getting user:", error);
				setUser(null);
				setProfile(null);
				setLoading(false);
				return;
			}

			const currentUser = data.user ?? null;
			setUser(currentUser);

			if (currentUser) {
				await loadProfile(currentUser.id);
			} else {
				setProfile(null);
			}

			setLoading(false);
		};

		initAuth();

		// Listener de cambios de auth
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (!isMounted) return;

			const currentUser = session?.user ?? null;
			setUser(currentUser);

			if (currentUser) {
				await loadProfile(currentUser.id);
			} else {
				setProfile(null);
			}
		});

		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, [supabase, loadProfile]);

	const signIn = useCallback(
		async (email: string, password: string) => {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) throw error;

			// El listener de onAuthStateChange se encargará de actualizar user/profile
		},
		[supabase]
	);

	const signUp = useCallback(
		async (email: string, password: string, fullName?: string) => {
			const { data, error } = await supabase.auth.signUp({
				email,
				password
			});

			if (error) throw error;

			// Dependiendo de la config de Supabase, puede que el usuario necesite verificar el email.
			// Si ya hay user y quieres crear/actualizar perfil:
			if (data.user && fullName) {
				const { error: profileError } = await supabase.from("profiles").upsert(
					{
						id: data.user.id,
						email,
						full_name: fullName
					},
					{ onConflict: "id" }
				);

				if (profileError) {
					console.error("Error upserting profile on signUp:", profileError);
				}
			}
		},
		[supabase]
	);

	const signOut = useCallback(async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out:", error);
			// Aun así limpiamos estado local para evitar dejar info sensible en memoria
		}
		setProfile(null);
		setUser(null);
	}, [supabase]);

	// Flags de rol teniendo en cuenta `loading`
	const isAdmin = !loading && user !== null && profile?.role === "admin";
	const isOperario = !loading && user !== null && profile?.role === "operario";

	return (
		<AuthContext.Provider
			value={{
				user,
				profile,
				loading,
				signIn,
				signUp,
				signOut,
				isAdmin,
				isOperario
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
