"use client";

const Footer = () => {
	return (
		<footer className="border-t border-border/40 bg-background">
			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						Collector Manager © {new Date().getFullYear()}
					</p>
					<p className="text-sm text-muted-foreground">
						humbertolopezdev@gmail.com
					</p>
				</div>
			</div>
		</footer>
	);
};
export default Footer;
