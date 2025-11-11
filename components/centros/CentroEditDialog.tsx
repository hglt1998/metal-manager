"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TipoCentro } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Loader2 } from "lucide-react";
import { LocationPicker } from "./LocationPicker";

type Centro = {
	id: string;
	nombre: string;
	tipo: TipoCentro;
	direccion: string;
	latitud: number | null;
	longitud: number | null;
	restriccion_altura_m: number | null;
	restriccion_anchura_m: number | null;
	restriccion_peso_kg: number | null;
	horario_apertura: string | null;
	horario_cierre: string | null;
	dias_operacion: string | null;
	contacto_nombre: string | null;
	contacto_telefono: string | null;
	contacto_email: string | null;
	activo: boolean | null;
	notas: string | null;
};

type CentroEditDialogProps = {
	centro: Centro;
	onSuccess: () => void;
};

export function CentroEditDialog({ centro, onSuccess }: CentroEditDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("general");
	const [formData, setFormData] = useState({
		nombre: centro.nombre,
		tipo: centro.tipo,
		direccion: centro.direccion,
		latitud: centro.latitud?.toString() || "",
		longitud: centro.longitud?.toString() || "",
		restriccion_altura_m: centro.restriccion_altura_m?.toString() || "",
		restriccion_anchura_m: centro.restriccion_anchura_m?.toString() || "",
		restriccion_peso_kg: centro.restriccion_peso_kg?.toString() || "",
		horario_apertura: centro.horario_apertura || "",
		horario_cierre: centro.horario_cierre || "",
		dias_operacion: centro.dias_operacion || "",
		contacto_nombre: centro.contacto_nombre || "",
		contacto_telefono: centro.contacto_telefono || "",
		contacto_email: centro.contacto_email || "",
		activo: centro.activo ?? true,
		notas: centro.notas || "",
	});
	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const { error } = await supabase
			.from("centros")
			.update({
				nombre: formData.nombre,
				tipo: formData.tipo,
				direccion: formData.direccion,
				latitud: formData.latitud ? parseFloat(formData.latitud) : null,
				longitud: formData.longitud ? parseFloat(formData.longitud) : null,
				restriccion_altura_m: formData.restriccion_altura_m ? parseFloat(formData.restriccion_altura_m) : null,
				restriccion_anchura_m: formData.restriccion_anchura_m ? parseFloat(formData.restriccion_anchura_m) : null,
				restriccion_peso_kg: formData.restriccion_peso_kg ? parseFloat(formData.restriccion_peso_kg) : null,
				horario_apertura: formData.horario_apertura || null,
				horario_cierre: formData.horario_cierre || null,
				dias_operacion: formData.dias_operacion || null,
				contacto_nombre: formData.contacto_nombre || null,
				contacto_telefono: formData.contacto_telefono || null,
				contacto_email: formData.contacto_email || null,
				activo: formData.activo,
				notas: formData.notas || null,
			})
			.eq("id", centro.id);

		if (error) {
			console.error("Error al actualizar centro:", error);
			alert("Error al actualizar el centro");
		} else {
			setActiveTab("general");
			setOpen(false);
			onSuccess();
		}

		setLoading(false);
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setActiveTab("general");
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" className="h-8 w-8">
					<Pencil className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Editar Centro</DialogTitle>
						<DialogDescription>Modifica la información del centro de reciclaje.</DialogDescription>
					</DialogHeader>

					<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="general">General</TabsTrigger>
							<TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
							<TabsTrigger value="restricciones">Restricciones</TabsTrigger>
							<TabsTrigger value="horarios">Horarios</TabsTrigger>
						</TabsList>

						<TabsContent value="general" className="space-y-4 mt-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-nombre">
									Nombre <span className="text-destructive">*</span>
								</Label>
								<Input
									id="edit-nombre"
									placeholder="Ej: Centro de Reciclaje Norte"
									value={formData.nombre}
									onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
									required
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-tipo">
									Tipo <span className="text-destructive">*</span>
								</Label>
								<Select value={formData.tipo} onValueChange={(value: TipoCentro) => setFormData({ ...formData, tipo: value })} disabled={loading}>
									<SelectTrigger id="edit-tipo">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="remitente">Remitente (Recogida)</SelectItem>
										<SelectItem value="destino">Destino (Entrega)</SelectItem>
										<SelectItem value="ambos">Ambos</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-contacto_nombre">Contacto</Label>
								<Input
									id="edit-contacto_nombre"
									placeholder="Nombre del contacto"
									value={formData.contacto_nombre}
									onChange={(e) => setFormData({ ...formData, contacto_nombre: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-contacto_telefono">Teléfono</Label>
								<Input
									id="edit-contacto_telefono"
									type="tel"
									placeholder="+34 123 456 789"
									value={formData.contacto_telefono}
									onChange={(e) => setFormData({ ...formData, contacto_telefono: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-contacto_email">Email</Label>
								<Input
									id="edit-contacto_email"
									type="email"
									placeholder="contacto@centro.com"
									value={formData.contacto_email}
									onChange={(e) => setFormData({ ...formData, contacto_email: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="edit-activo">Centro activo</Label>
								<Switch
									id="edit-activo"
									checked={formData.activo}
									onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-notas">Notas</Label>
								<Textarea
									id="edit-notas"
									placeholder="Información adicional sobre el centro"
									value={formData.notas}
									onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
									disabled={loading}
									rows={3}
								/>
							</div>
						</TabsContent>

						<TabsContent value="ubicacion" className="space-y-4 mt-4">
							<LocationPicker
								direccion={formData.direccion}
								latitud={formData.latitud}
								longitud={formData.longitud}
								onLocationChange={(data) => setFormData({ ...formData, ...data })}
								disabled={loading}
							/>
						</TabsContent>

						<TabsContent value="restricciones" className="space-y-4 mt-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-restriccion_altura_m">Altura máxima (metros)</Label>
								<Input
									id="edit-restriccion_altura_m"
									type="number"
									step="0.01"
									min="0"
									placeholder="Ej: 3.5"
									value={formData.restriccion_altura_m}
									onChange={(e) => setFormData({ ...formData, restriccion_altura_m: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-restriccion_anchura_m">Anchura máxima (metros)</Label>
								<Input
									id="edit-restriccion_anchura_m"
									type="number"
									step="0.01"
									min="0"
									placeholder="Ej: 2.5"
									value={formData.restriccion_anchura_m}
									onChange={(e) => setFormData({ ...formData, restriccion_anchura_m: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-restriccion_peso_kg">Peso máximo (kilogramos)</Label>
								<Input
									id="edit-restriccion_peso_kg"
									type="number"
									step="0.01"
									min="0"
									placeholder="Ej: 3500"
									value={formData.restriccion_peso_kg}
									onChange={(e) => setFormData({ ...formData, restriccion_peso_kg: e.target.value })}
									disabled={loading}
								/>
							</div>
						</TabsContent>

						<TabsContent value="horarios" className="space-y-4 mt-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="edit-horario_apertura">Hora de apertura</Label>
									<Input
										id="edit-horario_apertura"
										type="time"
										value={formData.horario_apertura}
										onChange={(e) => setFormData({ ...formData, horario_apertura: e.target.value })}
										disabled={loading}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="edit-horario_cierre">Hora de cierre</Label>
									<Input
										id="edit-horario_cierre"
										type="time"
										value={formData.horario_cierre}
										onChange={(e) => setFormData({ ...formData, horario_cierre: e.target.value })}
										disabled={loading}
									/>
								</div>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-dias_operacion">Días de operación</Label>
								<Input
									id="edit-dias_operacion"
									placeholder="Ej: Lunes a Viernes, L-V, 24/7"
									value={formData.dias_operacion}
									onChange={(e) => setFormData({ ...formData, dias_operacion: e.target.value })}
									disabled={loading}
								/>
							</div>
						</TabsContent>
					</Tabs>

					<DialogFooter className="gap-2 mt-6">
						<Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
							Cancelar
						</Button>

						{activeTab === "general" && (
							<Button type="button" onClick={() => setActiveTab("ubicacion")} disabled={loading}>
								Siguiente
							</Button>
						)}

						{activeTab === "ubicacion" && (
							<>
								<Button type="button" variant="outline" onClick={() => setActiveTab("general")} disabled={loading}>
									Anterior
								</Button>
								<Button type="button" onClick={() => setActiveTab("restricciones")} disabled={loading}>
									Siguiente
								</Button>
							</>
						)}

						{activeTab === "restricciones" && (
							<>
								<Button type="button" variant="outline" onClick={() => setActiveTab("ubicacion")} disabled={loading}>
									Anterior
								</Button>
								<Button type="button" onClick={() => setActiveTab("horarios")} disabled={loading}>
									Siguiente
								</Button>
							</>
						)}

						{activeTab === "horarios" && (
							<>
								<Button type="button" variant="outline" onClick={() => setActiveTab("restricciones")} disabled={loading}>
									Anterior
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
							</>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
