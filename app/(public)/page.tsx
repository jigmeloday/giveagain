import { ClosingBanner } from "@/components/home/closing-banner";
import { Hero } from "@/components/home/hero";
import { JustPosted } from "@/components/home/just-posted";
import { NotAMarketplace } from "@/components/home/not-a-marketplace";
import { Steps } from "@/components/home/steps";

export default function Home() {
  return (
    <main>
      <Hero />
      <Steps />
      <NotAMarketplace />
      <JustPosted />
      <ClosingBanner />
    </main>
  );
}
