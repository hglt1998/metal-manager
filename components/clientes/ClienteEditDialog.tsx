"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import type { Database, TipoCliente } from "@/types/database";
import type { ClienteWithCentros } from "@/lib/services/clientes.service";
import { TipoClienteSelect } from "./TipoClienteSelect";

type Centro = Database["public"]["Tables"]["centros"]["Row"];

interface ClienteEditDialogProps {
	cliente: ClienteWithCentros;
	onClose: () => void;
	onSuccess?: () => void;
}

export function ClienteEditDialog({ cliente, onClose, onSuccess }: ClienteEditDialogProps) {
	const [loading, setLoading] = useState(false);
	const [centros, setCentros] = useState<Centro[]>([]);
	const [loadingCentros, setLoadingCentros] = useState(true);
	const { updateCliente } = useClientes({ autoLoad: false });

	const [formData, setFormData] = useState({
		nombre: cliente.nombre,
		cif: cliente.cif,
		direccion: cliente.direccion || "",
		email_contacto: cliente.email_contacto || "",
		telefono_contacto: cliente.telefono_contacto || "",
		persona_contacto: cliente.persona_contacto || "",
		tipo_cliente: cliente.tipo_cliente || [] as TipoCliente[],
		activo: cliente.activo,
		centroIds: cliente.centros?.map((c) => c.id) || [],
	});

	useEffect(() => {
		loadCentros();
	}, []);

	const loadCentros = async () => {
		try {
			setLoadingCentros(true);
			const supabase = createClient();
			const { data, error } = await supabase
				.from("centros")
				.select("*")
				.eq("activo", true)
				.order("nombre", { ascending: true });

			if (error) throw error;
			setCentros(data || []);
		} catch (error) {
			console.error("Error loading centros:", error);
		} finally {
			setLoadingCentros(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const { centroIds, ...clienteData } = formData;
			// Convert empty strings to null for optional fields
			const dataToSubmit = {
				...clienteData,
				direccion: clienteData.direccion || null,
				email_contacto: clienteData.email_contacto || null,
				telefono_contacto: clienteData.telefono_contacto || null,
				persona_contacto: clienteData.persona_contacto || null,
			};
			await updateCliente(cliente.id, dataToSubmit, centroIds);
			onSuccess?.();
		} catch (error) {
			console.error("Error updating cliente:", error);
		} finally {
			setLoading(false);
		}
	};

	const toggleCentro = (centroId: string) => {
		setFormData((prev) => ({
			...prev,
			centroIds: prev.centroIds.includes(centroId)
				? prev.centroIds.filter((id) => id !== centroId)
				: [...prev.centroIds, centroId],
		}));
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Editar Cliente</DialogTitle>
						<DialogDescription>Modifica los datos del cliente.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="nombre">Nombre *</Label>
							<Input
								id="nombre"
								value={formData.nombre}
								onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
								required
								placeholder="Ej: Transportes López S.L."
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="cif">CIF *</Label>
							<Input
								id="cif"
								value={formData.cif}
								onChange={(e) => setFormData({ ...formData, cif: e.target.value.toUpperCase() })}
								required
								placeholder="Ej: B12345678"
								maxLength={9}
							/>
						</div>

						<div className="grid gap-2">
							<Label>Tipo de Cliente</Label>
							<TipoClienteSelect
								value={formData.tipo_cliente}
								onChange={(tipo_cliente) => setFormData({ ...formData, tipo_cliente })}
							/>
							<p className="text-xs text-muted-foreground">Selecciona uno o más tipos que apliquen al cliente</p>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="direccion">Dirección</Label>
							<Input
								id="direccion"
								value={formData.direccion}
								onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
								placeholder="Ej: Calle Mayor 123, 28001 Madrid"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="persona_contacto">Persona de Contacto</Label>
							<Input
								id="persona_contacto"
								value={formData.persona_contacto}
								onChange={(e) => setFormData({ ...formData, persona_contacto: e.target.value })}
								placeholder="Ej: Juan López García"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="email_contacto">Email de Contacto</Label>
								<Input
									id="email_contacto"
									type="email"
									value={formData.email_contacto}
									onChange={(e) => setFormData({ ...formData, email_contacto: e.target.value })}
									placeholder="contacto@ejemplo.com"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="telefono_contacto">Teléfono de Contacto</Label>
								<Input
									id="telefono_contacto"
									type="tel"
									value={formData.telefono_contacto}
									onChange={(e) => setFormData({ ...formData, telefono_contacto: e.target.value })}
									placeholder="+34 912345678"
								/>
							</div>
						</div>

						<div className="grid gap-2">
							<Label>Centros Asociados (opcional)</Label>
							{loadingCentros ? (
								<div className="flex items-center justify-center py-4">
									<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
								</div>
							) : centros.length === 0 ? (
								<p className="text-sm text-muted-foreground">No hay centros disponibles</p>
							) : (
								<div className="border rounded-md p-3 max-h-[200px] overflow-y-auto space-y-2">
									{centros.map((centro) => (
										<div key={centro.id} className="flex items-center space-x-2">
											<Checkbox
												id={`centro-${centro.id}`}
												checked={formData.centroIds.includes(centro.id)}
												onCheckedChange={() => toggleCentro(centro.id)}
											/>
											<label
												htmlFor={`centro-${centro.id}`}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
											>
												{centro.nombre} - {centro.direccion}
											</label>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="flex items-center space-x-2">
							<Switch
								id="activo"
								checked={formData.activo}
								onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
							/>
							<Label htmlFor="activo">Cliente activo</Label>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose} disabled={loading}>
							Cancelar
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Guardando...
								</>
							) : (
								"Guardar Cambios"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
