"use client";

import { useState } from "react";
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
import { useCentroForm } from "./hooks/useCentroForm";
import { useTabNavigation } from "./hooks/useTabNavigation";

interface CentroFormDialogProps {
	onSuccess?: () => void;
}

export function CentroFormDialog({ onSuccess }: CentroFormDialogProps) {
	const [open, setOpen] = useState(false);
	const { formData, loading, updateField, updateLocation, resetForm, createCentro } = useCentroForm({ onSuccess });
	const { activeTab, goToNext, goToPrevious, goToTab, reset: resetTab } = useTabNavigation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const success = await createCentro();
		if (success) {
			setOpen(false);
			resetTab();
		}
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			resetTab();
			resetForm();
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
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-6 sm:p-8">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Nuevo Centro</DialogTitle>
						<DialogDescription>Agrega un nuevo centro de reciclaje o recogida.</DialogDescription>
					</DialogHeader>

					<Tabs value={activeTab} onValueChange={goToTab} className="mt-4">
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
									onChange={(e) => updateField("nombre", e.target.value)}
									required
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="tipo">
									Tipo <span className="text-destructive">*</span>
								</Label>
								<Select value={formData.tipo} onValueChange={(value: TipoCentro) => updateField("tipo", value)} disabled={loading}>
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
									onChange={(e) => updateField("contacto_nombre", e.target.value)}
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
									onChange={(e) => updateField("contacto_telefono", e.target.value)}
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
									onChange={(e) => updateField("contacto_email", e.target.value)}
									disabled={loading}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="activo">Centro activo</Label>
								<Switch id="activo" checked={formData.activo} onCheckedChange={(checked) => updateField("activo", checked)} disabled={loading} />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="notas">Notas</Label>
								<Textarea
									id="notas"
									placeholder="Información adicional sobre el centro"
									value={formData.notas}
									onChange={(e) => updateField("notas", e.target.value)}
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
								onLocationChange={updateLocation}
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
									onChange={(e) => updateField("restriccion_altura_m", e.target.value)}
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
									onChange={(e) => updateField("restriccion_anchura_m", e.target.value)}
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
									onChange={(e) => updateField("restriccion_peso_kg", e.target.value)}
									disabled={loading}
								/>
							</div>
						</TabsContent>

						<TabsContent value="horarios" className="space-y-4 mt-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="horario_apertura">Hora de apertura</Label>
									<Input id="horario_apertura" type="time" value={formData.horario_apertura} onChange={(e) => updateField("horario_apertura", e.target.value)} disabled={loading} />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="horario_cierre">Hora de cierre</Label>
									<Input id="horario_cierre" type="time" value={formData.horario_cierre} onChange={(e) => updateField("horario_cierre", e.target.value)} disabled={loading} />
								</div>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="dias_operacion">Días de operación</Label>
								<Input
									id="dias_operacion"
									placeholder="Ej: Lunes a Viernes, L-V, 24/7"
									value={formData.dias_operacion}
									onChange={(e) => updateField("dias_operacion", e.target.value)}
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
							<Button type="button" onClick={goToNext} disabled={loading}>
								Siguiente
							</Button>
						)}

						{activeTab === "ubicacion" && (
							<>
								<Button type="button" variant="outline" onClick={goToPrevious} disabled={loading}>
									Anterior
								</Button>
								<Button type="button" onClick={goToNext} disabled={loading}>
									Siguiente
								</Button>
							</>
						)}

						{activeTab === "restricciones" && (
							<>
								<Button type="button" variant="outline" onClick={goToPrevious} disabled={loading}>
									Anterior
								</Button>
								<Button type="button" onClick={goToNext} disabled={loading}>
									Siguiente
								</Button>
							</>
						)}

						{activeTab === "horarios" && (
							<>
								<Button type="button" variant="outline" onClick={goToPrevious} disabled={loading}>
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
