"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Shield } from "lucide-react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function AdminPage() {
	const { profile, loading: authLoading, isAdmin } = useAuth();
	const router = useRouter();
	const [users, setUsers] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		if (!authLoading && !isAdmin) {
			router.push("/dashboard");
		}
	}, [authLoading, isAdmin, router]);

	useEffect(() => {
		const loadUsers = async () => {
			if (!isAdmin) return;

			setLoading(true);
			const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

			if (!error && data) {
				setUsers(data);
			}
			setLoading(false);
		};

		loadUsers();
	}, [isAdmin, supabase]);

	const updateUserRole = async (userId: string, newRole: "admin" | "operario") => {
		const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);

		if (!error) {
			// Recargar la lista de usuarios
			setLoading(true);
			const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
			if (data) {
				setUsers(data);
			}
			setLoading(false);
		} else {
			alert("Error al actualizar el rol del usuario");
		}
	};

	if (authLoading || !isAdmin) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="flex flex-col items-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-muted-foreground">Cargando...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<DashboardNav />
			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
				<div className="mb-8 sm:mb-10">
					<div className="flex flex-col sm:flex-row sm:items-center gap-4">
						<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
							<Shield className="h-7 w-7 text-primary" />
						</div>
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Panel de Administración</h1>
							<p className="mt-2 text-base sm:text-lg text-muted-foreground">Gestiona usuarios y permisos del sistema</p>
						</div>
					</div>
				</div>

				<Card className="border-border/40 shadow-sm">
					<CardHeader>
						<CardTitle className="text-xl">Usuarios Registrados</CardTitle>
						<CardDescription className="text-base">Visualiza y administra los roles de todos los usuarios del sistema</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
							</div>
						) : (
							<div className="overflow-x-auto -mx-6 sm:mx-0">
								<div className="inline-block min-w-full align-middle">
									<Table>
										<TableHeader>
											<TableRow className="hover:bg-transparent border-border/40">
												<TableHead className="font-semibold">Nombre</TableHead>
												<TableHead className="font-semibold">Email</TableHead>
												<TableHead className="font-semibold">Rol</TableHead>
												<TableHead className="font-semibold hidden sm:table-cell">Fecha de Registro</TableHead>
												<TableHead className="font-semibold">Acciones</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{users.map((user) => (
												<TableRow key={user.id} className="border-border/40">
													<TableCell className="font-medium">{user.full_name || "-"}</TableCell>
													<TableCell className="text-muted-foreground">{user.email}</TableCell>
													<TableCell>
														<Badge variant={user.role === "admin" ? "default" : "secondary"} className="font-medium">
															{user.role === "admin" ? "Admin" : "Operario"}
														</Badge>
													</TableCell>
													<TableCell className="text-muted-foreground hidden sm:table-cell">{new Date(user.created_at).toLocaleDateString("es-ES")}</TableCell>
													<TableCell>
														{user.id !== profile?.id && (
															<Select value={user.role} onValueChange={(value) => updateUserRole(user.id, value as "admin" | "operario")}>
																<SelectTrigger className="w-[120px] sm:w-[140px] h-9">
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="operario">Operario</SelectItem>
																	<SelectItem value="admin">Admin</SelectItem>
																</SelectContent>
															</Select>
														)}
														{user.id === profile?.id && (
															<span className="text-xs text-muted-foreground">Tú</span>
														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
