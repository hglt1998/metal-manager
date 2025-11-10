import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UserCardListProps {
	users: Profile[];
	onEditUser: (user: Profile) => void;
}

export function UserCardList({ users, onEditUser }: UserCardListProps) {
	const getRoleBadgeVariant = (role: Profile["role"]) => {
		return role === "admin" ? "default" : "secondary";
	};

	const getRoleLabel = (role: Profile["role"]) => {
		switch (role) {
			case "admin":
				return "Admin";
			case "planificador_rutas":
				return "Planificador";
			default:
				return "Operario";
		}
	};

	return (
		<div className="space-y-4">
			{users.map((user) => (
				<Card key={user.id} className="border-border/40">
					<CardContent className="p-4 space-y-3">
						<div className="flex items-start justify-between">
							<div className="space-y-1 flex-1">
								<p className="font-medium text-sm">{user.full_name || "-"}</p>
								<p className="text-xs text-muted-foreground break-all">{user.email}</p>
							</div>
							<Badge variant={getRoleBadgeVariant(user.role)} className="font-medium ml-2 shrink-0">
								{getRoleLabel(user.role)}
							</Badge>
						</div>

						<div className="flex items-center justify-between pt-2 border-t border-border/40">
							<span className="text-xs text-muted-foreground">{new Date(user.created_at).toLocaleDateString("es-ES")}</span>
							<Button variant="ghost" size="sm" onClick={() => onEditUser(user)} className="h-8 gap-2">
								<Pencil className="h-3.5 w-3.5" />
								Editar
							</Button>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
