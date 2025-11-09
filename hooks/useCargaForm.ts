import { useState, useReducer, useCallback } from "react";
import type { UnidadMedida } from "@/types/database";

export interface CargaFormData {
	materialId: string;
	centroRecogidaId: string;
	centroDestinoId: string;
	peso: string;
	unidadMedida: UnidadMedida;
	total: string;
	operarioId: string;
	fotoAlbaran: File | null;
}

type FormAction =
	| { type: "SET_FIELD"; field: keyof CargaFormData; value: string | File | null | UnidadMedida }
	| { type: "RESET"; operarioId: string };

const initialFormData = (operarioId: string): CargaFormData => ({
	materialId: "",
	centroRecogidaId: "",
	centroDestinoId: "",
	peso: "",
	unidadMedida: "Kilogramos",
	total: "",
	operarioId,
	fotoAlbaran: null
});

function formReducer(state: CargaFormData, action: FormAction): CargaFormData {
	switch (action.type) {
		case "SET_FIELD":
			return { ...state, [action.field]: action.value };
		case "RESET":
			return initialFormData(action.operarioId);
		default:
			return state;
	}
}

export function useCargaForm(initialOperarioId: string) {
	const [formData, dispatch] = useReducer(formReducer, initialFormData(initialOperarioId));
	const [fotoPreview, setFotoPreview] = useState<string | null>(null);

	const setField = useCallback((field: keyof CargaFormData, value: string | File | null | UnidadMedida) => {
		dispatch({ type: "SET_FIELD", field, value });
	}, []);

	const handleFotoChange = useCallback((file: File | null) => {
		if (!file) {
			setField("fotoAlbaran", null);
			setFotoPreview(null);
			return;
		}

		if (!file.type.startsWith("image/")) {
			throw new Error("Solo se permiten archivos de imagen");
		}

		if (file.size > 5 * 1024 * 1024) {
			throw new Error("La imagen no debe superar los 5MB");
		}

		setField("fotoAlbaran", file);

		const reader = new FileReader();
		reader.onloadend = () => {
			setFotoPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	}, [setField]);

	const removeFoto = useCallback(() => {
		setField("fotoAlbaran", null);
		setFotoPreview(null);
	}, [setField]);

	const resetForm = useCallback(() => {
		dispatch({ type: "RESET", operarioId: initialOperarioId });
		setFotoPreview(null);
	}, [initialOperarioId]);

	const formatCurrency = useCallback((value: string): string => {
		const numericValue = value.replace(/[^0-9.]/g, "");
		if (numericValue === "") return "";
		return `${numericValue}€`;
	}, []);

	const handleTotalChange = useCallback((value: string) => {
		const formatted = formatCurrency(value);
		setField("total", formatted);
	}, [formatCurrency, setField]);

	return {
		formData,
		fotoPreview,
		setField,
		handleFotoChange,
		removeFoto,
		resetForm,
		handleTotalChange
	};
}
