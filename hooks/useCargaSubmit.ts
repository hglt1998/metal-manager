import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CargaService } from "@/lib/services/carga.service";
import type { CargaFormData } from "./useCargaForm";

interface ValidationError {
	field: string;
	message: string;
}

export function useCargaSubmit() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const validateForm = (formData: CargaFormData, isAdmin: boolean): ValidationError | null => {
		if (!formData.materialId || !formData.centroRecogidaId || !formData.centroDestinoId || !formData.peso || !formData.total) {
			return { field: "general", message: "Todos los campos son obligatorios" };
		}

		const pesoNum = parseFloat(formData.peso);
		if (pesoNum < 0) {
			return { field: "peso", message: "El peso no puede ser negativo" };
		}

		const totalNum = parseFloat(formData.total.replace(/[^0-9.-]/g, ""));
		if (totalNum < 0) {
			return { field: "total", message: "El total no puede ser negativo" };
		}

		if (isAdmin && !formData.operarioId) {
			return { field: "operario", message: "Debe seleccionar un operario" };
		}

		return null;
	};

	const submitCarga = async (formData: CargaFormData, isAdmin: boolean): Promise<boolean> => {
		setLoading(true);
		setError(null);

		try {
			// Validar formulario
			const validationError = validateForm(formData, isAdmin);
			if (validationError) {
				setError(validationError.message);
				return false;
			}

			const supabase = createClient();
			const service = new CargaService(supabase);

			// Subir foto si existe
			let fotoAlbaranUrl: string | null = null;
			if (formData.fotoAlbaran) {
				fotoAlbaranUrl = await service.uploadFotoAlbaran(formData.fotoAlbaran);
			}

			// Crear carga
			const pesoNum = parseFloat(formData.peso);
			const totalNum = parseFloat(formData.total.replace(/[^0-9.-]/g, ""));

			await service.createCarga({
				material_id: formData.materialId,
				centro_recogida_id: formData.centroRecogidaId,
				centro_destino_id: formData.centroDestinoId,
				peso: pesoNum,
				unidad_medida: formData.unidadMedida,
				total: totalNum,
				operario_id: formData.operarioId,
				foto_albaran: fotoAlbaranUrl
			});

			return true;
		} catch (err) {
			console.error("Error al guardar la carga:", err);
			setError(err instanceof Error ? err.message : "Error al guardar la carga");
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { submitCarga, loading, error, clearError: () => setError(null) };
}
