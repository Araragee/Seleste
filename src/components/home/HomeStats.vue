<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement[]>([])
const bottomSectionRef = ref<HTMLElement | null>(null)
const bottomTextRef = ref<HTMLElement | null>(null)
const bottomMapRef = ref<HTMLElement | null>(null)
const bottomLogosRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Top Stats Animation
  gsap.from(titleRef.value, {
    scrollTrigger: { trigger: sectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.5, ease: 'power3.out'
  })

  gsap.from(cardsRef.value, {
    scrollTrigger: { trigger: sectionRef.value, start: 'top 70%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1)'
  })

  // Bottom Content Animation
  const tlBottom = gsap.timeline({
    scrollTrigger: { trigger: bottomSectionRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })

  tlBottom.from(bottomMapRef.value, { scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.out' })
          .from(bottomTextRef.value, { x: -40, opacity: 0, duration: 0.6, ease: 'power3.out' }, "-=0.6")
          .from(bottomLogosRef.value, { opacity: 0, duration: 0.8 }, "-=0.4")
})
</script>
<template>
  <section ref="sectionRef" class="flex flex-col items-center justify-center bg-gray-50 bg-[linear-gradient(135deg,rgba(255,206,236,0.1)_0%,rgba(152,150,240,0.1)_100%)] py-32 overflow-hidden">
    <h2 ref="titleRef" class="text-[40px] md:text-[50px] font-black font-outfit text-center mb-16 tracking-tight text-[#1E252C]">The power of user-led growth</h2>

    <div class="flex flex-wrap justify-center mx-10 mb-20 gap-8">
      <div :ref="el => { if(el) cardsRef[0] = el as HTMLElement }" class="flex flex-col justify-center items-center w-[258px] h-[258px] rounded-[24px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(247,141,167,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-default border border-gray-100">
        <h1 class="text-[75px] font-black font-outfit mb-2 leading-none bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">21<span class="text-[40px]">M</span></h1>
        <h3 class="text-[18px] text-gray-500 text-center font-medium font-poppins">Parts 3D printed</h3>
      </div>
      <div :ref="el => { if(el) cardsRef[1] = el as HTMLElement }" class="flex flex-col justify-center items-center w-[258px] h-[258px] rounded-[24px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(247,141,167,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-default border border-gray-100">
        <h1 class="text-[75px] font-black font-outfit mb-2 leading-none bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">10<span class="text-[40px]">+</span></h1>
        <h3 class="text-[18px] text-gray-500 text-center font-medium font-poppins">3D Printing Technologies</h3>
      </div>
      <div :ref="el => { if(el) cardsRef[2] = el as HTMLElement }" class="flex flex-col justify-center items-center w-[258px] h-[258px] rounded-[24px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(247,141,167,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-default border border-gray-100">
        <h1 class="text-[75px] font-black font-outfit mb-2 leading-none bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">90<span class="text-[40px]">+</span></h1>
        <h3 class="text-[18px] text-gray-500 text-center font-medium font-poppins">Materials & Finishings</h3>
      </div>
      <div :ref="el => { if(el) cardsRef[3] = el as HTMLElement }" class="flex flex-col justify-center items-center w-[258px] h-[258px] rounded-[24px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(247,141,167,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-default border border-gray-100">
        <h1 class="text-[75px] font-black font-outfit mb-2 leading-none bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">160</h1>
        <h3 class="text-[18px] text-gray-500 text-center font-medium font-poppins">Countries Shipped</h3>
      </div>
    </div>
    
    <div ref="bottomSectionRef" class="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-10 mt-10">
      <div class="w-full lg:w-1/2 relative lg:min-h-[600px] flex flex-col justify-center mb-16 lg:mb-0">
        <img ref="bottomMapRef" src="/assets/banner-12-map.png" alt="map" class="absolute w-[80%] top-20 left-0 opacity-40 z-0">
        <div ref="bottomTextRef" class="relative z-10 w-[90%] md:w-[80%]">
          <p class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold mb-6 uppercase tracking-wider text-sm">They love us</p>
          <div class="text-yellow-400 text-xl space-x-1 mb-6 flex drop-shadow-sm">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
          <h1 class="text-[45px] md:text-[55px] font-black font-outfit mb-6 leading-tight tracking-tight text-[#1E252C]">100+ Manufacturing partners</h1>
          <h3 class="text-gray-500 font-normal leading-[1.8] mb-10 text-lg font-poppins">3D printing is a term used to describe a number of additive manufacturing technologies that produce parts one layer at a time from a 3D digital model.</h3>
          <button class="bg-c-red text-white py-4 px-10 text-lg font-bold rounded-lg hover:bg-black transition-colors duration-300 shadow-lg shadow-red-500/30">Get Instant Quote</button>
        </div>
      </div>
      
      <div ref="bottomLogosRef" class="w-full lg:w-1/2 relative flex justify-center items-center min-h-[400px]">
        <div class="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] border border-gray-300 rounded-full flex justify-center items-center border-dashed">
          <img src="/assets/logo-amazon-fill.png" alt="Amazon" class="absolute z-20 w-16 h-16 bg-white rounded-full shadow-lg p-2">
          
          <div class="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] border border-gray-300 rounded-full flex justify-center items-center border-dashed animate-[spin_40s_linear_infinite_reverse]">
             <img src="/assets/logo-google-fill.png" class="absolute top-0 right-0 w-12 h-12 bg-white rounded-full shadow-md p-2 animate-[spin_40s_linear_infinite]">
          </div>

          <div class="absolute w-full h-full animate-[spin_30s_linear_infinite] pointer-events-none">
            <img src="/assets/logo-feedly-fill.png" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md p-2 pointer-events-auto">
            <img src="/assets/logo-craft-fill.png" class="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md p-2 pointer-events-auto">
            <img src="/assets/logo-shopify-fill.png" class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md p-2 pointer-events-auto">
            <img src="/assets/logo-twitch-fill.png" class="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md p-2 pointer-events-auto">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
