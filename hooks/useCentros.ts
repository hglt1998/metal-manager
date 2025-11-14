import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createCentrosService } from "@/lib/services/centros.service";
import type { Database } from "@/types/database";

type Centro = Database["public"]["Tables"]["centros"]["Row"];
type CentroInsert = Database["public"]["Tables"]["centros"]["Insert"];
type CentroUpdate = Database["public"]["Tables"]["centros"]["Update"];

interface UseCentrosOptions {
	autoLoad?: boolean;
}

export function useCentros(options: UseCentrosOptions = { autoLoad: true }) {
	const [centros, setCentros] = useState<Centro[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadCentros = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const centrosService = createCentrosService(supabase);
			const data = await centrosService.getAllCentros();
			setCentros(data);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	const createCentro = useCallback(async (centro: CentroInsert) => {
		setLoading(true);
		try {
			const supabase = createClient();
			const centrosService = createCentrosService(supabase);
			const newCentro = await centrosService.createCentro(centro);
			// Recargar la lista
			const data = await centrosService.getAllCentros();
			setCentros(data);
			return newCentro;
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateCentro = useCallback(async (centroId: string, updates: CentroUpdate) => {
		setLoading(true);
		try {
			const supabase = createClient();
			const centrosService = createCentrosService(supabase);
			const updatedCentro = await centrosService.updateCentro(centroId, updates);
			// Recargar la lista
			const data = await centrosService.getAllCentros();
			setCentros(data);
			return updatedCentro;
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteCentro = useCallback(async (centroId: string) => {
		setLoading(true);
		try {
			const supabase = createClient();
			const centrosService = createCentrosService(supabase);
			await centrosService.deleteCentro(centroId);
			// Recargar la lista
			const data = await centrosService.getAllCentros();
			setCentros(data);
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (options.autoLoad) {
			loadCentros();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadCentros]);

	return {
		centros,
		loading,
		error,
		loadCentros,
		createCentro,
		updateCentro,
		deleteCentro,
	};
}
