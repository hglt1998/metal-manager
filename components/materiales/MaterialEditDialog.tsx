"use client";

import { useState } from "react";
import { useMateriales } from "@/hooks/useMateriales";
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
	material: string;
	material_familia: string | null;
	ler_01: string | null;
	ler_02: string | null;
	ler_03: string | null;
	ler_04: string | null;
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
		material: material.material,
		material_familia: material.material_familia || "",
		ler_01: material.ler_01 || "",
		ler_02: material.ler_02 || "",
		ler_03: material.ler_03 || "",
		ler_04: material.ler_04 || "",
		precio_kg: material.precio_kg,
	});
	const { updateMaterial } = useMateriales({ autoLoad: false });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await updateMaterial(material.id, {
				material: formData.material,
				material_familia: formData.material_familia || null,
				ler_01: formData.ler_01 || null,
				ler_02: formData.ler_02 || null,
				ler_03: formData.ler_03 || null,
				ler_04: formData.ler_04 || null,
				precio_kg: formData.precio_kg,
			});

			setOpen(false);
			onSuccess();
		} catch (error) {
			console.error("Error al actualizar material:", error);
			alert("Error al actualizar el material");
		} finally {
			setLoading(false);
		}
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
					<div className="grid gap-4 py-4 px-1 max-h-[60vh] overflow-y-auto -mx-1">
						<div className="grid gap-2">
							<Label htmlFor="edit-material">
								Material <span className="text-destructive">*</span>
							</Label>
							<Input
								id="edit-material"
								placeholder="Ej: acero inoxidable"
								value={formData.material}
								onChange={(e) => setFormData({ ...formData, material: e.target.value })}
								required
								disabled={loading}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-material_familia">
								Familia del Material
							</Label>
							<Input
								id="edit-material_familia"
								placeholder="Ej: acero, plástico, madera"
								value={formData.material_familia}
								onChange={(e) => setFormData({ ...formData, material_familia: e.target.value })}
								disabled={loading}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="grid gap-2">
								<Label htmlFor="edit-ler_01">
									LER 01
								</Label>
								<Input
									id="edit-ler_01"
									placeholder="16.01.17"
									value={formData.ler_01}
									onChange={(e) => setFormData({ ...formData, ler_01: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-ler_02">
									LER 02
								</Label>
								<Input
									id="edit-ler_02"
									placeholder="17.04.05"
									value={formData.ler_02}
									onChange={(e) => setFormData({ ...formData, ler_02: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-ler_03">
									LER 03
								</Label>
								<Input
									id="edit-ler_03"
									placeholder="19.12.02"
									value={formData.ler_03}
									onChange={(e) => setFormData({ ...formData, ler_03: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-ler_04">
									LER 04
								</Label>
								<Input
									id="edit-ler_04"
									placeholder="20.01.40"
									value={formData.ler_04}
									onChange={(e) => setFormData({ ...formData, ler_04: e.target.value })}
									disabled={loading}
								/>
							</div>
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
