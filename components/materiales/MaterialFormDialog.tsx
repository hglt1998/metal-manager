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
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function MaterialFormDialog() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		nombre: "",
		descripcion: "",
		activo: true,
	});
	const supabase = createClient();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const { error } = await supabase.from("materiales").insert([
			{
				nombre: formData.nombre,
				descripcion: formData.descripcion || null,
				activo: formData.activo,
			},
		]);

		if (error) {
			console.error("Error al crear material:", error);
			alert("Error al crear el material");
		} else {
			setFormData({ nombre: "", descripcion: "", activo: true });
			setOpen(false);
			router.refresh();
		}

		setLoading(false);
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
						<DialogDescription>
							Agrega un nuevo tipo de material para las rutas de recogida.
						</DialogDescription>
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
							<Label htmlFor="descripcion">Descripción</Label>
							<Textarea
								id="descripcion"
								placeholder="Descripción opcional del material"
								value={formData.descripcion}
								onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
								disabled={loading}
								rows={3}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="activo">Material activo</Label>
								<div className="text-sm text-muted-foreground">
									Los materiales inactivos no aparecerán en las opciones de rutas
								</div>
							</div>
							<Switch
								id="activo"
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
