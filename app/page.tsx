import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";

export default function Home() {
	return (
		<div className="min-h-screen bg-background font-sans">
			<Navbar />
			<main>
				<Hero />
			</main>
			<Footer />
		</div>
	);
}
