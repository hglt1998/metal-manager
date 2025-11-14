"use client";

import { useState } from "react";
import { useMateriales } from "@/hooks/useMateriales";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

interface MaterialFormDialogProps {
	onSuccess?: () => void;
}

export function MaterialFormDialog({ onSuccess }: MaterialFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		nombre: "",
		precio_kg: 0
	});
	const { createMaterial } = useMateriales({ autoLoad: false });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await createMaterial({
				nombre: formData.nombre,
				precio_kg: formData.precio_kg
			});

			setFormData({ nombre: "", precio_kg: 0 });
			setOpen(false);
			// Llamar al callback onSuccess si existe
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			console.error("Error al crear material:", error);
			alert("Error al crear el material");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Nuevo Material
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Nuevo Material</DialogTitle>
						<DialogDescription>Agrega un nuevo tipo de material para las rutas de recogida.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="nombre">
								Nombre <span className="text-destructive">*</span>
							</Label>
							<Input
								id="nombre"
								placeholder="Ej: Cartón, Plástico, Metal..."
								value={formData.nombre}
								onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
								required
								disabled={loading}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="precio_kg">
								Precio por kg (€/kg) <span className="text-destructive">*</span>
							</Label>
							<Input
								id="precio_kg"
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
					<DialogFooter className="gap-2">
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
							Cancelar
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creando...
								</>
							) : (
								"Crear Material"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
