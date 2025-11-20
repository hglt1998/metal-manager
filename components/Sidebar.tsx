"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, LayoutDashboard, Shield, Menu, Package, Truck, Package2, Route, ChevronLeft, ChevronRight, Building2, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSidebar } from "./SidebarProvider";

export default function Sidebar() {
	const { user, profile, signOut, isAdmin, loading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const { collapsed, setCollapsed } = useSidebar();
	const [mobileOpen, setMobileOpen] = useState(false);

	const canManageData = profile && profile.role && ["admin", "planificador_rutas"].includes(profile.role);

	const handleSignOut = async () => {
		try {
			await signOut();
			setMobileOpen(false);
			router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Error al cerrar sesión:", error);
		}
	};

	const navigationItems = [
		{
			href: "/dashboard",
			icon: LayoutDashboard,
			label: "Dashboard",
			show: true
		},
		{
			href: "/dashboard/rutas",
			icon: Route,
			label: "Rutas",
			show: true
		},
		{
			href: "/dashboard/clientes",
			icon: Users,
			label: "Clientes",
			show: canManageData
		},
		{
			href: "/dashboard/vehiculos",
			icon: Truck,
			label: "Vehículos",
			show: canManageData
		},
		{
			href: "/dashboard/centros",
			icon: Building2,
			label: "Centros",
			show: canManageData
		},
		{
			href: "/dashboard/materiales",
			icon: Package2,
			label: "Materiales",
			show: canManageData
		},
		{
			href: "/admin",
			icon: Shield,
			label: "Admin",
			show: isAdmin
		}
	];

	// Desktop Sidebar
	const DesktopSidebar = () => (
		<aside className={cn("hidden md:flex fixed left-0 top-0 h-screen bg-background border-r border-gray-500/40 transition-all duration-300 flex-col z-40", collapsed ? "w-16" : "w-64")}>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-gray-500/40">
				{!collapsed && (
					<Link href="/dashboard" className="flex items-center space-x-2">
						<Package className="h-6 w-6" />
						<span className="text-lg font-bold">Collector Manager</span>
					</Link>
				)}
				{collapsed && (
					<Link href="/dashboard" className="flex items-center justify-center w-full">
						<Package className="h-6 w-6" />
					</Link>
				)}
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setCollapsed(!collapsed)}
					className={cn("h-8 w-8", collapsed && "absolute -right-3 top-3 bg-background border border-gray-500/40 rounded-full")}
				>
					{collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
				</Button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto p-3 space-y-1">
				{navigationItems.map((item) => {
					if (!item.show) return null;
					const Icon = item.icon;
					// For /dashboard, only match exact path. For others, match prefix too
					const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname === item.href || pathname?.startsWith(item.href + "/");

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
								isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
								collapsed && "justify-center"
							)}
							title={collapsed ? item.label : undefined}
						>
							<Icon className="h-5 w-5 shrink-0" />
							{!collapsed && <span>{item.label}</span>}
						</Link>
					);
				})}
			</nav>

			{/* User Section */}
			<div className="border-t border-gray-500/40 p-3 space-y-2">
				{!collapsed && (
					<div className="px-3 py-2 rounded-md bg-muted/50">
						{loading || !profile ? (
							<div className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
								<span className="text-sm text-muted-foreground">Cargando...</span>
							</div>
						) : (
							<div className="flex flex-col gap-1">
								<span className="text-sm font-medium truncate">{profile.full_name || user?.email}</span>
								<Badge variant={profile.role === "admin" ? "default" : "secondary"} className="h-5 text-xs w-fit">
									{profile.role === "admin" ? "Admin" : profile.role === "planificador_rutas" ? "Planificador" : "Operario"}
								</Badge>
							</div>
						)}
					</div>
				)}

				<div className={cn("flex gap-2", collapsed && "flex-col")}>
					<ThemeToggle />
					<Button onClick={handleSignOut} variant="ghost" size={collapsed ? "icon" : "sm"} className={cn("gap-2", collapsed ? "w-full" : "flex-1")} title={collapsed ? "Cerrar sesión" : undefined}>
						<LogOut className="h-4 w-4" />
						{!collapsed && <span>Salir</span>}
					</Button>
				</div>
			</div>
		</aside>
	);

	// Mobile Drawer
	const MobileDrawer = () => (
		<div className="md:hidden bg-background border-b border-gray-500/40">
			<div className="flex items-center justify-between p-4">
				<Link href="/dashboard" className="flex items-center space-x-2">
					<Package className="h-6 w-6" />
					<span className="text-lg font-bold">Collector Manager</span>
				</Link>

				<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon">
							<Menu className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent aria-describedby="" side="left" className="w-64 p-0">
						<SheetHeader className="sr-only">
							<SheetTitle>Menú de navegación</SheetTitle>
						</SheetHeader>
						<div className="flex flex-col h-full">
							{/* Header */}
							<div className="flex min-h-17.5 items-center justify-between p-4 border-b border-gray-500/40">
								<Link href="/dashboard" className="flex items-center space-x-2" onClick={() => setMobileOpen(false)}>
									<Package className="h-6 w-6" />
									<span className="text-lg font-bold">Collector Manager</span>
								</Link>
							</div>

							{/* Navigation */}
							<nav className="flex-1 overflow-y-auto p-3 space-y-1">
								{navigationItems.map((item) => {
									if (!item.show) return null;
									const Icon = item.icon;
									// For /dashboard, only match exact path. For others, match prefix too
									const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname === item.href || pathname?.startsWith(item.href + "/");

									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={() => setMobileOpen(false)}
											className={cn(
												"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
												isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
											)}
										>
											<Icon className="h-5 w-5" />
											<span>{item.label}</span>
										</Link>
									);
								})}
							</nav>

							{/* User Section */}
							<div className="border-t border-gray-500/40 p-3 space-y-3">
								<div className="px-3 py-2 rounded-md bg-muted/50">
									{loading || !profile ? (
										<div className="flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
											<span className="text-sm text-muted-foreground">Cargando...</span>
										</div>
									) : (
										<div className="flex flex-col gap-1">
											<span className="text-sm font-medium truncate">{profile.full_name || user?.email}</span>
											<Badge variant={profile.role === "admin" ? "default" : "secondary"} className="h-5 text-xs w-fit">
												{profile.role === "admin" ? "Admin" : profile.role === "planificador_rutas" ? "Planificador" : "Operario"}
											</Badge>
										</div>
									)}
								</div>

								<div className="flex gap-2">
									<ThemeToggle />
									<Button onClick={handleSignOut} variant="ghost" size="sm" className="gap-2 flex-1">
										<LogOut className="h-4 w-4" />
										<span>Salir</span>
									</Button>
								</div>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);

	return (
		<>
			{DesktopSidebar()}
			{MobileDrawer()}
		</>
	);
}
