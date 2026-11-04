import { Faq } from '@/components/marketing/Faq'
import { PricingSection } from '@/components/marketing/PricingSection'
import { CtaBanner } from '@/components/marketing/sections'

export default function PricingPage() {
  return (
    <>
      <PricingSection heading="h1" />
      <Faq />
      <CtaBanner />
    </>
  )
}
