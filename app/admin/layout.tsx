"use client";

import { SidebarProvider } from "@/components/SidebarProvider";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/components/SidebarProvider";
import { cn } from "@/lib/utils";

function AdminContent({ children }: { children: React.ReactNode }) {
	const { collapsed } = useSidebar();

	return (
		<div className="min-h-screen bg-background">
			<Sidebar />
			<main className={cn("px-4 py-6 sm:px-6 sm:py-8 lg:px-8 md:pt-6 transition-all duration-300", collapsed ? "md:ml-16" : "md:ml-64")}>{children}</main>
		</div>
	);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AdminContent>{children}</AdminContent>
		</SidebarProvider>
	);
}
