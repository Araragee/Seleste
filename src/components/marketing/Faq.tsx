import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Eyebrow } from '@/components/ui/misc'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/cn'

const FAQS = [
  {
    q: 'What files can I upload?',
    a: 'Binary or ASCII STL files up to 50 MB. Export in millimetres if you can — you can switch the unit to centimetres or inches in the quote builder if your part looks the wrong size.',
  },
  {
    q: 'How is the price calculated?',
    a: 'We measure your mesh volume and surface area in the browser, then combine material usage (accounting for infill on FDM parts), estimated machine time, and finishing labour. Every quote shows the full breakdown.',
  },
  {
    q: 'When am I charged?',
    a: 'Never at checkout. An engineer reviews every file for printability first; once approved, the order moves into production. If something needs changing, we contact you before printing.',
  },
  {
    q: 'Can I cancel an order?',
    a: 'Yes — any order that is still in review can be cancelled from its order page with one click. Once printing starts, contact us and we will do our best.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Each quote shows an estimated delivery date based on the material, quality, finishing, quantity and shipping speed you pick. Pro and Business plans move to the front of the queue.',
  },
]

export function Faq() {
  const [open, setOpen] = useState(0)
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} id="faq" className="scroll-mt-20 bg-mist py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <div data-reveal>
            <Eyebrow>FAQ</Eyebrow>
          </div>
          <h2 data-reveal className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-14 space-y-4">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} data-reveal className="overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-[0_10px_30px_-20px_rgb(0_0_0/0.15)]">
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-lg font-semibold transition-colors hover:text-brand sm:px-8"
                  >
                    {item.q}
                    <Plus className={cn('size-6 shrink-0 text-ink/40 transition-transform duration-300', isOpen && 'rotate-45 text-brand')} />
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" className={cn('grid transition-[grid-template-rows] duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-relaxed text-ink/60 sm:px-8">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
