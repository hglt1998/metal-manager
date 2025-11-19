"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { createContenedoresService } from "@/lib/services/contenedores.service";
import type { Database } from "@/types/database";

type Contenedor = Database["public"]["Tables"]["contenedores"]["Row"];
type ContenedorUpdate = Database["public"]["Tables"]["contenedores"]["Update"];

interface ContenedorEditDialogProps {
	contenedor: Contenedor;
	onClose: () => void;
	onSuccess: () => void;
}

export function ContenedorEditDialog({ contenedor, onClose, onSuccess }: ContenedorEditDialogProps) {
	const [saving, setSaving] = useState(false);

	const [formData, setFormData] = useState<ContenedorUpdate>({
		codigo: contenedor.codigo,
		tipo: contenedor.tipo,
		activo: contenedor.activo,
	});

	useEffect(() => {
		setFormData({
			codigo: contenedor.codigo,
			tipo: contenedor.tipo,
			activo: contenedor.activo,
		});
	}, [contenedor]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const supabase = createClient();
			const contenedoresService = createContenedoresService(supabase);

			await contenedoresService.updateContenedor(contenedor.id, formData);

			onSuccess();
		} catch (error) {
			console.error("Error al actualizar contenedor:", error);
			alert("Error al actualizar el contenedor");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Editar contenedor</DialogTitle>
					<DialogDescription>Modifica los datos del contenedor</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="codigo">
								Código <span className="text-destructive">*</span>
							</Label>
							<Input
								id="codigo"
								value={formData.codigo || ""}
								onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
								placeholder="Ej: contenedor 20m3"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="tipo">
								Tipo <span className="text-destructive">*</span>
							</Label>
							<Input
								id="tipo"
								value={formData.tipo || ""}
								onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
								placeholder="Ej: contenedor 20m3"
								required
							/>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="activo">Contenedor activo</Label>
							<Switch
								id="activo"
								checked={formData.activo || false}
								onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
							/>
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
