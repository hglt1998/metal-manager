import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createVehiculosService } from "@/lib/services/vehiculos.service";
import type { Database } from "@/types/database";

type Vehiculo = Database["public"]["Tables"]["vehiculos"]["Row"];
type VehiculoInsert = Database["public"]["Tables"]["vehiculos"]["Insert"];
type VehiculoUpdate = Database["public"]["Tables"]["vehiculos"]["Update"];

interface UseVehiculosOptions {
	autoLoad?: boolean;
}

export function useVehiculos(options: UseVehiculosOptions = { autoLoad: true }) {
	const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadVehiculos = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const vehiculosService = createVehiculosService(supabase);
			const data = await vehiculosService.getAllVehiculos();
			setVehiculos(data);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	const createVehiculo = useCallback(async (vehiculo: VehiculoInsert) => {
		try {
			const supabase = createClient();
			const vehiculosService = createVehiculosService(supabase);
			const newVehiculo = await vehiculosService.createVehiculo(vehiculo);
			setVehiculos((prev) => [...prev, newVehiculo]);
			return newVehiculo;
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const updateVehiculo = useCallback(async (vehiculoId: string, updates: VehiculoUpdate) => {
		try {
			const supabase = createClient();
			const vehiculosService = createVehiculosService(supabase);
			const updatedVehiculo = await vehiculosService.updateVehiculo(vehiculoId, updates);
			setVehiculos((prev) => prev.map((v) => (v.id === vehiculoId ? updatedVehiculo : v)));
			return updatedVehiculo;
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const deleteVehiculo = useCallback(async (vehiculoId: string) => {
		try {
			const supabase = createClient();
			const vehiculosService = createVehiculosService(supabase);
			await vehiculosService.deleteVehiculo(vehiculoId);
			setVehiculos((prev) => prev.filter((v) => v.id !== vehiculoId));
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	useEffect(() => {
		if (options.autoLoad) {
			loadVehiculos();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadVehiculos]);

	return {
		vehiculos,
		loading,
		error,
		loadVehiculos,
		createVehiculo,
		updateVehiculo,
		deleteVehiculo,
	};
}
