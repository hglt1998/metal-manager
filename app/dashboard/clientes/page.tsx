"use client";

import { useAuth } from "@/components/AuthProvider";
import { Users } from "lucide-react";
import { ClientesSection } from "@/components/clientes/ClientesSection";
import { useClientes } from "@/hooks/useClientes";

export default function ClientesPage() {
	const { profile } = useAuth();
	const clientesData = useClientes({ autoLoad: true });

	// Solo admins y planificadores pueden acceder
	if (!profile || !profile.role || !["admin", "planificador_rutas"].includes(profile.role)) {
		return <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>;
	}

	return (
		<>
			<div className="mb-6">
				<div className="flex items-center gap-2 mb-2">
					<Users className="h-6 w-6" />
					<h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
				</div>
				<p className="text-muted-foreground">
					Gestiona los clientes de la empresa y sus centros asociados
				</p>
			</div>

			<ClientesSection {...clientesData} />
		</>
	);
}
