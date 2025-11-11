"use client";

import { useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { CentrosTable } from "@/components/centros/CentrosTable";
import { CentroFormDialog } from "@/components/centros/CentroFormDialog";
import { Building2 } from "lucide-react";

export default function CentrosPage() {
	const { profile } = useAuth();
	const tableRefreshRef = useRef<(() => void) | null>(null);

	// Solo admins y planificadores pueden acceder
	if (!profile || !['admin', 'planificador_rutas'].includes(profile.role)) {
		return <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>;
	}

	const handleCentroCreated = () => {
		if (tableRefreshRef.current) {
			tableRefreshRef.current();
		}
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
				<CentroFormDialog onSuccess={handleCentroCreated} />
			</div>

			<CentrosTable onRefreshReady={(refreshFn) => { tableRefreshRef.current = refreshFn; }} />
		</>
	);
}
