"use client";

import { useEffect, useState } from "react";
import { useMateriales } from "@/hooks/useMateriales";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { MaterialEditDialog } from "./MaterialEditDialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MaterialesTableProps {
	onRefreshReady?: (refreshFn: () => void) => void;
}

export function MaterialesTable({ onRefreshReady }: MaterialesTableProps) {
	const { materiales, loading, loadMateriales, deleteMaterial } = useMateriales();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		// Exponer la función de refresh al componente padre
		if (onRefreshReady) {
			onRefreshReady(loadMateriales);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onRefreshReady]);

	const handleDelete = async () => {
		if (!deleteId) return;

		setDeleting(true);
		try {
			await deleteMaterial(deleteId);
		} catch (error) {
			console.error("Error al eliminar material:", error);
			alert("Error al eliminar el material. Puede que esté siendo usado en alguna ruta.");
		} finally {
			setDeleting(false);
			setDeleteId(null);
		}
	};

	if (loading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-10">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	if (materiales.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No hay materiales</CardTitle>
					<CardDescription>
						Comienza agregando tu primer material usando el botón "Nuevo Material" arriba.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Materiales registrados</CardTitle>
					<CardDescription>
						Total de {materiales.length} material{materiales.length !== 1 ? "es" : ""}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nombre</TableHead>
									<TableHead>Precio (€/kg)</TableHead>
									<TableHead className="text-right">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{materiales.map((material) => (
									<TableRow key={material.id}>
										<TableCell className="font-medium">{material.nombre}</TableCell>
										<TableCell>{material.precio_kg.toFixed(2)} €</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<MaterialEditDialog material={material} onSuccess={loadMateriales} />
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setDeleteId(material.id)}
													className="h-8 w-8 text-destructive hover:text-destructive"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar material?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. El material será eliminado permanentemente.
							Si el material está siendo usado en alguna ruta, no podrá ser eliminado.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={deleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{deleting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Eliminando...
								</>
							) : (
								"Eliminar"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
