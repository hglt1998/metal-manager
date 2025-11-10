"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { MaterialesTable } from "@/components/materiales/MaterialesTable";
import { MaterialFormDialog } from "@/components/materiales/MaterialFormDialog";
import { Package2 } from "lucide-react";

export default function MaterialesPage() {
	const { profile } = useAuth();
	const tableRefreshRef = useRef<(() => void) | null>(null);

	// Solo admins y planificadores pueden acceder
	if (!profile || !['admin', 'planificador_rutas'].includes(profile.role)) {
		return <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>;
	}

	const handleMaterialCreated = () => {
		if (tableRefreshRef.current) {
			tableRefreshRef.current();
		}
	};

	return (
		<>
			<div className="mb-8 sm:mb-10 flex items-start justify-between">
				<div>
					<div className="flex items-center gap-2">
						<Package2 className="h-8 w-8 text-primary" />
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Materiales</h1>
					</div>
					<p className="mt-2 text-base sm:text-lg text-muted-foreground">
						Gestiona los tipos de materiales a recoger
					</p>
				</div>
				<MaterialFormDialog onSuccess={handleMaterialCreated} />
			</div>

			<MaterialesTable onRefreshReady={(refreshFn) => { tableRefreshRef.current = refreshFn; }} />
		</>
	);
}
