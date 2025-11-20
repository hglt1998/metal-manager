"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Users, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClienteEditDialog } from "@/components/clientes/ClienteEditDialog";
import { useCliente } from "@/hooks/useCliente";
import { TIPOS_CLIENTE_LABELS } from "@/lib/constants/clientes.constants";
import { getClienteStatusClass, getClienteStatusText } from "@/lib/utils/clientes.utils";

export default function ClienteDetailPage() {
	const params = useParams();
	const router = useRouter();
	const clienteId = params.id as string;

	const { cliente, loading, refreshCliente } = useCliente({ clienteId, autoLoad: true });
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!cliente) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<p className="text-muted-foreground">Cliente no encontrado</p>
				<Button onClick={() => router.push("/dashboard/clientes")} variant="outline">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Volver a Clientes
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-4">
						<Button onClick={() => router.push("/dashboard/clientes")} variant="outline" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<div>
							<div className="flex items-center gap-3 mb-2">
								<h1 className="text-3xl font-bold tracking-tight">{cliente.nombre}</h1>
								<div className="flex items-center gap-2">
									<div className={`w-2 h-2 rounded-full ${getClienteStatusClass(cliente.activo)}`} />
									<span className="text-sm text-muted-foreground">{getClienteStatusText(cliente.activo)}</span>
								</div>
							</div>
							<p className="text-muted-foreground">CIF: {cliente.cif}</p>
						</div>
					</div>
					<Button onClick={() => setEditDialogOpen(true)} variant="outline" size="sm" className="gap-2">
						<Pencil className="h-4 w-4" />
						Editar
					</Button>
				</div>

				{/* Información del Cliente */}
				<Card className="border-border/40">
					<CardHeader>
						<CardTitle>Información del Cliente</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Tipos de Cliente */}
							<div>
								<label className="text-sm font-medium text-muted-foreground">Tipo de Cliente</label>
								<div className="flex flex-wrap gap-1 mt-2">
									{cliente.tipo_cliente && cliente.tipo_cliente.length > 0 ? (
										cliente.tipo_cliente.map((tipo) => (
											<Badge key={tipo} variant="secondary">
												{TIPOS_CLIENTE_LABELS[tipo]}
											</Badge>
										))
									) : (
										<span className="text-sm text-muted-foreground">Sin tipo asignado</span>
									)}
								</div>
							</div>

							{/* Dirección */}
							<div>
								<label className="text-sm font-medium text-muted-foreground">Dirección</label>
								<p className="mt-2">{cliente.direccion || "-"}</p>
							</div>

							{/* Persona de Contacto */}
							<div>
								<label className="text-sm font-medium text-muted-foreground">Persona de Contacto</label>
								<p className="mt-2">{cliente.persona_contacto || "-"}</p>
							</div>

							{/* Email */}
							<div>
								<label className="text-sm font-medium text-muted-foreground">Email</label>
								<p className="mt-2">
									{cliente.email_contacto ? (
										<a href={`mailto:${cliente.email_contacto}`} className="text-primary hover:underline">
											{cliente.email_contacto}
										</a>
									) : (
										"-"
									)}
								</p>
							</div>

							{/* Teléfono */}
							<div>
								<label className="text-sm font-medium text-muted-foreground">Teléfono</label>
								<p className="mt-2">
									{cliente.telefono_contacto ? (
										<a href={`tel:${cliente.telefono_contacto}`} className="text-primary hover:underline">
											{cliente.telefono_contacto}
										</a>
									) : (
										"-"
									)}
								</p>
							</div>
						</div>

						{/* Centros Asociados */}
						<div className="pt-4 border-t border-border/40">
							<label className="text-sm font-medium text-muted-foreground">Centros Asociados</label>
							<div className="flex flex-wrap gap-2 mt-2">
								{cliente.centros && cliente.centros.length > 0 ? (
									cliente.centros.map((centro) => (
										<Badge key={centro.id} variant="outline">
											{centro.nombre}
										</Badge>
									))
								) : (
									<span className="text-sm text-muted-foreground">Sin centros asociados</span>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Trabajos Asociados - Placeholder */}
				<Card className="border-border/40">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Trabajos Asociados
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center py-12 text-muted-foreground">
							<p className="text-lg font-medium">Sección en desarrollo</p>
							<p className="text-sm mt-2">Aquí se mostrarán los trabajos asociados a este cliente</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Edit Dialog */}
			{editDialogOpen && cliente && (
				<ClienteEditDialog
					cliente={cliente}
					onClose={() => setEditDialogOpen(false)}
					onSuccess={() => {
						setEditDialogOpen(false);
						refreshCliente();
					}}
				/>
			)}
		</>
	);
}
