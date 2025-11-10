"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUserEdit } from "@/hooks/useUserEdit";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type UserRole = Profile["role"];

interface UserEditDialogProps {
	user: Profile | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (userId: string, updates: Partial<Profile>) => Promise<void>;
	isAdmin: boolean;
	currentUserId: string;
}

export default function UserEditDialog({ user, open, onOpenChange, onSave, isAdmin, currentUserId }: UserEditDialogProps) {
	const { fullName, email, role, saving, setFullName, setRole, setSaving, canEditRole, canEdit, getUpdates, isValid } = useUserEdit({
		user,
		isAdmin,
		currentUserId,
	});

	const handleSave = async () => {
		if (!user || !isValid()) return;

		setSaving(true);
		try {
			const updates = getUpdates();
			await onSave(user.id, updates);
			onOpenChange(false);
		} catch (error) {
			console.error("Error al guardar:", error);
			alert(`Error al actualizar usuario: ${error instanceof Error ? error.message : "Error desconocido"}`);
		} finally {
			setSaving(false);
		}
	};

	if (!user) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange} key={user.id}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Editar Usuario</DialogTitle>
					<DialogDescription>Modifica la información del usuario. {!isAdmin && "Solo puedes editar tus propios datos."}</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="fullName">Nombre Completo</Label>
						<Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!canEdit || saving} placeholder="Nombre completo del usuario" />
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" value={email} disabled className="bg-muted" />
						<p className="text-xs text-muted-foreground">El email no se puede modificar</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="role">Rol</Label>
						{canEditRole ? (
							<Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={saving}>
								<SelectTrigger id="role">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="operario">Operario</SelectItem>
									<SelectItem value="planificador_rutas">Planificador de rutas</SelectItem>
									<SelectItem value="admin">Administrador</SelectItem>
								</SelectContent>
							</Select>
						) : (
							<Input value={role === "admin" ? "Administrador" : role === "planificador_rutas" ? "Planificador de Rutas" : "Operario"} disabled className="bg-muted" />
						)}
						{!isAdmin && <p className="text-xs text-muted-foreground">Solo los administradores pueden cambiar roles</p>}
					</div>

					<div className="space-y-2">
						<Label>Fecha de Registro</Label>
						<Input value={new Date(user.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })} disabled className="bg-muted" />
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
						Cancelar
					</Button>
					<Button onClick={handleSave} disabled={saving || !canEdit || !isValid()}>
						{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Guardar Cambios
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
