"use client";

import { useAuth } from "@/components/AuthProvider";
import { Truck } from "lucide-react";

export default function VehiculosPage() {
	const { profile } = useAuth();

	// Solo admins y planificadores pueden acceder
	if (!profile || !['admin', 'planificador_rutas'].includes(profile.role)) {
		return <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>;
	}

	return (
		<div className="mb-8 sm:mb-10">
			<div className="flex items-center gap-2">
				<Truck className="h-8 w-8 text-primary" />
				<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Vehículos</h1>
			</div>
			<p className="mt-2 text-base sm:text-lg text-muted-foreground">
				Gestiona la flota de vehículos de la empresa (en desarrollo)
			</p>
		</div>
	);
}
