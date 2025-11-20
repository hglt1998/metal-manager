import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createClientesService, type ClienteWithCentros } from "@/lib/services/clientes.service";
import type { Database } from "@/types/database";

type Cliente = Database["public"]["Tables"]["clientes"]["Row"];
type ClienteInsert = Database["public"]["Tables"]["clientes"]["Insert"];
type ClienteUpdate = Database["public"]["Tables"]["clientes"]["Update"];

interface UseClientesOptions {
	autoLoad?: boolean;
}

export function useClientes(options: UseClientesOptions = { autoLoad: true }) {
	const [clientes, setClientes] = useState<ClienteWithCentros[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadClientes = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const clientesService = createClientesService(supabase);
			const data = await clientesService.getAllClientes();
			setClientes(data);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	const createCliente = useCallback(async (cliente: ClienteInsert, centroIds: string[] = []) => {
		try {
			const supabase = createClient();
			const clientesService = createClientesService(supabase);
			const newCliente = await clientesService.createCliente(cliente, centroIds);
			setClientes((prev) => [...prev, newCliente]);
			return newCliente;
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const updateCliente = useCallback(
		async (clienteId: string, updates: ClienteUpdate, centroIds?: string[]) => {
			try {
				const supabase = createClient();
				const clientesService = createClientesService(supabase);
				const updatedCliente = await clientesService.updateCliente(clienteId, updates, centroIds);
				setClientes((prev) => prev.map((c) => (c.id === clienteId ? updatedCliente : c)));
				return updatedCliente;
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[]
	);

	const deleteCliente = useCallback(async (clienteId: string) => {
		try {
			const supabase = createClient();
			const clientesService = createClientesService(supabase);
			await clientesService.deleteCliente(clienteId);
			setClientes((prev) => prev.filter((c) => c.id !== clienteId));
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	useEffect(() => {
		if (options.autoLoad) {
			loadClientes();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadClientes]);

	return {
		clientes,
		loading,
		error,
		loadClientes,
		createCliente,
		updateCliente,
		deleteCliente,
	};
}
