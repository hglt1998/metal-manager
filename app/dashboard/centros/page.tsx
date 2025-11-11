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
	if (!profile || !['admin', 'planificador_rutas'].includes(profile.role)) {
		return <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>;
	}

	const handleRefresh = () => {
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<>
			<div className="mb-8 sm:mb-10 flex items-start justify-between">
				<div>
					<div className="flex items-center gap-2">
						<Building2 className="h-8 w-8 text-primary" />
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Centros</h1>
					</div>
					<p className="mt-2 text-base sm:text-lg text-muted-foreground">
						Gestiona los centros de reciclaje y recogida
					</p>
				</div>
				<CentroFormDialog onSuccess={handleRefresh} />
			</div>

			<CentrosTable key={refreshKey} />
		</>
	);
}
