import HeroSection from "@/components/hero-section"
import BenefitsSection from "@/components/benefits-section";
import FaqSection from "@/components/faq-section"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroSection />
      <BenefitsSection />
      <FaqSection />

      <footer className="w-full py-6 bg-slate-900 text-white text-center mt-auto">
        <p className="text-sm">© {new Date().getFullYear()} Land Verification. All rights reserved.</p>
      </footer>
    </main>
  )
}
