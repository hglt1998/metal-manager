import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Shield, Zap } from "lucide-react";

const Hero = () => {
	return (
		<div className="relative isolate px-6 pt-14 lg:px-8">
			<div className="mx-auto max-w-4xl py-20 sm:py-32 lg:py-40">
				<div className="text-center">
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/50 px-4 py-2 text-sm">
						<Zap className="h-4 w-4 text-primary" />
						<span className="text-muted-foreground">Acelera los procesos de recogida</span>
					</div>

					<h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Collector Manager</h1>

					<p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">Gestiona eficientemente los procesos de recogida de residuos</p>

					<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button asChild size="lg" className="gap-2 text-base h-12 px-8">
							<Link href="/login">
								Iniciar sesión
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="gap-2 text-base h-12 px-8">
							<Link href="/register">Crear cuenta</Link>
						</Button>
					</div>

					<div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
						<div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border/40 bg-card">
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Package className="h-6 w-6 text-primary" />
							</div>
							<h3 className="font-semibold">Gestión Completa</h3>
							<p className="text-sm text-muted-foreground text-center">Administra todas tus colecciones desde un solo lugar</p>
						</div>

						<div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border/40 bg-card">
							<div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
								<Zap className="h-6 w-6 text-green-600 dark:text-green-500" />
							</div>
							<h3 className="font-semibold">Rápido y Eficiente</h3>
							<p className="text-sm text-muted-foreground text-center">Optimiza tus procesos de trabajo diarios</p>
						</div>

						<div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border/40 bg-card">
							<div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
								<Shield className="h-6 w-6 text-purple-600 dark:text-purple-500" />
							</div>
							<h3 className="font-semibold">Seguro y Confiable</h3>
							<p className="text-sm text-muted-foreground text-center">Tus datos protegidos con la mejor seguridad</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Hero;
