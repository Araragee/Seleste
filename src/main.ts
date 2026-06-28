import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './style.css'
import App from './App.vue'
import router from './router'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

/**
 * Keeps the scroll-reveal animations robust:
 * - `refresh()` recalculates trigger positions after fonts/images change the
 *   layout, so a section can't get stuck below a stale, never-reached start.
 * - Under reduced-motion, every reveal is snapped to its final (visible) state
 *   and its trigger killed, so content is shown immediately without motion.
 */
const hardenReveals = () => {
  ScrollTrigger.refresh()
  if (!prefersReducedMotion.matches) return
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.animation?.progress(1)
    trigger.kill()
  })
}

// Run after each view's onMounted has registered its triggers (covers the
// initial load and every SPA navigation).
router.afterEach(() => {
  requestAnimationFrame(() => requestAnimationFrame(hardenReveals))
})

const app = createApp(App)

app.use(createPinia())
app.use(createHead())
app.use(router)

app.mount('#app')
