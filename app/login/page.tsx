"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { signIn } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signIn(email, password);
			router.push("/dashboard");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setError(err.message || "Error al iniciar sesión");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md border-border/40 shadow-lg">
				<CardHeader className="space-y-2 text-center pb-6">
					<div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
						<LogIn className="h-7 w-7 text-primary" />
					</div>
					<CardTitle className="text-3xl font-bold tracking-tight">Bienvenido</CardTitle>
					<CardDescription className="text-base">Ingresa tus credenciales para continuar</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-5">
						{error && <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium">
								Email
							</Label>
							<Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="h-11" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium">
								Contraseña
							</Label>
							<Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11" />
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4 pt-2">
						<Button type="submit" className="w-full h-11 font-medium bg-neutral-900 text-white" disabled={loading}>
							{loading ? "Iniciando sesión..." : "Iniciar Sesión"}
						</Button>
						{/* <p className="text-center text-sm text-muted-foreground">
							¿No tienes cuenta?{" "}
							<Link
								href="/register"
								className="font-medium text-primary hover:underline underline-offset-4"
							>
								Regístrate aquí
							</Link>
						</p> */}
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
