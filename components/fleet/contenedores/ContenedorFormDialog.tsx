"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createContenedoresService } from "@/lib/services/contenedores.service";
import type { Database } from "@/types/database";

type ContenedorInsert = Database["public"]["Tables"]["contenedores"]["Insert"];

interface ContenedorFormDialogProps {
	onSuccess: () => void;
}

export function ContenedorFormDialog({ onSuccess }: ContenedorFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);

	const [formData, setFormData] = useState<ContenedorInsert>({
		codigo: "",
		tipo: "",
		activo: true,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const supabase = createClient();
			const contenedoresService = createContenedoresService(supabase);

			await contenedoresService.createContenedor(formData);

			setOpen(false);
			setFormData({
				codigo: "",
				tipo: "",
				activo: true,
			});
			onSuccess();
		} catch (error) {
			console.error("Error al crear contenedor:", error);
			alert("Error al crear el contenedor");
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
					<DialogTitle>Crear nuevo contenedor</DialogTitle>
					<DialogDescription>Añade un nuevo contenedor al sistema</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="codigo">
								Código <span className="text-destructive">*</span>
							</Label>
							<Input
								id="codigo"
								value={formData.codigo}
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
								value={formData.tipo}
								onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
								placeholder="Ej: contenedor 20m3"
								required
							/>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="activo">Contenedor activo</Label>
							<Switch id="activo" checked={formData.activo} onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })} />
						</div>
					</div>
					<div className="flex justify-end gap-3">
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
							Cancelar
						</Button>
						<Button type="submit" disabled={saving}>
							{saving ? "Guardando..." : "Crear contenedor"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
