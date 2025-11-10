"use client";

import { useAuth } from "@/components/AuthProvider";
import { Route } from "lucide-react";

export default function RutasPage() {
	const { profile } = useAuth();

	// Planificadores y admins pueden crear, operarios solo ver sus rutas
	const canManageRutas = profile && ["admin", "planificador_rutas"].includes(profile.role);

	return (
		<div className="mb-8 sm:mb-10">
			<div className="flex items-center gap-2">
				<Route className="h-8 w-8 text-primary" />
				<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Rutas</h1>
			</div>
			<p className="mt-2 text-base sm:text-lg text-muted-foreground">
				{canManageRutas ? "Planifica y gestiona las rutas de recogida (en desarrollo)" : "Consulta tus rutas asignadas (en desarrollo)"}
			</p>
		</div>
	);
}
