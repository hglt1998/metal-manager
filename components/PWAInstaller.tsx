"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

/**
 * Componente para registrar el service worker y mostrar el prompt de instalación de PWA
 */
export function PWAInstaller() {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [showInstallPrompt, setShowInstallPrompt] = useState(false);

	useEffect(() => {
		// Registrar service worker
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/sw.js")
				.then((registration) => {
					console.log("Service Worker registrado:", registration.scope);

					// Verificar actualizaciones cada hora
					setInterval(() => {
						registration.update();
					}, 60 * 60 * 1000);
				})
				.catch((error) => {
					console.error("Error al registrar Service Worker:", error);
				});
		}

		// Capturar el evento beforeinstallprompt
		const handleBeforeInstallPrompt = (e: any) => {
			// Prevenir el prompt automático
			e.preventDefault();
			// Guardar el evento para usarlo después
			setDeferredPrompt(e);
			// Mostrar nuestro botón de instalación personalizado
			setShowInstallPrompt(true);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		// Detectar si la app ya está instalada
		if (window.matchMedia("(display-mode: standalone)").matches) {
			setShowInstallPrompt(false);
		}

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		};
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		// Mostrar el prompt de instalación
		deferredPrompt.prompt();

		// Esperar a que el usuario responda
		const { outcome } = await deferredPrompt.userChoice;
		console.log(`Usuario ${outcome === "accepted" ? "aceptó" : "rechazó"} la instalación`);

		// Limpiar el prompt
		setDeferredPrompt(null);
		setShowInstallPrompt(false);
	};

	if (!showInstallPrompt) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50 max-w-sm">
			<div className="bg-card border border-border/40 rounded-lg shadow-lg p-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1">
						<h3 className="font-semibold text-sm mb-1">Instalar Collector Manager</h3>
						<p className="text-xs text-muted-foreground mb-3">
							Instala la app para acceder más rápido y usarla sin conexión
						</p>
						<div className="flex gap-2">
							<Button onClick={handleInstallClick} size="sm" className="gap-2">
								<Download className="h-4 w-4" />
								Instalar
							</Button>
							<Button
								onClick={() => setShowInstallPrompt(false)}
								variant="outline"
								size="sm"
							>
								Ahora no
							</Button>
						</div>
					</div>
					<Button
						onClick={() => setShowInstallPrompt(false)}
						variant="ghost"
						size="icon"
						className="h-8 w-8"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
