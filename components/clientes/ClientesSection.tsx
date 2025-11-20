"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Mail, Phone, ChevronDown, MoreVertical } from "lucide-react";
import { ClienteFormDialog } from "./ClienteFormDialog";
import { ClienteEditDialog } from "./ClienteEditDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { ClienteWithCentros } from "@/lib/services/clientes.service";
import type { TipoCliente } from "@/types/database";

const TIPOS_CLIENTE_LABELS: Record<TipoCliente, string> = {
	remitente: "Remitente",
	destinatario: "Destinatario",
	proveedor: "Proveedor",
	cliente: "Cliente",
	agente_aduanas: "Agente de Aduanas",
	transitario: "Transitario",
	transportista: "Transportista",
};

interface ClientesSectionProps {
	clientes: ClienteWithCentros[];
	loading: boolean;
	error: Error | null;
	loadClientes: () => Promise<void>;
	deleteCliente: (clienteId: string) => Promise<void>;
}

export function ClientesSection({ clientes, loading, loadClientes, deleteCliente }: ClientesSectionProps) {
	const [editingCliente, setEditingCliente] = useState<ClienteWithCentros | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async () => {
		if (!deleteId) return;

		try {
			setDeleting(true);
			await deleteCliente(deleteId);
			setDeleteId(null);
		} catch (error) {
			console.error("Error al eliminar cliente:", error);
		} finally {
			setDeleting(false);
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
							Total de {clientes.length} cliente{clientes.length !== 1 ? "s" : ""}
						</p>
						<ClienteFormDialog onSuccess={loadClientes} />
					</div>

					<div className="border-y md:border border-border/40 rounded-none md:rounded-md overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nombre</TableHead>
									<TableHead className="hidden md:table-cell">CIF</TableHead>
									<TableHead>Tipo de Cliente</TableHead>
									<TableHead className="hidden lg:table-cell">Persona de Contacto</TableHead>
									<TableHead className="hidden lg:table-cell">Contacto</TableHead>
									<TableHead className="hidden xl:table-cell">Centros Asociados</TableHead>
									<TableHead className="hidden md:table-cell">Estado</TableHead>
									<TableHead className="text-right">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{clientes.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="text-center text-muted-foreground">
											No hay clientes registrados
										</TableCell>
									</TableRow>
								) : (
									clientes.map((cliente) => (
										<TableRow
											key={cliente.id}
											className={cliente.activo ? "" : "opacity-50 text-muted-foreground"}
										>
											<TableCell className="font-medium">
												<div className="flex flex-col gap-1">
													<span className={cliente.activo ? "" : "line-through"}>{cliente.nombre}</span>
													{!cliente.activo && (
														<Badge variant="secondary" className="w-fit text-xs">Inactivo</Badge>
													)}
												</div>
											</TableCell>
											<TableCell className="hidden md:table-cell">{cliente.cif}</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{cliente.tipo_cliente && cliente.tipo_cliente.length > 0 ? (
														cliente.tipo_cliente.length === 1 ? (
															<Badge variant="secondary" className="text-xs">
																{TIPOS_CLIENTE_LABELS[cliente.tipo_cliente[0]]}
															</Badge>
														) : (
															<Badge variant="secondary" className="text-xs">
																{cliente.tipo_cliente.length} tipos
															</Badge>
														)
													) : (
														<span className="text-sm text-muted-foreground">Sin tipo</span>
													)}
												</div>
											</TableCell>
											<TableCell className="hidden lg:table-cell">{cliente.persona_contacto || "-"}</TableCell>
											<TableCell className="hidden lg:table-cell">
												{!cliente.email_contacto && !cliente.telefono_contacto ? (
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
														<DropdownMenuContent align="start" className="w-fit">
															{cliente.email_contacto && (
																<DropdownMenuItem asChild className="cursor-pointer">
																	<a href={`mailto:${cliente.email_contacto}`} className="flex items-center gap-3">
																		<Mail className="h-4 w-4 text-muted-foreground" />
																		<div className="flex flex-col gap-0.5">
																			<span className="text-xs text-muted-foreground">Email</span>
																			<span className="text-sm">{cliente.email_contacto}</span>
																		</div>
																	</a>
																</DropdownMenuItem>
															)}
															{cliente.telefono_contacto && (
																<DropdownMenuItem asChild className="cursor-pointer">
																	<a href={`tel:${cliente.telefono_contacto}`} className="flex items-center gap-3">
																		<Phone className="h-4 w-4 text-muted-foreground" />
																		<div className="flex flex-col gap-0.5">
																			<span className="text-xs text-muted-foreground">Teléfono</span>
																			<span className="text-sm">{cliente.telefono_contacto}</span>
																		</div>
																	</a>
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												)}
											</TableCell>
											<TableCell className="hidden xl:table-cell">
												<div className="flex flex-wrap gap-1">
													{cliente.centros && cliente.centros.length > 0 ? (
														cliente.centros.map((centro) => (
															<Badge key={centro.id} variant="outline" className="text-xs">
																{centro.nombre}
															</Badge>
														))
													) : (
														<span className="text-sm text-muted-foreground">Sin centros</span>
													)}
												</div>
											</TableCell>
											<TableCell className="hidden md:table-cell">
												<Badge variant={cliente.activo ? "default" : "secondary"}>{cliente.activo ? "Activo" : "Inactivo"}</Badge>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="border-none shadow-lg">
														<DropdownMenuItem onClick={() => setEditingCliente(cliente)} className="cursor-pointer">
															<Pencil className="h-4 w-4 mr-2" />
															Editar
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => setDeleteId(cliente.id)}
															className="cursor-pointer text-destructive focus:text-destructive"
														>
															<Trash2 className="h-4 w-4 mr-2" />
															Eliminar
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{editingCliente && (
				<ClienteEditDialog
					cliente={editingCliente}
					onClose={() => setEditingCliente(null)}
					onSuccess={() => {
						setEditingCliente(null);
						loadClientes();
					}}
				/>
			)}

			<AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
						<AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente de la base de datos.</AlertDialogDescription>
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
