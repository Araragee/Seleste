import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Fades + lifts every `[data-reveal]` descendant into view as the section
 * scrolls in. Skipped entirely for users who prefer reduced motion.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(options: { stagger?: number; start?: string } = {}) {
  const ref = useRef<T>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', ref.current)
        if (!items.length) return
        gsap.from(items, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: options.stagger ?? 0.08,
          scrollTrigger: { trigger: ref.current, start: options.start ?? 'top 82%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return ref
}
