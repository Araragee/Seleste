import { QuoteBuilder } from '@/components/app/quote/QuoteBuilder'
import { Eyebrow } from '@/components/ui/misc'

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <Eyebrow>Instant quote</Eyebrow>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Price your part in seconds</h1>
        <p className="mt-3 text-lg text-ink/55">Your model is analyzed locally in your browser. Nothing is uploaded until you place an order.</p>
      </div>
      <QuoteBuilder />
    </div>
  )
}
