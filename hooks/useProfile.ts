import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createProfileService } from "@/lib/services/profile.service";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UseProfileOptions {
	autoLoad?: boolean;
}

export function useProfile(options: UseProfileOptions = { autoLoad: true }) {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadProfile = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			const profileService = createProfileService(supabase);
			const data = await profileService.getCurrentProfile();
			setProfile(data);
		} catch (err) {
			setError(err as Error);
			setProfile(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const updateProfile = useCallback(async (updates: { full_name?: string | null }) => {
		setLoading(true);
		try {
			const supabase = createClient();
			const profileService = createProfileService(supabase);
			const updatedProfile = await profileService.updateCurrentProfile(updates);
			setProfile(updatedProfile);
			return updatedProfile;
		} catch (err) {
			setError(err as Error);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (options.autoLoad) {
			loadProfile();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadProfile]);

	return {
		profile,
		loading,
		error,
		loadProfile,
		updateProfile,
	};
}
