import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/sections/features'
import { BenefitsSection } from '@/components/sections/benefits'
import { CTASection } from '@/components/sections/cta-section'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.28) 1.4px, transparent 1.4px)',
            backgroundSize: '18px 18px',
            backgroundPosition: '9px 9px',
          }}
        />
        <div className="relative z-10">
          <FeaturesSection />
          <BenefitsSection />
          <CTASection />
        </div>
      </div>
    </main>
  )
}
