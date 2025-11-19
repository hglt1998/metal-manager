"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { RemolqueFormDialog } from "./RemolqueFormDialog";
import { RemolqueEditDialog } from "./RemolqueEditDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Database } from "@/types/database";

type Remolque = Database["public"]["Tables"]["remolques"]["Row"];
type RemolqueUpdate = Database["public"]["Tables"]["remolques"]["Update"];

interface RemolquesSectionProps {
	remolques: Remolque[];
	loading: boolean;
	error: Error | null;
	loadRemolques: () => Promise<void>;
	deleteRemolque: (remolqueId: string) => Promise<void>;
	updateRemolque: (remolqueId: string, updates: RemolqueUpdate) => Promise<Remolque>;
}

export function RemolquesSection({ remolques, loading, loadRemolques, deleteRemolque }: RemolquesSectionProps) {
	const [editingRemolque, setEditingRemolque] = useState<Remolque | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async () => {
		if (!deleteId) return;

		setDeleting(true);
		try {
			await deleteRemolque(deleteId);
		} catch (error) {
			console.error("Error al eliminar remolque:", error);
			alert("Error al eliminar el remolque.");
		} finally {
			setDeleting(false);
			setDeleteId(null);
		}
	};

	const capitalizeFirst = (text: string | null): string => {
		if (!text) return "-";
		return text.charAt(0).toUpperCase() + text.slice(1);
	};

	if (loading) {
		return (
			<Card className="border-none shadow-none md:border md:shadow-sm">
				<CardContent className="flex items-center justify-center py-10 p-0 md:p-6">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card className="border-none shadow-none md:border md:shadow-sm">
				<CardContent className="p-0 md:p-6">
					<div className="mb-4 px-4 md:px-0 flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Total de {remolques.length} remolque{remolques.length !== 1 ? "s" : ""}
						</p>
						<RemolqueFormDialog onSuccess={loadRemolques} />
					</div>

					{remolques.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-8 px-4 md:px-0">No hay remolques registrados</p>
					) : (
						<div className="rounded-md border border-border/40">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Matrícula</TableHead>
										<TableHead>Tipo</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead className="text-right">Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{remolques.map((remolque) => (
										<TableRow key={remolque.id}>
											<TableCell className="font-medium">{remolque.matricula}</TableCell>
											<TableCell>{capitalizeFirst(remolque.tipo)}</TableCell>
											<TableCell>
												<Badge variant={remolque.activo ? "default" : "secondary"}>{remolque.activo ? "Activo" : "Inactivo"}</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button variant="ghost" size="icon" onClick={() => setEditingRemolque(remolque)}>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button variant="ghost" size="icon" onClick={() => setDeleteId(remolque.id)}>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{editingRemolque && (
				<RemolqueEditDialog
					remolque={editingRemolque}
					onClose={() => setEditingRemolque(null)}
					onSuccess={() => {
						setEditingRemolque(null);
						loadRemolques();
					}}
				/>
			)}

			<AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
						<AlertDialogDescription>Esta acción no se puede deshacer. El remolque será eliminado permanentemente del sistema.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={deleting}>
							{deleting ? "Eliminando..." : "Eliminar"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
