"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { TipoCliente } from "@/types/database";
import { TIPOS_CLIENTE_OPTIONS } from "@/lib/constants/clientes.constants";
import { getTipoClienteLabel } from "@/lib/utils/clientes.utils";

interface TipoClienteSelectProps {
	value: TipoCliente[];
	onChange: (value: TipoCliente[]) => void;
	disabled?: boolean;
}

export function TipoClienteSelect({ value, onChange, disabled }: TipoClienteSelectProps) {
	const [open, setOpen] = useState(false);

	const toggleTipo = (tipo: TipoCliente) => {
		const newValue = value.includes(tipo)
			? value.filter((t) => t !== tipo)
			: [...value, tipo];
		onChange(newValue);
	};

	const removeTipo = (tipo: TipoCliente, e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(value.filter((t) => t !== tipo));
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between min-h-[2.5rem] h-auto"
					disabled={disabled}
				>
					<div className="flex flex-wrap gap-1">
						{value.length === 0 ? (
							<span className="text-muted-foreground">Seleccionar tipos...</span>
						) : (
							value.map((tipo) => (
								<Badge key={tipo} variant="secondary" className="gap-1">
									{getTipoClienteLabel(tipo)}
									<X
										className="h-3 w-3 cursor-pointer hover:text-destructive"
										onClick={(e) => removeTipo(tipo, e)}
									/>
								</Badge>
							))
						)}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<div className="max-h-64 overflow-auto p-1">
					{TIPOS_CLIENTE_OPTIONS.map((tipo) => (
						<div
							key={tipo.value}
							className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
							onClick={() => toggleTipo(tipo.value)}
						>
							<Checkbox
								checked={value.includes(tipo.value)}
								onCheckedChange={() => toggleTipo(tipo.value)}
								onClick={(e) => e.stopPropagation()}
							/>
							<label className="flex-1 text-sm cursor-pointer">
								{tipo.label}
							</label>
							{value.includes(tipo.value) && (
								<Check className="h-4 w-4 text-primary" />
							)}
						</div>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
