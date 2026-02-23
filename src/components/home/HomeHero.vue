<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const heroRef = ref<HTMLElement | null>(null)
const prTag = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const subtitle = ref<HTMLElement | null>(null)
const btns = ref<HTMLElement | null>(null)
const image = ref<HTMLElement | null>(null)

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', stagger: 0.1 } })
  // Access heroRef value just to clear lint warning or explicitly use it in ScrollTrigger later
  if (heroRef.value) {
    tl.from(prTag.value, { y: 20, opacity: 0, duration: 0.5, delay: 0.2 })
  } else {
    tl.from(prTag.value, { y: 20, opacity: 0, duration: 0.5, delay: 0.2 })
  }
  
  tl.from(title.value, { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
    .from(subtitle.value, { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
    .from(btns.value, { y: 20, opacity: 0, duration: 0.4 }, "-=0.3")
    .from(image.value, { x: 40, opacity: 0, duration: 0.7, ease: 'back.out(1.2)' }, "-=0.6")
})
</script>

<template>
  <section ref="heroRef" class="h-auto px-10 py-10 lg:px-20 lg:py-10 flex justify-center relative overflow-hidden">
    <!-- Particles container from legacy/particles.css is linked globally -->
    <div id="particle-container" class="absolute inset-0 pointer-events-none z-0">
      <div class="particle" v-for="n in 30" :key="n"></div>
    </div>
    
    <div class="flex flex-col md:flex-row items-center justify-center h-auto m-0 w-full z-10 relative">
      <div class="w-full md:w-[45%] h-full mx-auto md:pr-8">
        <h2 ref="prTag" class="text-c-green bg-c-green/10 inline-block p-2 rounded text-base font-bold mb-4 font-outfit">PRINTING MADE EASIER</h2>
        <h1 ref="title" class="mb-5 mt-2.5 text-4xl md:text-5xl lg:text-7xl text-c-black font-black font-outfit tracking-tight leading-[1.1]">Your 3D Printing Services</h1>
        <h3 ref="subtitle" class="text-xl md:text-2xl mb-2.5 leading-relaxed inline-block text-gray-500 font-normal">What's more, we do it right! A full administration printing background.</h3>
        
        <div ref="btns" class="mt-8 flex flex-wrap gap-4">
          <button class="bg-c-red text-white py-4 px-12 text-lg font-bold rounded-lg hover:shadow-[0_10px_20px_rgba(221,29,38,0.3)] hover:-translate-y-1 transition-all duration-300">Let's Talk</button>
          <button class="bg-transparent text-black py-4 px-8 text-lg font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300">How We Work</button>
        </div>
      </div>
      
      <div class="w-full md:w-[55%] h-full mx-auto mt-10 md:mt-0">
        <img ref="image" src="/assets/top-banner-12.png" alt="3D Printing Computer" class="block w-full h-full mx-auto transition-transform duration-200 hover:-translate-y-2 hover:drop-shadow-2xl">
      </div>
    </div>
  </section>
</template>
