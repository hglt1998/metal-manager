"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

	useEffect(() => {
		const loadProfile = async (userId: string) => {
			try {
				const { data, error } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", userId)
					.single();

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

		// Obtener sesión inicial
		const getSession = async () => {
			setLoading(true);
			try {
				const {
					data: { session }
				} = await supabase.auth.getSession();

				setUser(session?.user ?? null);

				if (session?.user) {
					await loadProfile(session.user.id);
				}
			} catch (error) {
				console.error("[AuthProvider] Error getting session:", error);
			} finally {
				setLoading(false);
			}
		};

		getSession();

		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			setUser(session?.user ?? null);
			if (session?.user) {
				await loadProfile(session.user.id);
			} else {
				setProfile(null);
			}
		});

		// Handle app visibility changes (important for mobile)
		const handleVisibilityChange = async () => {
			if (document.visibilityState === "visible") {
				// App returned to foreground - refresh session and profile
				const {
					data: { session }
				} = await supabase.auth.getSession();
				if (session?.user) {
					// Reload profile to ensure it's current
					await loadProfile(session.user.id);
				}
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			subscription.unsubscribe();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
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

	const isAdmin = profile?.role === "admin";
	const isOperario = profile?.role === "operario";

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
