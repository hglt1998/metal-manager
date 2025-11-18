import { useState, useEffect } from "react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type UserRole = Profile["role"];

interface UseUserEditOptions {
	user: Profile | null;
	isAdmin: boolean;
	currentUserId: string;
}

interface FormData {
	fullName: string;
	role: UserRole;
}

export function useUserEdit({ user, isAdmin, currentUserId }: UseUserEditOptions) {
	// Estado del formulario - simple y directo
	const [formData, setFormData] = useState<FormData>({
		fullName: user?.full_name || "",
		role: user?.role || "operario",
	});
	const [saving, setSaving] = useState(false);

	// Sincronizar el estado cuando cambia el usuario
	useEffect(() => {
		if (user) {
			setFormData({
				fullName: user.full_name || "",
				role: user.role || "operario",
			});
		}
	}, [user]);

	// Permisos - calculados, no almacenados
	const canEditRole = isAdmin && user?.id !== currentUserId;
	const canEdit = isAdmin || user?.id === currentUserId;

	// Handlers - simples y claros
	const handleFullNameChange = (value: string) => {
		setFormData(prev => ({ ...prev, fullName: value }));
	};

	const handleRoleChange = (value: UserRole) => {
		setFormData(prev => ({ ...prev, role: value }));
	};

	// Construir actualizaciones solo cuando se necesitan
	const buildUpdates = (): Partial<Profile> => {
		const updates: Partial<Profile> = {
			full_name: formData.fullName,
		};

		// Solo incluir rol si el usuario puede editarlo
		if (canEditRole) {
			updates.role = formData.role;
		}

		return updates;
	};

	// Validación simple
	const validate = (): boolean => {
		return formData.fullName.trim().length > 0;
	};

	return {
		// Datos del formulario
		fullName: formData.fullName,
		email: user?.email || "",
		role: formData.role,
		saving,

		// Handlers
		setFullName: handleFullNameChange,
		setRole: handleRoleChange,
		setSaving,

		// Permisos
		canEditRole,
		canEdit,

		// Utilidades
		getUpdates: buildUpdates,
		isValid: validate,
	};
}
