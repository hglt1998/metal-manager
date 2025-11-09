"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { signUp } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signUp(email, password, fullName);
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.message || "Error al registrarse");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md border-border/40 shadow-lg">
				<CardHeader className="space-y-2 text-center pb-6">
					<div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
						<UserPlus className="h-7 w-7 text-primary" />
					</div>
					<CardTitle className="text-3xl font-bold tracking-tight">Crear Cuenta</CardTitle>
					<CardDescription className="text-base">
						Únete a Collector Manager
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-5">
						{error && (
							<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
								{error}
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="fullName" className="text-sm font-medium">Nombre Completo</Label>
							<Input
								id="fullName"
								type="text"
								required
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								placeholder="Juan Pérez"
								className="h-11"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium">Email</Label>
							<Input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="tu@email.com"
								className="h-11"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
							<Input
								id="password"
								type="password"
								required
								minLength={6}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground">
								Mínimo 6 caracteres
							</p>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4 pt-2">
						<Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
							{loading ? "Registrando..." : "Crear Cuenta"}
						</Button>
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-border/40" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">o</span>
							</div>
						</div>
						<p className="text-center text-sm text-muted-foreground">
							¿Ya tienes cuenta?{" "}
							<Link
								href="/login"
								className="font-medium text-primary hover:underline underline-offset-4"
							>
								Inicia sesión aquí
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
