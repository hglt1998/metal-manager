import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TipoCentro } from "@/types/database";

type CentroFormData = {
	nombre: string;
	tipo: TipoCentro;
	direccion: string;
	latitud: string;
	longitud: string;
	restriccion_altura_m: string;
	restriccion_anchura_m: string;
	restriccion_peso_kg: string;
	horario_apertura: string;
	horario_cierre: string;
	dias_operacion: string;
	contacto_nombre: string;
	contacto_telefono: string;
	contacto_email: string;
	activo: boolean;
	notas: string;
};

const initialFormData: CentroFormData = {
	nombre: "",
	tipo: "remitente" as TipoCentro,
	direccion: "",
	latitud: "",
	longitud: "",
	restriccion_altura_m: "",
	restriccion_anchura_m: "",
	restriccion_peso_kg: "",
	horario_apertura: "",
	horario_cierre: "",
	dias_operacion: "",
	contacto_nombre: "",
	contacto_telefono: "",
	contacto_email: "",
	activo: true,
	notas: ""
};

/**
 * Transforma los datos del formulario al formato de la base de datos
 */
function transformFormDataToDb(formData: CentroFormData) {
	return {
		nombre: formData.nombre,
		tipo: formData.tipo,
		direccion: formData.direccion,
		latitud: formData.latitud ? parseFloat(formData.latitud) : null,
		longitud: formData.longitud ? parseFloat(formData.longitud) : null,
		restriccion_altura_m: formData.restriccion_altura_m ? parseFloat(formData.restriccion_altura_m) : null,
		restriccion_anchura_m: formData.restriccion_anchura_m ? parseFloat(formData.restriccion_anchura_m) : null,
		restriccion_peso_kg: formData.restriccion_peso_kg ? parseFloat(formData.restriccion_peso_kg) : null,
		horario_apertura: formData.horario_apertura || null,
		horario_cierre: formData.horario_cierre || null,
		dias_operacion: formData.dias_operacion || null,
		contacto_nombre: formData.contacto_nombre || null,
		contacto_telefono: formData.contacto_telefono || null,
		contacto_email: formData.contacto_email || null,
		activo: formData.activo,
		notas: formData.notas || null
	};
}

type UseCentroFormOptions = {
	initialData?: Partial<CentroFormData>;
	onSuccess?: () => void;
};

export function useCentroForm({ initialData, onSuccess }: UseCentroFormOptions = {}) {
	const [formData, setFormData] = useState<CentroFormData>({
		...initialFormData,
		...initialData
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const updateField = useCallback(<K extends keyof CentroFormData>(field: K, value: CentroFormData[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const updateLocation = useCallback((data: { direccion: string; latitud: string; longitud: string }) => {
		setFormData((prev) => ({ ...prev, ...data }));
	}, []);

	const resetForm = useCallback(() => {
		setFormData({ ...initialFormData, ...initialData });
		setError(null);
	}, [initialData]);

	const createCentro = useCallback(async () => {
		setLoading(true);
		setError(null);

		const dbData = transformFormDataToDb(formData);
		const { error: dbError } = await supabase.from("centros").insert([dbData]);

		if (dbError) {
			console.error("Error al crear centro:", dbError);
			setError("No se pudo crear el centro. Por favor, intenta de nuevo.");
			setLoading(false);
			return false;
		}

		setLoading(false);
		resetForm();
		onSuccess?.();
		return true;
	}, [formData, supabase, resetForm, onSuccess]);

	const updateCentro = useCallback(
		async (centroId: string) => {
			setLoading(true);
			setError(null);

			const dbData = transformFormDataToDb(formData);
			const { error: dbError } = await supabase.from("centros").update(dbData).eq("id", centroId);

			if (dbError) {
				console.error("Error al actualizar centro:", dbError);
				setError("No se pudo actualizar el centro. Por favor, intenta de nuevo.");
				setLoading(false);
				return false;
			}

			setLoading(false);
			onSuccess?.();
			return true;
		},
		[formData, supabase, onSuccess]
	);

	return {
		formData,
		loading,
		error,
		updateField,
		updateLocation,
		resetForm,
		createCentro,
		updateCentro
	};
}
