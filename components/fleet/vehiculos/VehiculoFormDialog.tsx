"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createVehiculosService } from "@/lib/services/vehiculos.service";
import type { Database } from "@/types/database";

type VehiculoInsert = Database["public"]["Tables"]["vehiculos"]["Insert"];

interface VehiculoFormDialogProps {
	onSuccess: () => void;
}

const TIPOS_VEHICULO = [
	{ value: "furgón", label: "Furgón" },
	{ value: "camión", label: "Camión" },
	{ value: "bañera", label: "Bañera" },
];

export function VehiculoFormDialog({ onSuccess }: VehiculoFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);

	const [formData, setFormData] = useState<VehiculoInsert>({
		matricula: "",
		tipo: "furgón",
		activo: true,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const supabase = createClient();
			const vehiculosService = createVehiculosService(supabase);

			await vehiculosService.createVehiculo(formData);

			setOpen(false);
			setFormData({
				matricula: "",
				tipo: "furgón",
				activo: true,
			});
			onSuccess();
		} catch (error) {
			console.error("Error al crear vehículo:", error);
			alert("Error al crear el vehículo");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus className="mr-2 h-4 w-4" />
					Nuevo
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Crear nuevo vehículo</DialogTitle>
					<DialogDescription>Añade un nuevo vehículo al sistema</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="matricula">
								Matrícula <span className="text-destructive">*</span>
							</Label>
							<Input
								id="matricula"
								value={formData.matricula}
								onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
								placeholder="Ej: 1387/LXY"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="tipo">
								Tipo <span className="text-destructive">*</span>
							</Label>
							<Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
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
							<Switch id="activo" checked={formData.activo} onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })} />
						</div>
					</div>
					<div className="flex justify-end gap-3">
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
							Cancelar
						</Button>
						<Button type="submit" disabled={saving}>
							{saving ? "Guardando..." : "Crear vehículo"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
