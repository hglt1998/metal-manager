"use client";

import { useAuth } from "@/components/AuthProvider";
import { Route } from "lucide-react";

export default function RutasPage() {
	const { profile } = useAuth();

	// Planificadores y admins pueden crear, operarios solo ver sus rutas
	const canManageRutas = profile && profile.role && ["admin", "planificador_rutas"].includes(profile.role);

	return (
		<div className="mb-6">
			<div className="flex items-center gap-2">
				<Route className="h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Rutas</h1>
			</div>
			<p className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg text-muted-foreground">
				{canManageRutas ? "Planifica y gestiona las rutas de recogida (en desarrollo)" : "Consulta tus rutas asignadas (en desarrollo)"}
			</p>
		</div>
	);
}
