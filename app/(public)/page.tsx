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
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
    </main>
  )
}
