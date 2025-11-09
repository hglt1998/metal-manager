"use client";

import { useAuth } from "@/components/AuthProvider";
import DashboardNav from "@/components/DashboardNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CargaFormDialog } from "@/components/CargaFormDialog";
import { Package, Archive, Activity } from "lucide-react";

export default function DashboardPage() {
	const { profile } = useAuth();

	const widgets: WIdgetCardProps[] = [
		{
			amount: 0,
			color: "primary",
			icon: <Package className="h-5 w-5 text-primary" />,
			measure: "Total de colecciones activas",
			title: "Colecciones"
		},
		{
			amount: 0,
			color: "green",
			icon: <Archive className="h-5 w-5 text-green-600 dark:text-green-500" />,
			measure: "Total de ítems catalogados",
			title: "Ítems"
		},
		{
			amount: 0,
			color: "purple",
			icon: <Activity className="h-5 w-5 text-purple-600 dark:text-purple-500" />,
			measure: "Acciones realizadas hoy",
			title: "Actividad"
		}
	];

	return (
		<div className="min-h-screen bg-background">
			<DashboardNav />
			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
				<div className="mb-8 sm:mb-10 flex items-start justify-between">
					<div>
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
						<p className="mt-2 text-base sm:text-lg text-muted-foreground">Bienvenido de nuevo, {profile?.full_name || profile?.email}</p>
					</div>
					{profile && (
						<CargaFormDialog userRole={profile.role} userId={profile.id} />
					)}
				</div>

				<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{widgets.map((w, i) => (
						<WidgetCard props={w} key={i} />
					))}
				</div>
			</main>
		</div>
	);
}

type WIdgetCardProps = {
	title: string;
	amount: number;
	icon: React.ReactNode;
	measure: string;
	color: string;
};

const WidgetCard = ({ props }: { props: WIdgetCardProps }) => {
	return (
		<Card className="sm:col-span-2 lg:col-span-1 border-border/40 shadow-sm hover:shadow-md transition-shadow">
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium text-muted-foreground">{props.title}</CardTitle>
				<div className={`h-10 w-10 rounded-lg bg-${props.color}-500/10 flex items-center justify-center`}>{props.icon}</div>
			</CardHeader>
			<CardContent>
				<div className={`text-3xl sm:text-4xl font-bold text-${props.color}-600 dark:text-${props.color}-500`}>{props.amount}</div>
				<p className="mt-1 text-xs text-muted-foreground">{props.measure}</p>
			</CardContent>
		</Card>
	);
};
