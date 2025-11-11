"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TipoCentro } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";
import { LocationPicker } from "./LocationPicker";

interface CentroFormDialogProps {
	onSuccess?: () => void;
}

export function CentroFormDialog({ onSuccess }: CentroFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("general");
	const [formData, setFormData] = useState({
		nombre: "",
		tipo: "remitente" as TipoCentro,
		direccion: "",
		latitud: "",
		longitud: "",
		restriccion_altura_m: "",
		restriccion_anchura_m: "",
		restriccion_peso_kg: "",
		horario_apertura: "",
		horario_cierre: "",
		dias_operacion: "",
		contacto_nombre: "",
		contacto_telefono: "",
		contacto_email: "",
		activo: true,
		notas: ""
	});
	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		console.log(formData);

		const { error } = await supabase.from("centros").insert([
			{
				nombre: formData.nombre,
				tipo: formData.tipo,
				direccion: formData.direccion,
				latitud: formData.latitud ? Number(formData.latitud) : null,
				longitud: formData.longitud ? Number(formData.longitud) : null,
				restriccion_altura_m: formData.restriccion_altura_m ? Number(formData.restriccion_altura_m) : null,
				restriccion_anchura_m: formData.restriccion_anchura_m ? Number(formData.restriccion_anchura_m) : null,
				restriccion_peso_kg: formData.restriccion_peso_kg ? Number(formData.restriccion_peso_kg) : null,
				horario_apertura: formData.horario_apertura || null,
				horario_cierre: formData.horario_cierre || null,
				dias_operacion: formData.dias_operacion || null,
				contacto_nombre: formData.contacto_nombre || null,
				contacto_telefono: formData.contacto_telefono || null,
				contacto_email: formData.contacto_email || null,
				activo: formData.activo,
				notas: formData.notas || null
			}
		]);

		if (error) {
			console.error("Error al crear centro:", error);
			alert("Error al crear el centro");
		} else {
			setFormData({
				nombre: "",
				tipo: "remitente",
				direccion: "",
				latitud: "",
				longitud: "",
				restriccion_altura_m: "",
				restriccion_anchura_m: "",
				restriccion_peso_kg: "",
				horario_apertura: "",
				horario_cierre: "",
				dias_operacion: "",
				contacto_nombre: "",
				contacto_telefono: "",
				contacto_email: "",
				activo: true,
				notas: ""
			});
			setActiveTab("general");
			setOpen(false);
			if (onSuccess) {
				onSuccess();
			}
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
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Nuevo Centro
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Nuevo Centro</DialogTitle>
						<DialogDescription>Agrega un nuevo centro de reciclaje o recogida.</DialogDescription>
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
								<Label htmlFor="nombre">
									Nombre <span className="text-destructive">*</span>
								</Label>
								<Input
									id="nombre"
									placeholder="Ej: Centro de Reciclaje Norte"
									value={formData.nombre}
									onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
									required
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="tipo">
									Tipo <span className="text-destructive">*</span>
								</Label>
								<Select value={formData.tipo} onValueChange={(value: TipoCentro) => setFormData({ ...formData, tipo: value })} disabled={loading}>
									<SelectTrigger id="tipo">
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
								<Label htmlFor="contacto_nombre">Contacto</Label>
								<Input
									id="contacto_nombre"
									placeholder="Nombre del contacto"
									value={formData.contacto_nombre}
									onChange={(e) => setFormData({ ...formData, contacto_nombre: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="contacto_telefono">Teléfono</Label>
								<Input
									id="contacto_telefono"
									type="tel"
									placeholder="+34 123 456 789"
									value={formData.contacto_telefono}
									onChange={(e) => setFormData({ ...formData, contacto_telefono: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="contacto_email">Email</Label>
								<Input
									id="contacto_email"
									type="email"
									placeholder="contacto@centro.com"
									value={formData.contacto_email}
									onChange={(e) => setFormData({ ...formData, contacto_email: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="activo">Centro activo</Label>
								<Switch id="activo" checked={formData.activo} onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })} disabled={loading} />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="notas">Notas</Label>
								<Textarea
									id="notas"
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
								onLocationChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
								disabled={loading}
							/>
						</TabsContent>

						<TabsContent value="restricciones" className="space-y-4 mt-4">
							<div className="grid gap-2">
								<Label htmlFor="restriccion_altura_m">Altura máxima (metros)</Label>
								<Input
									id="restriccion_altura_m"
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
								<Label htmlFor="restriccion_anchura_m">Anchura máxima (metros)</Label>
								<Input
									id="restriccion_anchura_m"
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
								<Label htmlFor="restriccion_peso_kg">Peso máximo (kilogramos)</Label>
								<Input
									id="restriccion_peso_kg"
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
									<Label htmlFor="horario_apertura">Hora de apertura</Label>
									<Input id="horario_apertura" type="time" value={formData.horario_apertura} onChange={(e) => setFormData({ ...formData, horario_apertura: e.target.value })} disabled={loading} />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="horario_cierre">Hora de cierre</Label>
									<Input id="horario_cierre" type="time" value={formData.horario_cierre} onChange={(e) => setFormData({ ...formData, horario_cierre: e.target.value })} disabled={loading} />
								</div>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="dias_operacion">Días de operación</Label>
								<Input
									id="dias_operacion"
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
											Creando...
										</>
									) : (
										"Crear Centro"
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
