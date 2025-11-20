"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { CentrosTable } from "@/components/centros/CentrosTable";
import { CentroFormDialog } from "@/components/centros/CentroFormDialog";
import { Building2 } from "lucide-react";

export default function CentrosPage() {
	const { profile } = useAuth();
	const [refreshKey, setRefreshKey] = useState(0);

	// Solo admins y planificadores pueden acceder
	if (!profile || !profile.role || !["admin", "planificador_rutas"].includes(profile.role)) {
		return <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>;
	}

	const handleRefresh = () => {
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<>
			<div className="mb-6 flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-primary shrink-0" />
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Centros</h1>
					</div>
					<p className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg text-muted-foreground">Gestiona los centros de reciclaje y recogida</p>
				</div>
				<CentroFormDialog onSuccess={handleRefresh} />
			</div>

			<CentrosTable key={refreshKey} />
		</>
	);
}
