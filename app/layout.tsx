import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { PWAInstaller } from "@/components/PWAInstaller";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: "Collector Manager",
	description: "Sistema de gestión para Radmetal",
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Collector"
	},
	icons: {
		icon: [
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
	}
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" }
	]
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
				<ThemeProvider>
					<AuthProvider>{children}</AuthProvider>
					<PWAInstaller />
				</ThemeProvider>
			</body>
		</html>
	);
}
