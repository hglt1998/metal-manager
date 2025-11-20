"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@/types/database";

type Profile = {
	id: string;
	email: string;
	full_name: string | null;
	role: UserRole;
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
	const supabase = createClient();
	const currentUserIdRef = useRef<string | null>(null);

	useEffect(() => {
		const loadProfile = async (userId: string) => {
			try {
				const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

				if (error) {
					console.error("[AuthProvider] Error loading profile:", error);
					return false;
				}

				if (data) {
					setProfile(data);
					return true;
				}
				return false;
			} catch (error) {
				console.error("[AuthProvider] Exception loading profile:", error);
				return false;
			}
		};

		// Obtener sesión inicial con reintentos para Safari móvil
		const getSession = async (retries = 2) => {
			setLoading(true);
			try {
				// Primero intentar obtener la sesión
				const {
					data: { session }
				} = await supabase.auth.getSession();

				setUser(session?.user ?? null);
				currentUserIdRef.current = session?.user?.id ?? null;

				if (session?.user) {
					const profileLoaded = await loadProfile(session.user.id);

					// Si no se cargó el perfil y tenemos reintentos, intentar de nuevo
					if (!profileLoaded && retries > 0) {
						console.log("[AuthProvider] Retrying profile load...");
						await new Promise((resolve) => setTimeout(resolve, 300));
						await loadProfile(session.user.id);
					}
				}
			} catch (error) {
				console.error("[AuthProvider] Error getting session:", error);

				// Si hay error y tenemos reintentos, intentar de nuevo
				if (retries > 0) {
					console.log("[AuthProvider] Retrying session load...");
					await new Promise((resolve) => setTimeout(resolve, 500));
					return getSession(retries - 1);
				}
			} finally {
				setLoading(false);
			}
		};

		getSession();

		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (_event === "INITIAL_SESSION" || _event === "TOKEN_REFRESHED") {
				return;
			}

			const newUser = session?.user ?? null;
			const newUserId = newUser?.id ?? null;

			// Si el usuario es el mismo que ya tenemos, ignorar
			if (newUserId === currentUserIdRef.current) {
				return;
			}

			// Solo mostrar loading en eventos de login/logout
			const shouldShowLoading = _event === "SIGNED_IN" || _event === "SIGNED_OUT";

			if (shouldShowLoading) {
				setLoading(true);
			}

			// Actualizar usuario y ref
			setUser(newUser);
			currentUserIdRef.current = newUserId;

			// Solo cargar perfil si hay usuario
			if (newUser) {
				await loadProfile(newUser.id);
			} else {
				setProfile(null);
			}

			if (shouldShowLoading) {
				setLoading(false);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) throw error;

		// Actualizar el estado inmediatamente
		if (data.user) {
			setUser(data.user);
			await supabase
				.from("profiles")
				.select("*")
				.eq("id", data.user.id)
				.single()
				.then(({ data: profileData, error: profileError }) => {
					if (profileError) {
						console.error("Error loading profile:", profileError);
					}
					if (profileData) {
						setProfile(profileData);
					}
				});
		}
	};

	const signUp = async (email: string, password: string, fullName?: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password
		});
		if (error) throw error;

		if (data.user && fullName) {
			await new Promise((resolve) => setTimeout(resolve, 200));

			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const client = supabase as any;
				await client.from("profiles").update({ full_name: fullName }).eq("id", data.user.id);
			} catch (updateError) {
				console.error("Error updating profile:", updateError);
			}
		}
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		setProfile(null);
	};

	// Solo determinar rol cuando no está cargando Y hay usuario
	// Si está cargando, devolver false para evitar race conditions
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
