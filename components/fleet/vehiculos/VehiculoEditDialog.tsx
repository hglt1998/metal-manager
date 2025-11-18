"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { createVehiculosService } from "@/lib/services/vehiculos.service";
import type { Database } from "@/types/database";

type Vehiculo = Database["public"]["Tables"]["vehiculos"]["Row"];
type VehiculoUpdate = Database["public"]["Tables"]["vehiculos"]["Update"];

interface VehiculoEditDialogProps {
	vehiculo: Vehiculo;
	onClose: () => void;
	onSuccess: () => void;
}

const TIPOS_VEHICULO = [
	{ value: "furgón", label: "Furgón" },
	{ value: "furgón abierto", label: "Furgón abierto" },
	{ value: "camión", label: "Camión" },
	{ value: "bañera", label: "Bañera" },
	{ value: "paquetero", label: "Paquetero" },
	{ value: "camión rojo", label: "Camión rojo" },
	{ value: "camión abierto", label: "Camión abierto" },
	{ value: "camión pulpo", label: "Camión pulpo" },
	{ value: "camión contenedor", label: "Camión contenedor" }
];

export function VehiculoEditDialog({ vehiculo, onClose, onSuccess }: VehiculoEditDialogProps) {
	const [saving, setSaving] = useState(false);

	const [formData, setFormData] = useState<VehiculoUpdate>({
		matricula: vehiculo.matricula,
		tipo: vehiculo.tipo,
		activo: vehiculo.activo
	});

	useEffect(() => {
		setFormData({
			matricula: vehiculo.matricula,
			tipo: vehiculo.tipo,
			activo: vehiculo.activo
		});
	}, [vehiculo]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const supabase = createClient();
			const vehiculosService = createVehiculosService(supabase);

			await vehiculosService.updateVehiculo(vehiculo.id, formData);

			onSuccess();
		} catch (error) {
			console.error("Error al actualizar vehículo:", error);
			alert("Error al actualizar el vehículo");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Editar vehículo</DialogTitle>
					<DialogDescription>Modifica los datos del vehículo</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="matricula">
								Matrícula <span className="text-destructive">*</span>
							</Label>
							<Input id="matricula" value={formData.matricula || ""} onChange={(e) => setFormData({ ...formData, matricula: e.target.value })} placeholder="Ej: 1387/LXY" required />
						</div>

						<div className="grid gap-2">
							<Label htmlFor="tipo">
								Tipo <span className="text-destructive">*</span>
							</Label>
							<Select value={formData.tipo || "furgón"} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
								<SelectTrigger id="tipo">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{TIPOS_VEHICULO.map((tipo) => (
										<SelectItem key={tipo.value} value={tipo.value}>
											{tipo.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="activo">Vehículo activo</Label>
							<Switch id="activo" checked={formData.activo || false} onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })} />
						</div>
					</div>
					<div className="flex justify-end gap-3">
						<Button type="button" variant="outline" onClick={onClose} disabled={saving}>
							Cancelar
						</Button>
						<Button type="submit" disabled={saving}>
							{saving ? "Guardando..." : "Guardar cambios"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
