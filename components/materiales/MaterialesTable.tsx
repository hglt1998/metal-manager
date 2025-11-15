"use client";

import { useEffect, useState, useMemo } from "react";
import { useMateriales } from "@/hooks/useMateriales";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, ArrowUpDown } from "lucide-react";
import { MaterialEditDialog } from "./MaterialEditDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface MaterialesTableProps {
	onRefreshReady?: (refreshFn: () => void) => void;
}

type SortField = "material" | "material_familia" | null;
type SortOrder = "asc" | "desc";

export function MaterialesTable({ onRefreshReady }: MaterialesTableProps) {
	const { materiales, loading, loadMateriales, deleteMaterial } = useMateriales();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [sortField, setSortField] = useState<SortField>("material");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

	useEffect(() => {
		// Exponer la función de refresh al componente padre
		if (onRefreshReady) {
			onRefreshReady(loadMateriales);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onRefreshReady]);

	const sortedMateriales = useMemo(() => {
		if (!sortField) return materiales;

		return [...materiales].sort((a, b) => {
			const aValue = a[sortField] || "";
			const bValue = b[sortField] || "";

			const comparison = aValue.localeCompare(bValue);
			return sortOrder === "asc" ? comparison : -comparison;
		});
	}, [materiales, sortField, sortOrder]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

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
					<CardDescription>Comienza agregando tu primer material usando el botón de arriba.</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<>
			<Card className="border-none shadow-none md:border md:shadow-sm">
				<CardHeader className="px-0 md:px-6">
					<CardTitle>Materiales registrados</CardTitle>
					<CardDescription>
						Total de {materiales.length} material{materiales.length !== 1 ? "es" : ""}
					</CardDescription>
				</CardHeader>
				<CardContent className="px-0 md:px-6">
					{/* Vista de tabla para desktop */}
					<div className="hidden md:block rounded-md border overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>
										<Button variant="ghost" size="sm" onClick={() => handleSort("material")} className="-ml-4 h-8 hover:bg-transparent">
											Material
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead>
										<Button variant="ghost" size="sm" onClick={() => handleSort("material_familia")} className="-ml-4 h-8 hover:bg-transparent">
											Familia
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead>LER 01</TableHead>
									<TableHead>LER 02</TableHead>
									<TableHead>LER 03</TableHead>
									<TableHead>LER 04</TableHead>
									<TableHead>Precio (€/kg)</TableHead>
									<TableHead className="text-right">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedMateriales.map((material) => (
									<TableRow key={material.id}>
										<TableCell className="font-medium capitalize">{material.material}</TableCell>
										<TableCell className="capitalize">{material.material_familia || "-"}</TableCell>
										<TableCell className="font-mono text-sm">{material.ler_01 || "-"}</TableCell>
										<TableCell className="font-mono text-sm">{material.ler_02 || "-"}</TableCell>
										<TableCell className="font-mono text-sm">{material.ler_03 || "-"}</TableCell>
										<TableCell className="font-mono text-sm">{material.ler_04 || "-"}</TableCell>
										<TableCell>{material.precio_kg.toFixed(2)} €</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<MaterialEditDialog material={material} onSuccess={loadMateriales} />
												<Button variant="ghost" size="icon" onClick={() => setDeleteId(material.id)} className="h-8 w-8 text-destructive hover:text-destructive">
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Vista de tarjetas para móvil */}
					<div className="md:hidden space-y-4">
						{sortedMateriales.map((material) => (
							<Card key={material.id} className="overflow-hidden">
								<CardContent className="p-4">
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<h3 className="font-semibold text-base capitalize mb-1">{material.material}</h3>
											<Badge variant="secondary" className="capitalize text-xs">
												{material.material_familia || "Sin familia"}
											</Badge>
										</div>
										<div className="flex items-center gap-1 ml-2">
											<MaterialEditDialog material={material} onSuccess={loadMateriales} />
											<Button variant="ghost" size="icon" onClick={() => setDeleteId(material.id)} className="h-8 w-8 text-destructive hover:text-destructive">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
										<div>
											<span className="text-muted-foreground text-xs">LER 01</span>
											<p className="font-mono">{material.ler_01 || "-"}</p>
										</div>
										<div>
											<span className="text-muted-foreground text-xs">LER 02</span>
											<p className="font-mono">{material.ler_02 || "-"}</p>
										</div>
										<div>
											<span className="text-muted-foreground text-xs">LER 03</span>
											<p className="font-mono">{material.ler_03 || "-"}</p>
										</div>
										<div>
											<span className="text-muted-foreground text-xs">LER 04</span>
											<p className="font-mono">{material.ler_04 || "-"}</p>
										</div>
									</div>

									<div className="mt-3 pt-3 border-t flex items-center justify-between">
										<span className="text-xs text-muted-foreground">Precio por kg</span>
										<span className="font-semibold">{material.precio_kg.toFixed(2)} €</span>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar material?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. El material será eliminado permanentemente. Si el material está siendo usado en alguna ruta, no podrá ser eliminado.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
