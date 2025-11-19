"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createRemolquesService } from "@/lib/services/remolques.service";
import type { Database } from "@/types/database";

type RemolqueInsert = Database["public"]["Tables"]["remolques"]["Insert"];

interface RemolqueFormDialogProps {
	onSuccess: () => void;
}

export function RemolqueFormDialog({ onSuccess }: RemolqueFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);

	const [formData, setFormData] = useState<RemolqueInsert>({
		matricula: "",
		tipo: null,
		activo: true
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const supabase = createClient();
			const remolquesService = createRemolquesService(supabase);

			await remolquesService.createRemolque(formData);

			setOpen(false);
			setFormData({
				matricula: "",
				tipo: null,
				activo: true
			});
			onSuccess();
		} catch (error) {
			console.error("Error al crear remolque:", error);
			alert("Error al crear el remolque");
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
					<DialogTitle>Crear nuevo remolque</DialogTitle>
					<DialogDescription>Añade un nuevo remolque al sistema</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="matricula">
								Matrícula <span className="text-destructive">*</span>
							</Label>
							<Input id="matricula" value={formData.matricula} onChange={(e) => setFormData({ ...formData, matricula: e.target.value })} placeholder="Ej: R4440BCJ" required />
						</div>

						<div className="grid gap-2">
							<Label htmlFor="tipo">Tipo</Label>
							<Input id="tipo" value={formData.tipo || ""} onChange={(e) => setFormData({ ...formData, tipo: e.target.value || null })} placeholder="Ej: bañera aluminio" />
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="activo">Remolque activo</Label>
							<Switch id="activo" checked={formData.activo} onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })} />
						</div>
					</div>
					<div className="flex justify-end gap-3">
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
							Cancelar
						</Button>
						<Button type="submit" disabled={saving}>
							{saving ? "Guardando..." : "Crear remolque"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
