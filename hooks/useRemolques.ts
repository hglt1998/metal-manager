import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createRemolquesService } from "@/lib/services/remolques.service";
import type { Database } from "@/types/database";

type Remolque = Database["public"]["Tables"]["remolques"]["Row"];
type RemolqueInsert = Database["public"]["Tables"]["remolques"]["Insert"];
type RemolqueUpdate = Database["public"]["Tables"]["remolques"]["Update"];

interface UseRemolquesOptions {
	autoLoad?: boolean;
}

export function useRemolques(options: UseRemolquesOptions = { autoLoad: true }) {
	const [remolques, setRemolques] = useState<Remolque[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadRemolques = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const remolquesService = createRemolquesService(supabase);
			const data = await remolquesService.getAllRemolques();
			setRemolques(data);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	const createRemolque = useCallback(async (remolque: RemolqueInsert) => {
		try {
			const supabase = createClient();
			const remolquesService = createRemolquesService(supabase);
			const newRemolque = await remolquesService.createRemolque(remolque);
			setRemolques((prev) => [...prev, newRemolque]);
			return newRemolque;
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const updateRemolque = useCallback(async (remolqueId: string, updates: RemolqueUpdate) => {
		try {
			const supabase = createClient();
			const remolquesService = createRemolquesService(supabase);
			const updatedRemolque = await remolquesService.updateRemolque(remolqueId, updates);
			setRemolques((prev) => prev.map((r) => (r.id === remolqueId ? updatedRemolque : r)));
			return updatedRemolque;
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const deleteRemolque = useCallback(async (remolqueId: string) => {
		try {
			const supabase = createClient();
			const remolquesService = createRemolquesService(supabase);
			await remolquesService.deleteRemolque(remolqueId);
			setRemolques((prev) => prev.filter((r) => r.id !== remolqueId));
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	useEffect(() => {
		if (options.autoLoad) {
			loadRemolques();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadRemolques]);

	return {
		remolques,
		loading,
		error,
		loadRemolques,
		createRemolque,
		updateRemolque,
		deleteRemolque,
	};
}
