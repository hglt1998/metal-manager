"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { createRemolquesService } from "@/lib/services/remolques.service";
import type { Database } from "@/types/database";

type Remolque = Database["public"]["Tables"]["remolques"]["Row"];
type RemolqueUpdate = Database["public"]["Tables"]["remolques"]["Update"];

interface RemolqueEditDialogProps {
	remolque: Remolque;
	onClose: () => void;
	onSuccess: () => void;
}

export function RemolqueEditDialog({ remolque, onClose, onSuccess }: RemolqueEditDialogProps) {
	const [saving, setSaving] = useState(false);

	const [formData, setFormData] = useState<RemolqueUpdate>({
		matricula: remolque.matricula,
		batea: remolque.batea,
		activo: remolque.activo,
	});

	useEffect(() => {
		setFormData({
			matricula: remolque.matricula,
			batea: remolque.batea,
			activo: remolque.activo,
		});
	}, [remolque]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const supabase = createClient();
			const remolquesService = createRemolquesService(supabase);

			await remolquesService.updateRemolque(remolque.id, formData);

			onSuccess();
		} catch (error) {
			console.error("Error al actualizar remolque:", error);
			alert("Error al actualizar el remolque");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Editar remolque</DialogTitle>
					<DialogDescription>Modifica los datos del remolque</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="matricula">
								Matrícula <span className="text-destructive">*</span>
							</Label>
							<Input
								id="matricula"
								value={formData.matricula || ""}
								onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
								placeholder="Ej: R4440BCJ"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="batea">Batea</Label>
							<Input
								id="batea"
								value={formData.batea || ""}
								onChange={(e) => setFormData({ ...formData, batea: e.target.value || null })}
								placeholder="Ej: bañera aluminio"
							/>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="activo">Remolque activo</Label>
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
