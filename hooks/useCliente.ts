import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createClientesService, type ClienteWithCentros } from "@/lib/services/clientes.service";
import type { Database } from "@/types/database";

type ClienteUpdate = Database["public"]["Tables"]["clientes"]["Update"];

interface UseClienteOptions {
	clienteId: string;
	autoLoad?: boolean;
}

/**
 * Hook para manejar un cliente individual
 * Útil para páginas de detalle y edición
 */
export function useCliente(options: UseClienteOptions) {
	const { clienteId, autoLoad = true } = options;
	const [cliente, setCliente] = useState<ClienteWithCentros | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadCliente = useCallback(async () => {
		if (!clienteId) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const clientesService = createClientesService(supabase);
			const data = await clientesService.getClienteById(clienteId);
			setCliente(data);
		} catch (err) {
			setError(err as Error);
			setCliente(null);
		} finally {
			setLoading(false);
		}
	}, [clienteId]);

	const updateCliente = useCallback(
		async (updates: ClienteUpdate, centroIds?: string[]) => {
			if (!clienteId) {
				throw new Error("No cliente ID provided");
			}

			try {
				const supabase = createClient();
				const clientesService = createClientesService(supabase);
				const updatedCliente = await clientesService.updateCliente(clienteId, updates, centroIds);
				setCliente(updatedCliente);
				return updatedCliente;
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[clienteId]
	);

	const deleteCliente = useCallback(async () => {
		if (!clienteId) {
			throw new Error("No cliente ID provided");
		}

		try {
			const supabase = createClient();
			const clientesService = createClientesService(supabase);
			await clientesService.deleteCliente(clienteId);
			setCliente(null);
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, [clienteId]);

	const refreshCliente = useCallback(() => {
		return loadCliente();
	}, [loadCliente]);

	useEffect(() => {
		if (autoLoad) {
			loadCliente();
		}
	}, [autoLoad, loadCliente]);

	return {
		cliente,
		loading,
		error,
		loadCliente,
		updateCliente,
		deleteCliente,
		refreshCliente,
	};
}
