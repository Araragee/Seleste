<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const tagRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  tl.from(tagRef.value, { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' })
    .from(titleRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, "-=0.2")
    .from(cardRefs.value, { 
      y: 50, 
      opacity: 0, 
      duration: 0.6, 
      stagger: 0.15, 
      ease: 'back.out(1.2)' 
    }, "-=0.3")
})
</script>
<template>
  <section ref="sectionRef" class="bg-c-light-gray py-32 px-4 md:px-10 lg:px-20 text-center">
    <div class="mb-16">
      <p ref="tagRef" class="inline-block bg-c-green/10 text-c-green px-5 py-2 rounded-full font-medium mb-4">How it works?</p>
      <h1 ref="titleRef" class="text-4xl md:text-5xl lg:text-6xl font-black font-outfit text-black m-0 tracking-tight">How to Order a 3D Print</h1>
    </div>

    <div class="flex flex-wrap justify-center gap-10">
      <div v-for="i in [1]" :key="'card'+i" class="hidden"></div> <!-- Dummy element to avoid compiler issues if ref array usage isn't perfect, but we'll manually attach refs -->
      <div :ref="el => { if(el) cardRefs[0] = el as HTMLElement }" class="bg-white rounded-[20px] p-12 pb-16 max-w-[390px] relative transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">
        <img src="/assets/about-1.png" alt="Upload" class="mx-auto mb-6 transition-transform group-hover:scale-110 duration-300">
        <div class="absolute bottom-[-28px] left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 shadow-[0_7px_30px_rgba(0,0,0,0.13)] transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[rgba(247,141,167,0.9)] group-hover:to-[rgba(255,105,0,0.6)] group-hover:text-white group-hover:scale-110">1</div>
        <h4 class="text-[22px] font-bold mb-5 font-outfit">Upload your 3D file</h4>
        <p class="text-[18px] text-[#7A7A7A] leading-[1.8] m-0">Encrypted upload for the protection of your intellectual property. Lorem ipsum det, consec tetur adipiscing elit duis neca...</p>
      </div>

      <div :ref="el => { if(el) cardRefs[1] = el as HTMLElement }" class="bg-white rounded-[20px] p-12 pb-16 max-w-[390px] relative transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">
        <img src="/assets/about-2.png" alt="Process" class="mx-auto mb-6 transition-transform group-hover:scale-110 duration-300">
        <div class="absolute bottom-[-28px] left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 shadow-[0_7px_30px_rgba(0,0,0,0.13)] transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[rgba(247,141,167,0.9)] group-hover:to-[rgba(255,105,0,0.6)] group-hover:text-white group-hover:scale-110">2</div>
        <h4 class="text-[22px] font-bold mb-5 font-outfit">Order processing</h4>
        <p class="text-[18px] text-[#7A7A7A] leading-[1.8] m-0">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi Lorem ipsum det, adipiscing elit duis nec fringi Lorem ipsum...</p>
      </div>

      <div :ref="el => { if(el) cardRefs[2] = el as HTMLElement }" class="bg-white rounded-[20px] p-12 pb-16 max-w-[390px] relative transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">
        <img src="/assets/about-3.png" alt="Receive" class="mx-auto mb-6 transition-transform group-hover:scale-110 duration-300">
        <div class="absolute bottom-[-28px] left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 shadow-[0_7px_30px_rgba(0,0,0,0.13)] transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[rgba(247,141,167,0.9)] group-hover:to-[rgba(255,105,0,0.6)] group-hover:text-white group-hover:scale-110">3</div>
        <h4 class="text-[22px] font-bold mb-5 font-outfit">Receive Your Parts</h4>
        <p class="text-[18px] text-[#7A7A7A] leading-[1.8] m-0">Shipped directly to you by one of our trusted manufacturing partners. Lorem ipsum det, consec tetur adipiscing elit...</p>
      </div>
    </div>
  </section>
</template>
