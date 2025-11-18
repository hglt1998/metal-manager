"use client";

import { useAuth } from "@/components/AuthProvider";
import { Truck } from "lucide-react";
import { VehiculosSection } from "@/components/fleet/vehiculos/VehiculosSection";
import { RemolquesSection } from "@/components/fleet/remolques/RemolquesSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVehiculos } from "@/hooks/useVehiculos";
import { useRemolques } from "@/hooks/useRemolques";
import { useContenedores } from "@/hooks/useContenedores";
import { ContenedoresSection } from "@/components/fleet/contenedores/ContenedoresSection";

export default function VehiculosPage() {
	const { profile } = useAuth();

	const vehiculosData = useVehiculos({ autoLoad: true });
	const remolquesData = useRemolques({ autoLoad: true });
	const contenedoresData = useContenedores({ autoLoad: true });

	if (!profile || !["admin", "planificador_rutas"].includes(profile.role)) {
		return <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>;
	}

	return (
		<>
			<div className="mb-6">
				<div className="flex items-center gap-2">
					<Truck className="h-7 w-7 sm:h-8 sm:w-8 text-primary shrink-0" />
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Flota</h1>
				</div>
				<p className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg text-muted-foreground">Gestiona vehículos, remolques y contenedores de la empresa</p>
			</div>

			<Tabs defaultValue="vehiculos" className="w-full">
				<TabsList className="grid w-full sm:w-auto sm:inline-flex grid-cols-3 mb-6 h-auto p-1">
					<TabsTrigger value="vehiculos" className="px-4 py-2">
						Vehículos
					</TabsTrigger>
					<TabsTrigger value="remolques" className="px-4 py-2">
						Remolques
					</TabsTrigger>
					<TabsTrigger value="contenedores" className="px-4 py-2">
						Contenedores
					</TabsTrigger>
				</TabsList>
				<TabsContent value="vehiculos">
					<VehiculosSection {...vehiculosData} />
				</TabsContent>
				<TabsContent value="remolques">
					<RemolquesSection {...remolquesData} />
				</TabsContent>
				<TabsContent value="contenedores">
					<ContenedoresSection {...contenedoresData} />
				</TabsContent>
			</Tabs>
		</>
	);
}
