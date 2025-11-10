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
import { Pencil, Loader2 } from "lucide-react";

type Material = {
	id: string;
	nombre: string;
	precio_kg: number;
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
		precio_kg: material.precio_kg,
	});
	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const { error } = await supabase
			.from("materiales")
			.update({
				nombre: formData.nombre,
				precio_kg: formData.precio_kg,
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
							<Label htmlFor="edit-precio_kg">
								Precio por kg (€/kg) <span className="text-destructive">*</span>
							</Label>
							<Input
								id="edit-precio_kg"
								type="number"
								step="0.01"
								min="0"
								placeholder="0.00"
								value={formData.precio_kg}
								onChange={(e) => setFormData({ ...formData, precio_kg: parseFloat(e.target.value) || 0 })}
								required
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
