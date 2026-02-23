<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const prTag = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const listItems = ref<HTMLElement[]>([])

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  })

  tl.from(imageRef.value, { x: -60, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from(prTag.value, { y: 20, opacity: 0, duration: 0.4 }, "-=0.5")
    .from(titleRef.value, { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(listItems.value, { x: 30, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, "-=0.4")
})
</script>
<template>
  <section ref="sectionRef" class="py-24 md:py-32 px-0 md:px-0 lg:min-h-[600px] overflow-hidden">
    <div class="flex flex-col md:flex-row items-stretch justify-center h-full max-w-[1400px] mx-auto">
      <div class="w-full md:w-[50%] relative text-right bg-[url('/assets/banner-12-bgSAMPLE.jpg')] bg-no-repeat bg-center bg-cover min-h-[400px] rounded-r-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <img ref="imageRef" src="/assets/banner-12-9.png" alt="Why us" class="absolute right-[-5%] top-1/2 -translate-y-1/2 max-w-[100%] transition-transform hover:scale-105 duration-500 hover:drop-shadow-2xl z-10">
      </div>

      <div class="w-full md:w-[50%] md:pl-20 flex flex-col justify-center py-16 px-8 lg:py-0">
        <p ref="prTag" class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold self-start mb-6 uppercase tracking-wider text-sm shadow-sm">Why Pricom?</p>
        <h1 ref="titleRef" class="text-[45px] md:text-[55px] font-black font-outfit m-0 mt-5 mb-10 leading-tight text-[#1E252C] tracking-tight">Why 3D Printing?</h1>

        <div class="h-[400px] overflow-y-auto pr-6 custom-scrollbar hover-show-scrollbar">
          <ul class="list-none p-0 m-0 space-y-10">
            <div v-for="i in [1]" :key="'item'+i" class="hidden"></div>
            <li :ref="el => { if(el) listItems[0] = el as HTMLElement }" class="p-6 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <h3 class="text-2xl font-bold font-outfit mb-3 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent inline-block">Reliable Quality</h3>
              <h2 class="text-lg text-gray-500 font-normal leading-relaxed m-0 font-poppins">Proprietary processes, expert 3D printing operators, and inspections are our secrets to delivering exceptional, quality products every time.</h2>
            </li>
            <li :ref="el => { if(el) listItems[1] = el as HTMLElement }" class="p-6 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <h3 class="text-2xl font-bold font-outfit mb-3 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent inline-block">Fast Turnaround</h3>
              <h2 class="text-lg text-gray-500 font-normal leading-relaxed m-0 font-poppins">Working on a project for a customer that has to be just right? Get models back fast, and 3D print new iterations, if needed, for final feedback and production.</h2>
            </li>
            <li :ref="el => { if(el) listItems[2] = el as HTMLElement }" class="p-6 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <h3 class="text-2xl font-bold font-outfit mb-3 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent inline-block">Reliable Quality</h3>
              <h2 class="text-lg text-gray-500 font-normal leading-relaxed m-0 font-poppins">Proprietary processes, expert 3D printing operators, and inspections are our secrets to delivering exceptional, quality products every time.</h2>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  background-color: #f2f2f2;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  transition: background-color 0.2s ease-in-out;
}
.hover-show-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #7d7d7d;
}
</style>
