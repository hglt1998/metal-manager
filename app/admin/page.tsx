"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield } from "lucide-react";
import UserEditDialog from "@/components/UserEditDialog";
import { UserTable } from "@/components/users/UserTable";
import { UserCardList } from "@/components/users/UserCardList";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function AdminPage() {
	const { profile, loading: authLoading, isAdmin } = useAuth();
	const router = useRouter();

	// Memorizar las opciones para evitar recreación en cada render
	const userOptions = useMemo(() => ({ autoLoad: false }), []);
	const { users, loading, updateUser, loadUsers } = useUsers(userOptions);

	const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	// Cargar usuarios cuando el usuario esté autenticado y sea admin
	useEffect(() => {
		if (!authLoading && isAdmin) {
			loadUsers();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authLoading, isAdmin]); // loadUsers es estable, no necesita estar en dependencias

	// Redirigir si no es admin (después de todos los hooks)
	useEffect(() => {
		if (!authLoading && !isAdmin) {
			router.push("/dashboard");
		}
	}, [authLoading, isAdmin, router]);

	const handleEditUser = (user: Profile) => {
		setSelectedUser(user);
		setEditDialogOpen(true);
	};

	const handleSaveUser = async (userId: string, updates: Partial<Profile>) => {
		await updateUser(userId, updates);
	};

	// Mostrar loading mientras carga la autenticación o si no es admin
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
		<>
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
						<>
							{/* Vista Desktop - Tabla */}
							<div className="hidden md:block">
								<UserTable users={users} onEditUser={handleEditUser} />
							</div>

							{/* Vista Mobile - Cards */}
							<div className="md:hidden">
								<UserCardList users={users} onEditUser={handleEditUser} />
							</div>
						</>
					)}
				</CardContent>
			</Card>

			<UserEditDialog user={selectedUser} open={editDialogOpen} onOpenChange={setEditDialogOpen} onSave={handleSaveUser} isAdmin={isAdmin} currentUserId={profile?.id || ""} />
		</>
	);
}
