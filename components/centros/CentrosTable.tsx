"use client";

import { useState } from "react";
import { useCentros } from "@/hooks/useCentros";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, Mail, Phone, MapPin, Clock, ChevronDown } from "lucide-react";
import { CentroEditDialog } from "./CentroEditDialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function CentrosTable() {
	const { centros, loading, deleteCentro } = useCentros();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async () => {
		if (!deleteId) return;

		setDeleting(true);
		try {
			await deleteCentro(deleteId);
		} catch (error) {
			console.error("Error al eliminar centro:", error);
			alert("Error al eliminar el centro. Puede que esté siendo usado en alguna ruta.");
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

	if (centros.length === 0) {
		return (
			<Card className="border-none shadow-none md:border md:shadow-sm">
				<CardHeader className="px-0 md:px-6">
					<CardTitle>No hay centros</CardTitle>
					<CardDescription>Comienza agregando tu primer centro usando el botón de arriba.</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<>
			<Card className="border-none shadow-none md:border md:shadow-sm">
				<CardContent className="p-0 md:p-6">
					<div className="rounded-md border border-border/40">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nombre / Tipo</TableHead>
									<TableHead>Ubicación</TableHead>
									<TableHead>Horarios</TableHead>
									<TableHead>Contacto</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead className="text-right">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{centros.map((centro) => (
									<TableRow key={centro.id}>
										<TableCell>
											<div className="flex flex-col gap-1">
												<span className="font-medium">{centro.nombre}</span>
												<Badge variant={centro.tipo === "remitente" ? "secondary" : centro.tipo === "destino" ? "default" : "outline"} className="w-fit text-xs">
													{centro.tipo === "remitente" ? "Recogida" : centro.tipo === "destino" ? "Entrega" : "Ambos"}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-col gap-1">
												<div className="flex items-start gap-2">
													<MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
													<span className="text-sm line-clamp-2">{centro.direccion}</span>
												</div>
												{(centro.latitud || centro.longitud) && (
													<span className="text-xs text-muted-foreground ml-6">
														{centro.latitud?.toFixed(6)}, {centro.longitud?.toFixed(6)}
													</span>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-col gap-1">
												{centro.horario_apertura && centro.horario_cierre ? (
													<div className="flex items-center gap-2 text-sm">
														<Clock className="h-3 w-3 text-muted-foreground" />
														<span>
															{centro.horario_apertura} - {centro.horario_cierre}
														</span>
													</div>
												) : (
													<span className="text-sm text-muted-foreground">Sin horario</span>
												)}
												{centro.dias_operacion && <span className="text-xs text-muted-foreground ml-5">{centro.dias_operacion}</span>}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-col gap-1">
												{centro.contacto_nombre && <span className="text-sm font-medium">{centro.contacto_nombre}</span>}
												{!centro.contacto_email && !centro.contacto_telefono ? (
													<span className="text-sm text-muted-foreground">Sin contacto</span>
												) : (
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="outline" size="sm" className="h-8 gap-1">
																<Mail className="h-3 w-3" />
																Contactar
																<ChevronDown className="h-3 w-3" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="start" className="w-56">
															{centro.contacto_email && (
																<DropdownMenuItem asChild className="cursor-pointer">
																	<a
																		href={`mailto:${centro.contacto_email}`}
																		className="flex items-center gap-3"
																	>
																		<Mail className="h-4 w-4 text-muted-foreground" />
																		<div className="flex flex-col gap-0.5">
																			<span className="text-xs text-muted-foreground">Email</span>
																			<span className="text-sm">{centro.contacto_email}</span>
																		</div>
																	</a>
																</DropdownMenuItem>
															)}
															{centro.contacto_telefono && (
																<DropdownMenuItem asChild className="cursor-pointer">
																	<a
																		href={`tel:${centro.contacto_telefono}`}
																		className="flex items-center gap-3"
																	>
																		<Phone className="h-4 w-4 text-muted-foreground" />
																		<div className="flex flex-col gap-0.5">
																			<span className="text-xs text-muted-foreground">Teléfono</span>
																			<span className="text-sm">{centro.contacto_telefono}</span>
																		</div>
																	</a>
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Badge variant={centro.activo ? "default" : "secondary"}>{centro.activo ? "Activo" : "Inactivo"}</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<CentroEditDialog centro={centro} />
												<Button variant="ghost" size="icon" onClick={() => setDeleteId(centro.id)} className="h-8 w-8 text-destructive hover:text-destructive">
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
						<AlertDialogTitle>¿Eliminar centro?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. El centro será eliminado permanentemente. Si el centro está siendo usado en alguna ruta, no podrá ser eliminado.
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
