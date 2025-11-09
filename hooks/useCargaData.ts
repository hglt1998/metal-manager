import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { CargaService } from "@/lib/services/carga.service";
import type { Database } from "@/types/database";

type Material = Database["public"]["Tables"]["materiales"]["Row"];
type UbicacionRecogida = Database["public"]["Tables"]["ubicaciones_recogida"]["Row"];
type UbicacionDestino = Database["public"]["Tables"]["ubicaciones_destino"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface CargaData {
	materiales: Material[];
	ubicacionesRecogida: UbicacionRecogida[];
	ubicacionesDestino: UbicacionDestino[];
	operarios: Profile[];
}

export function useCargaData(isOpen: boolean, isAdmin: boolean) {
	const [data, setData] = useState<CargaData>({
		materiales: [],
		ubicacionesRecogida: [],
		ubicacionesDestino: [],
		operarios: []
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadData = useCallback(async () => {
		if (!isOpen) return;

		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const service = new CargaService(supabase);

			const [materiales, ubicacionesRecogida, ubicacionesDestino, operarios] = await Promise.all([
				service.getMateriales(),
				service.getUbicacionesRecogida(),
				service.getUbicacionesDestino(),
				isAdmin ? service.getOperarios() : Promise.resolve([])
			]);

			setData({
				materiales,
				ubicacionesRecogida,
				ubicacionesDestino,
				operarios
			});
		} catch (err) {
			console.error("Error cargando datos:", err);
			setError("Error al cargar los datos del formulario");
		} finally {
			setLoading(false);
		}
	}, [isOpen, isAdmin]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return { ...data, loading, error, reload: loadData };
}
