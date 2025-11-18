"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { ContenedorFormDialog } from "./ContenedorFormDialog";
import { ContenedorEditDialog } from "./ContenedorEditDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Database } from "@/types/database";

type Contenedor = Database["public"]["Tables"]["contenedores"]["Row"];
type ContenedorUpdate = Database["public"]["Tables"]["contenedores"]["Update"];

interface ContenedoresSectionProps {
	contenedores: Contenedor[];
	loading: boolean;
	error: Error | null;
	loadContenedores: () => Promise<void>;
	deleteContenedor: (contenedorId: string) => Promise<void>;
	updateContenedor: (contenedorId: string, updates: ContenedorUpdate) => Promise<Contenedor>;
}

export function ContenedoresSection({ contenedores, loading, loadContenedores, deleteContenedor }: ContenedoresSectionProps) {
	const [editingContenedor, setEditingContenedor] = useState<Contenedor | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async () => {
		if (!deleteId) return;

		setDeleting(true);
		try {
			await deleteContenedor(deleteId);
		} catch (error) {
			console.error("Error al eliminar contenedor:", error);
			alert("Error al eliminar el contenedor.");
		} finally {
			setDeleting(false);
			setDeleteId(null);
		}
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
							Total de {contenedores.length} contenedor{contenedores.length !== 1 ? "es" : ""}
						</p>
						<ContenedorFormDialog onSuccess={loadContenedores} />
					</div>

					{contenedores.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-8 px-4 md:px-0">No hay contenedores registrados</p>
					) : (
						<div className="rounded-md border border-border/40">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Código</TableHead>
										<TableHead>Tipo</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead className="text-right">Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{contenedores.map((contenedor) => (
										<TableRow key={contenedor.id}>
											<TableCell className="font-medium">{contenedor.codigo}</TableCell>
											<TableCell>{contenedor.tipo}</TableCell>
											<TableCell>
												<Badge variant={contenedor.activo ? "default" : "secondary"}>{contenedor.activo ? "Activo" : "Inactivo"}</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button variant="ghost" size="icon" onClick={() => setEditingContenedor(contenedor)}>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button variant="ghost" size="icon" onClick={() => setDeleteId(contenedor.id)}>
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

			{editingContenedor && (
				<ContenedorEditDialog
					contenedor={editingContenedor}
					onClose={() => setEditingContenedor(null)}
					onSuccess={() => {
						setEditingContenedor(null);
						loadContenedores();
					}}
				/>
			)}

			<AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
						<AlertDialogDescription>Esta acción no se puede deshacer. El contenedor será eliminado permanentemente del sistema.</AlertDialogDescription>
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
