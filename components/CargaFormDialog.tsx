"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { UnidadMedida } from "@/types/database";
import { useCargaForm } from "@/hooks/useCargaForm";
import { useCargaData } from "@/hooks/useCargaData";
import { useCargaSubmit } from "@/hooks/useCargaSubmit";

interface CargaFormDialogProps {
	userRole: "admin" | "operario";
	userId: string;
}

export function CargaFormDialog({ userRole, userId }: CargaFormDialogProps) {
	const [open, setOpen] = useState(false);
	const isAdmin = userRole === "admin";

	// Custom hooks
	const { formData, fotoPreview, setField, handleFotoChange, removeFoto, resetForm, handleTotalChange } = useCargaForm(isAdmin ? "" : userId);
	const { materiales, ubicacionesRecogida, ubicacionesDestino, operarios, error: dataError } = useCargaData(open, isAdmin);
	const { submitCarga, loading, error: submitError } = useCargaSubmit();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const success = await submitCarga(formData, isAdmin);

		if (success) {
			resetForm();
			setOpen(false);
			alert("Carga registrada correctamente");
		} else if (submitError) {
			alert(submitError);
		}
	};

	const handleFotoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				handleFotoChange(file);
			} catch (err) {
				alert(err instanceof Error ? err.message : "Error al procesar la imagen");
			}
		}
	};

	if (dataError) {
		console.error(dataError);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Nueva Carga
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
				<DialogHeader>
					<DialogTitle>Registrar Nueva Carga</DialogTitle>
					<DialogDescription>Completa todos los campos para registrar una nueva carga.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						{/* Material */}
						<div className="grid gap-2">
							<Label htmlFor="material">
								Material <span className="text-red-500">*</span>
							</Label>
							<Select value={formData.materialId} onValueChange={(value) => setField("materialId", value)} required>
								<SelectTrigger id="material">
									<SelectValue placeholder="Selecciona un material" />
								</SelectTrigger>
								<SelectContent>
									{materiales.map((material) => (
										<SelectItem key={material.id} value={material.id}>
											{material.nombre}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Centro de Recogida */}
						<div className="grid gap-2">
							<Label htmlFor="recogida">
								Centro de Recogida <span className="text-red-500">*</span>
							</Label>
							<Select value={formData.centroRecogidaId} onValueChange={(value) => setField("centroRecogidaId", value)} required>
								<SelectTrigger id="recogida">
									<SelectValue placeholder="Selecciona un centro de recogida" />
								</SelectTrigger>
								<SelectContent>
									{ubicacionesRecogida.map((ubicacion) => (
										<SelectItem key={ubicacion.id} value={ubicacion.id}>
											{ubicacion.nombre}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Centro de Destino */}
						<div className="grid gap-2">
							<Label htmlFor="destino">
								Centro de Destino <span className="text-red-500">*</span>
							</Label>
							<Select value={formData.centroDestinoId} onValueChange={(value) => setField("centroDestinoId", value)} required>
								<SelectTrigger id="destino">
									<SelectValue placeholder="Selecciona un centro de destino" />
								</SelectTrigger>
								<SelectContent>
									{ubicacionesDestino.map((ubicacion) => (
										<SelectItem key={ubicacion.id} value={ubicacion.id}>
											{ubicacion.nombre}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Peso y Unidad de Medida */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="peso">
									Peso <span className="text-red-500">*</span>
								</Label>
								<Input id="peso" type="number" step="0.01" min="0" placeholder="0.00" value={formData.peso} onChange={(e) => setField("peso", e.target.value)} required />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="unidad">
									Unidad de Medida <span className="text-red-500">*</span>
								</Label>
								<select
									id="unidad"
									value={formData.unidadMedida}
									onChange={(e) => setField("unidadMedida", e.target.value as UnidadMedida)}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-size-[1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat"
									required
								>
									<option value="Kilogramos">Kilogramos</option>
									<option value="Toneladas">Toneladas</option>
								</select>
							</div>
						</div>

						{/* Total */}
						<div className="grid gap-2">
							<Label htmlFor="total">
								Total <span className="text-red-500">*</span>
							</Label>
							<Input id="total" type="text" placeholder="0.00€" value={formData.total} onChange={(e) => handleTotalChange(e.target.value)} required />
						</div>

						{/* Foto del Albarán */}
						<div className="grid gap-2">
							<Label htmlFor="foto">Foto Albarán</Label>
							<Input id="foto" type="file" accept="image/*" onChange={handleFotoInputChange} className="cursor-pointer file:cursor-pointer" />
							{fotoPreview && (
								<div className="mt-2 relative">
									<img src={fotoPreview} alt="Preview" className="max-h-40 rounded-md border border-input object-cover" />
									<button type="button" onClick={removeFoto} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
										×
									</button>
								</div>
							)}
						</div>

						{/* Selector de Operario (solo para admins) */}
						{isAdmin && (
							<div className="grid gap-2">
								<Label htmlFor="operario">
									Operario <span className="text-red-500">*</span>
								</Label>
								<Select value={formData.operarioId} onValueChange={(value) => setField("operarioId", value)} required>
									<SelectTrigger id="operario">
										<SelectValue placeholder="Selecciona un operario" />
									</SelectTrigger>
									<SelectContent>
										{operarios.map((operario) => (
											<SelectItem key={operario.id} value={operario.id}>
												{operario.full_name || operario.email}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
					<DialogFooter className="gap-2">
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
							Cancelar
						</Button>
						<Button type="submit" disabled={loading} className="bg-stone-900 text-white hover:bg-stone-700">
							{loading ? "Guardando..." : "Guardar Carga"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
