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
		<div className="mb-6">
			<div className="flex items-center gap-2">
				<Truck className="h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Vehículos</h1>
			</div>
			<p className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg text-muted-foreground">
				Gestiona la flota de vehículos de la empresa (en desarrollo)
			</p>
		</div>
	);
}
