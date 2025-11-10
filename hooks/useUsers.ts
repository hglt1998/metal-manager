import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createUsersService } from "@/lib/services/users.service";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UseUsersOptions {
	autoLoad?: boolean;
}

export function useUsers(options: UseUsersOptions = { autoLoad: true }) {
	const [users, setUsers] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadUsers = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const usersService = createUsersService(supabase);
			const data = await usersService.getAllUsers();
			setUsers(data);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	const updateUser = useCallback(
		async (userId: string, updates: Partial<Profile>) => {
			setLoading(true);
			try {
				const supabase = createClient();
				const usersService = createUsersService(supabase);
				await usersService.updateUser(userId, updates);
				// Recargar la lista
				const data = await usersService.getAllUsers();
				setUsers(data);
			} catch (err) {
				setError(err as Error);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const updateUserRole = useCallback(async (userId: string, role: Profile["role"]) => {
		try {
			const supabase = createClient();
			const usersService = createUsersService(supabase);
			await usersService.updateUserRole(userId, role);
			// Recargar la lista
			const data = await usersService.getAllUsers();
			setUsers(data);
		} catch (err) {
			throw err;
		}
	}, []);

	useEffect(() => {
		if (options.autoLoad) {
			loadUsers();
		}
	}, [options.autoLoad, loadUsers]);

	return {
		users,
		loading,
		error,
		loadUsers,
		updateUser,
		updateUserRole,
	};
}
