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
		material: "",
		material_familia: "",
		ler_01: "",
		ler_02: "",
		ler_03: "",
		ler_04: "",
		precio_kg: 0
	});
	const { createMaterial } = useMateriales({ autoLoad: false });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await createMaterial({
				material: formData.material,
				material_familia: formData.material_familia || null,
				ler_01: formData.ler_01 || null,
				ler_02: formData.ler_02 || null,
				ler_03: formData.ler_03 || null,
				ler_04: formData.ler_04 || null,
				precio_kg: formData.precio_kg
			});

			setFormData({ material: "", material_familia: "", ler_01: "", ler_02: "", ler_03: "", ler_04: "", precio_kg: 0 });
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
					<div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
						<div className="grid gap-2">
							<Label htmlFor="material">
								Material <span className="text-destructive">*</span>
							</Label>
							<Input
								id="material"
								placeholder="Ej: acero inoxidable"
								value={formData.material}
								onChange={(e) => setFormData({ ...formData, material: e.target.value })}
								required
								disabled={loading}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="material_familia">
								Familia del Material
							</Label>
							<Input
								id="material_familia"
								placeholder="Ej: acero, plástico, madera"
								value={formData.material_familia}
								onChange={(e) => setFormData({ ...formData, material_familia: e.target.value })}
								disabled={loading}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="grid gap-2">
								<Label htmlFor="ler_01">
									LER 01
								</Label>
								<Input
									id="ler_01"
									placeholder="16.01.17"
									value={formData.ler_01}
									onChange={(e) => setFormData({ ...formData, ler_01: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="ler_02">
									LER 02
								</Label>
								<Input
									id="ler_02"
									placeholder="17.04.05"
									value={formData.ler_02}
									onChange={(e) => setFormData({ ...formData, ler_02: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="ler_03">
									LER 03
								</Label>
								<Input
									id="ler_03"
									placeholder="19.12.02"
									value={formData.ler_03}
									onChange={(e) => setFormData({ ...formData, ler_03: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="ler_04">
									LER 04
								</Label>
								<Input
									id="ler_04"
									placeholder="20.01.40"
									value={formData.ler_04}
									onChange={(e) => setFormData({ ...formData, ler_04: e.target.value })}
									disabled={loading}
								/>
							</div>
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
