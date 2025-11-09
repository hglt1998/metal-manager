import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Shield, Zap } from "lucide-react";

const Hero = () => {
	return (
		<div className="relative isolate overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
				<div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary to-primary/30 opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75" />
			</div>

			<div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
				<div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
					{/* Badge */}
					<div className="mb-8 inline-flex items-center gap-x-2 rounded-full border border-border/40 bg-muted/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
						<Zap className="h-4 w-4 text-primary" />
						<span className="text-muted-foreground">Acelera los procesos de recogida</span>
					</div>

					{/* Title */}
					<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Collector Manager</h1>

					{/* Description */}
					<p className="mt-6 text-lg leading-8 text-muted-foreground">
						Gestiona eficientemente los procesos de recogida de residuos. Una solución completa para optimizar tu operación y mantener tus datos seguros.
					</p>

					{/* CTA Buttons */}
					<div className="mt-10 flex items-center gap-x-6">
						<Button asChild size="lg" className="gap-2">
							<Link href="/login">
								Iniciar sesión
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/register">Crear cuenta</Link>
						</Button>
					</div>
				</div>

				{/* Features grid on the right for desktop */}
				<div className="mx-auto mt-16 w-full max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:max-w-lg">
					<div className="w-full">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
							{/* Feature 1 */}
							<div className="relative rounded-xl border border-border/20 bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-border/30">
								<div className="flex items-center gap-x-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
										<Package className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-lg font-semibold leading-7">Gestión Completa</h3>
								</div>
								<p className="mt-4 text-sm leading-6 text-muted-foreground">Administra todas tus colecciones desde un solo lugar con una interfaz intuitiva y fácil de usar.</p>
							</div>

							{/* Feature 2 */}
							<div className="relative rounded-xl border border-border/20 bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-border/30">
								<div className="flex items-center gap-x-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
										<Zap className="h-6 w-6 text-green-600 dark:text-green-500" />
									</div>
									<h3 className="text-lg font-semibold leading-7">Rápido y Eficiente</h3>
								</div>
								<p className="mt-4 text-sm leading-6 text-muted-foreground">Optimiza tus procesos de trabajo diarios y ahorra tiempo valioso en cada operación.</p>
							</div>

							{/* Feature 3 */}
							<div className="relative rounded-xl border border-border/20 bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-border/30">
								<div className="flex items-center gap-x-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
										<Shield className="h-6 w-6 text-purple-600 dark:text-purple-500" />
									</div>
									<h3 className="text-lg font-semibold leading-7">Seguro y Confiable</h3>
								</div>
								<p className="mt-4 text-sm leading-6 text-muted-foreground">Tus datos están protegidos con las mejores prácticas de seguridad. Mantén el control total de tu información.</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom background decoration */}
			<div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
				<div className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-primary to-primary/30 opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75" />
			</div>
		</div>
	);
};
export default Hero;
