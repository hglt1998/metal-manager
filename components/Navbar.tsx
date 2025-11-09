import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
	return (
		<nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<Link href="/" className="flex items-center gap-2">
						<Package className="h-6 w-6" />
						<span className="text-xl font-bold">CM</span>
					</Link>
					<div className="flex items-center gap-4">
						<ThemeToggle />
						<Button asChild variant="default" size="sm">
							<Link href="/login">Accede</Link>
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
};
export default Navbar;
