import { Faq } from '@/components/marketing/Faq'
import { PricingSection } from '@/components/marketing/PricingSection'
import { Capabilities, CtaBanner, Hero, HowItWorks, Marquee, MaterialsShowcase, Testimonials, WhySeleste } from '@/components/marketing/sections'
import { useDemoLogin } from '@/hooks/useDemoLogin'

export default function Landing() {
  const demo = useDemoLogin()
  return (
    <>
      <Marquee />
      <Hero onDemo={demo} />
      <HowItWorks />
      <MaterialsShowcase />
      <WhySeleste />
      <Capabilities />
      <Testimonials />
      <PricingSection />
      <Faq />
      <CtaBanner />
    </>
  )
}
