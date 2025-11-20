"use client";

import { useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { MaterialesTable } from "@/components/materiales/MaterialesTable";
import { MaterialFormDialog } from "@/components/materiales/MaterialFormDialog";
import { Package2 } from "lucide-react";

export default function MaterialesPage() {
	const { profile } = useAuth();
	const tableRefreshRef = useRef<(() => void) | null>(null);

	// Solo admins y planificadores pueden acceder
	if (!profile || !profile.role || !["admin", "planificador_rutas"].includes(profile.role)) {
		return <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>;
	}

	const handleMaterialCreated = () => {
		if (tableRefreshRef.current) {
			tableRefreshRef.current();
		}
	};

	return (
		<>
			<div className="mb-6 flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<Package2 className="h-7 w-7 sm:h-8 sm:w-8 text-primary shrink-0" />
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Materiales</h1>
					</div>
					<p className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg text-muted-foreground">Gestiona los tipos de materiales a recoger</p>
				</div>
				<MaterialFormDialog onSuccess={handleMaterialCreated} />
			</div>

			<MaterialesTable
				onRefreshReady={(refreshFn) => {
					tableRefreshRef.current = refreshFn;
				}}
			/>
		</>
	);
}
