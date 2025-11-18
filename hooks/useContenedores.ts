import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createContenedoresService } from "@/lib/services/contenedores.service";
import type { Database } from "@/types/database";

type Contenedor = Database["public"]["Tables"]["contenedores"]["Row"];
type ContenedorInsert = Database["public"]["Tables"]["contenedores"]["Insert"];
type ContenedorUpdate = Database["public"]["Tables"]["contenedores"]["Update"];

interface UseContenedoresOptions {
	autoLoad?: boolean;
}

export function useContenedores(options: UseContenedoresOptions = { autoLoad: true }) {
	const [contenedores, setContenedores] = useState<Contenedor[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadContenedores = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const contenedoresService = createContenedoresService(supabase);
			const data = await contenedoresService.getAllContenedores();
			setContenedores(data);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	const createContenedor = useCallback(async (contenedor: ContenedorInsert) => {
		try {
			const supabase = createClient();
			const contenedoresService = createContenedoresService(supabase);
			const newContenedor = await contenedoresService.createContenedor(contenedor);
			setContenedores((prev) => [...prev, newContenedor]);
			return newContenedor;
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const updateContenedor = useCallback(async (contenedorId: string, updates: ContenedorUpdate) => {
		try {
			const supabase = createClient();
			const contenedoresService = createContenedoresService(supabase);
			const updatedContenedor = await contenedoresService.updateContenedor(contenedorId, updates);
			setContenedores((prev) => prev.map((c) => (c.id === contenedorId ? updatedContenedor : c)));
			return updatedContenedor;
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const deleteContenedor = useCallback(async (contenedorId: string) => {
		try {
			const supabase = createClient();
			const contenedoresService = createContenedoresService(supabase);
			await contenedoresService.deleteContenedor(contenedorId);
			setContenedores((prev) => prev.filter((c) => c.id !== contenedorId));
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	useEffect(() => {
		if (options.autoLoad) {
			loadContenedores();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadContenedores]);

	return {
		contenedores,
		loading,
		error,
		loadContenedores,
		createContenedor,
		updateContenedor,
		deleteContenedor,
	};
}
