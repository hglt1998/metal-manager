"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import { Switch } from "@/components/ui/switch";
import { Pencil, Loader2 } from "lucide-react";

type Material = {
	id: string;
	nombre: string;
	descripcion: string | null;
	activo: boolean;
};

type MaterialEditDialogProps = {
	material: Material;
	onSuccess: () => void;
};

export function MaterialEditDialog({ material, onSuccess }: MaterialEditDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		nombre: material.nombre,
		descripcion: material.descripcion || "",
		activo: material.activo,
	});
	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const { error } = await supabase
			.from("materiales")
			.update({
				nombre: formData.nombre,
				descripcion: formData.descripcion || null,
				activo: formData.activo,
			})
			.eq("id", material.id);

		if (error) {
			console.error("Error al actualizar material:", error);
			alert("Error al actualizar el material");
		} else {
			setOpen(false);
			onSuccess();
		}

		setLoading(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" className="h-8 w-8">
					<Pencil className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Editar Material</DialogTitle>
						<DialogDescription>
							Modifica la información del material.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="edit-nombre">
								Nombre <span className="text-destructive">*</span>
							</Label>
							<Input
								id="edit-nombre"
								placeholder="Ej: Cartón, Plástico, Metal..."
								value={formData.nombre}
								onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
								required
								disabled={loading}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-descripcion">Descripción</Label>
							<Textarea
								id="edit-descripcion"
								placeholder="Descripción opcional del material"
								value={formData.descripcion}
								onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
								disabled={loading}
								rows={3}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="edit-activo">Material activo</Label>
								<div className="text-sm text-muted-foreground">
									Los materiales inactivos no aparecerán en las opciones de rutas
								</div>
							</div>
							<Switch
								id="edit-activo"
								checked={formData.activo}
								onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
								disabled={loading}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
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
