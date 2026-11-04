import { PageHeader } from '@/components/app/PageHeader'
import { QuoteBuilder } from '@/components/app/quote/QuoteBuilder'

export default function NewQuote() {
  return (
    <>
      <PageHeader title="New quote" description="Upload an STL to compare prices across every material." />
      <QuoteBuilder inApp />
    </>
  )
}
