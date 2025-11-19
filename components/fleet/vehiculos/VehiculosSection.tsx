"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { VehiculoFormDialog } from "./VehiculoFormDialog";
import { VehiculoEditDialog } from "./VehiculoEditDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Database } from "@/types/database";

type Vehiculo = Database["public"]["Tables"]["vehiculos"]["Row"];
type VehiculoUpdate = Database["public"]["Tables"]["vehiculos"]["Update"];

interface VehiculosSectionProps {
	vehiculos: Vehiculo[];
	loading: boolean;
	error: Error | null;
	loadVehiculos: () => Promise<void>;
	deleteVehiculo: (vehiculoId: string) => Promise<void>;
	updateVehiculo: (vehiculoId: string, updates: VehiculoUpdate) => Promise<Vehiculo>;
}

export function VehiculosSection({ vehiculos, loading, loadVehiculos, deleteVehiculo }: VehiculosSectionProps) {
	const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async () => {
		if (!deleteId) return;

		setDeleting(true);
		try {
			await deleteVehiculo(deleteId);
		} catch (error) {
			console.error("Error al eliminar vehículo:", error);
			alert("Error al eliminar el vehículo.");
		} finally {
			setDeleting(false);
			setDeleteId(null);
		}
	};

	const capitalizeFirst = (text: string): string => {
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
							Total de {vehiculos.length} vehículo{vehiculos.length !== 1 ? "s" : ""}
						</p>
						<VehiculoFormDialog onSuccess={loadVehiculos} />
					</div>

					{vehiculos.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-8 px-4 md:px-0">No hay vehículos registrados</p>
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
									{vehiculos.map((vehiculo) => (
										<TableRow key={vehiculo.id}>
											<TableCell className="font-medium">{vehiculo.matricula}</TableCell>
											<TableCell>{capitalizeFirst(vehiculo.tipo)}</TableCell>
											<TableCell>
												<Badge variant={vehiculo.activo ? "default" : "secondary"}>{vehiculo.activo ? "Activo" : "Inactivo"}</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button variant="ghost" size="icon" onClick={() => setEditingVehiculo(vehiculo)}>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button variant="ghost" size="icon" onClick={() => setDeleteId(vehiculo.id)}>
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

			{editingVehiculo && (
				<VehiculoEditDialog
					vehiculo={editingVehiculo}
					onClose={() => setEditingVehiculo(null)}
					onSuccess={() => {
						setEditingVehiculo(null);
						loadVehiculos();
					}}
				/>
			)}

			<AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
						<AlertDialogDescription>Esta acción no se puede deshacer. El vehículo será eliminado permanentemente del sistema.</AlertDialogDescription>
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
