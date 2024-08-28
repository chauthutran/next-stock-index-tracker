import { AuthProvider } from "./contexts/AuthContext";
import { MainUiProvider } from "./contexts/MainUiContext";
import { StockVoteProvider } from "./contexts/StockVoteContext";
import AppWrapper from "./ui/AppWrapper";
import HomePage from "./ui/HomePage";
import Footer from "./ui/layout/Footer";
import Header from "./ui/layout/Header";

export default function Home() {
	return (
		<div className="flex flex-col h-screen">
			<MainUiProvider>
				<AuthProvider>
					<StockVoteProvider>
						<Header />
						<main className="flex-1">
							<AppWrapper />
						</main>
						<Footer />
					</StockVoteProvider>
				</AuthProvider>
			</MainUiProvider>
		</div>
	)
}
