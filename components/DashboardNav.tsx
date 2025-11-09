"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, LayoutDashboard, Shield, Menu, X, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DashboardNav() {
	const { user, profile, signOut, isAdmin } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
			setMobileMenuOpen(false);
			router.push("/login");
			router.refresh();
		} catch (error) {
			console.error("Error al cerrar sesión:", error);
		}
	};

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-gray-500/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-opacity">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-6 sm:gap-8">
						<Link href="/dashboard" className="flex items-center space-x-2">
							<Package className="h-6 w-6" />
							<span className="text-lg sm:text-xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">Collector Manager</span>
						</Link>
						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center gap-1">
							<Link
								href="/dashboard"
								className={cn(
									"inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
									pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
								)}
							>
								<LayoutDashboard className="h-4 w-4" />
								Dashboard
							</Link>
							{isAdmin && (
								<Link
									href="/admin"
									className={cn(
										"inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
										pathname === "/admin" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
									)}
								>
									<Shield className="h-4 w-4" />
									Admin
								</Link>
							)}
						</div>
					</div>
					{/* Desktop Actions */}
					<div className="hidden md:flex items-center gap-3">
						<div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-muted/50">
							<div className="flex flex-col items-end">
								<span className="text-sm font-medium truncate max-w-[150px] lg:max-w-none">{profile?.full_name || user?.email}</span>
								<Badge variant={profile?.role === "admin" ? "default" : "secondary"} className="h-5 text-xs bg-stone-200">
									{profile?.role === "admin" ? "Admin" : "Operario"}
								</Badge>
							</div>
						</div>
						<ThemeToggle />
						<Button onClick={handleSignOut} size="sm" className="gap-2 cursor-pointer">
							<LogOut className="h-4 w-4" />
							<span className="hidden lg:inline">Cerrar sesión</span>
						</Button>
					</div>
					{/* Mobile menu button */}
					<div className="flex md:hidden items-center">
						<Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
							{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{mobileMenuOpen && (
				<div className="md:hidden bg-slate-300 rounded-b-lg backdrop-blur">
					<div className="space-y-1 px-4 pb-3 pt-2">
						<Link
							href="/dashboard"
							onClick={() => setMobileMenuOpen(false)}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
								pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
							)}
						>
							<LayoutDashboard className="h-4 w-4" />
							Dashboard
						</Link>
						{isAdmin && (
							<Link
								href="/admin"
								onClick={() => setMobileMenuOpen(false)}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ",
									pathname === "/admin" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
								)}
							>
								<Shield className="h-4 w-4" />
								Admin
							</Link>
						)}
					</div>
					<div className="border-t border-border/40 px-4 py-3 space-y-3">
						<div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/50">
							<div className="flex flex-col flex-1">
								<span className="text-sm font-medium truncate">{profile?.full_name || user?.email}</span>
								<Badge variant={profile?.role === "admin" ? "default" : "secondary"} className="h-5 text-xs w-fit mt-1">
									{profile?.role === "admin" ? "Admin" : "Operario"}
								</Badge>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<ThemeToggle />
							<Button onClick={handleSignOut} variant="ghost" size="sm" className="gap-2 flex-1">
								<LogOut className="h-4 w-4" />
								Salir
							</Button>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
