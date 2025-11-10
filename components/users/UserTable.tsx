import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UserTableProps {
	users: Profile[];
	onEditUser: (user: Profile) => void;
}

export function UserTable({ users, onEditUser }: UserTableProps) {
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
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent border-border/40">
						<TableHead className="font-semibold">Nombre</TableHead>
						<TableHead className="font-semibold">Email</TableHead>
						<TableHead className="font-semibold">Rol</TableHead>
						<TableHead className="font-semibold">Fecha de Registro</TableHead>
						<TableHead className="font-semibold">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id} className="border-border/40">
							<TableCell className="font-medium">{user.full_name || "-"}</TableCell>
							<TableCell className="text-muted-foreground">{user.email}</TableCell>
							<TableCell>
								<Badge variant={getRoleBadgeVariant(user.role)} className="font-medium">
									{getRoleLabel(user.role)}
								</Badge>
							</TableCell>
							<TableCell className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString("es-ES")}</TableCell>
							<TableCell>
								<Button variant="ghost" size="sm" onClick={() => onEditUser(user)} className="h-8 gap-2">
									<Pencil className="h-3.5 w-3.5" />
									Editar
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
