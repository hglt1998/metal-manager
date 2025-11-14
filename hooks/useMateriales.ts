import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createMaterialesService } from "@/lib/services/materiales.service";
import type { Database } from "@/types/database";

type Material = Database["public"]["Tables"]["materiales"]["Row"];
type MaterialInsert = Database["public"]["Tables"]["materiales"]["Insert"];
type MaterialUpdate = Database["public"]["Tables"]["materiales"]["Update"];

interface UseMaterialesOptions {
	autoLoad?: boolean;
}

export function useMateriales(options: UseMaterialesOptions = { autoLoad: true }) {
	const [materiales, setMateriales] = useState<Material[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadMateriales = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const materialesService = createMaterialesService(supabase);
			const data = await materialesService.getAllMateriales();
			setMateriales(data);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	const createMaterial = useCallback(async (material: MaterialInsert) => {
		setLoading(true);
		try {
			const supabase = createClient();
			const materialesService = createMaterialesService(supabase);
			const newMaterial = await materialesService.createMaterial(material);
			// Recargar la lista
			const data = await materialesService.getAllMateriales();
			setMateriales(data);
			return newMaterial;
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateMaterial = useCallback(async (materialId: string, updates: MaterialUpdate) => {
		setLoading(true);
		try {
			const supabase = createClient();
			const materialesService = createMaterialesService(supabase);
			const updatedMaterial = await materialesService.updateMaterial(materialId, updates);
			// Recargar la lista
			const data = await materialesService.getAllMateriales();
			setMateriales(data);
			return updatedMaterial;
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteMaterial = useCallback(async (materialId: string) => {
		setLoading(true);
		try {
			const supabase = createClient();
			const materialesService = createMaterialesService(supabase);
			await materialesService.deleteMaterial(materialId);
			// Recargar la lista
			const data = await materialesService.getAllMateriales();
			setMateriales(data);
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (options.autoLoad) {
			loadMateriales();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadMateriales]);

	return {
		materiales,
		loading,
		error,
		loadMateriales,
		createMaterial,
		updateMaterial,
		deleteMaterial,
	};
}
