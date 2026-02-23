<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const prTag = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement[]>([])

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  tl.from(prTag.value, { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' })
    .from(titleRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, "-=0.2")
    .from(descRef.value, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, "-=0.3")
    .from(btnRef.value, { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' }, "-=0.3")
    .from(cardsRef.value, { 
      x: 50, 
      opacity: 0, 
      duration: 0.6, 
      stagger: 0.2, 
      ease: 'back.out(1)' 
    }, "-=0.4")
})
</script>
<template>
  <section ref="sectionRef" class="py-32 px-4 md:px-10 lg:px-20 bg-white">
    <div class="flex flex-col lg:flex-row max-w-7xl mx-auto gap-12">
      <!-- Left Info -->
      <div class="w-full lg:w-[35%] pt-10">
        <p ref="prTag" class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold mb-6 uppercase tracking-wider text-sm shadow-sm">Choose a Plan</p>
        <h1 ref="titleRef" class="text-4xl lg:text-[55px] font-black font-outfit mb-8 leading-tight tracking-tight text-[#1E252C]">Choose a plan<br>and get started</h1>
        <p ref="descRef" class="text-gray-500 leading-relaxed mb-10 text-[18px] font-poppins">T-shirt Printing for Everyone. Get a headstart with free design templates you can customize in a few clicks.</p>
        <button ref="btnRef" class="bg-black text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-c-red transition-colors flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1">
          How We Work <i class="fas fa-play-circle text-2xl"></i>
        </button>
      </div>
      
      <!-- Cards -->
      <div class="w-full lg:w-[65%] flex flex-col md:flex-row gap-6 relative items-center">
        <!-- Card 1 -->
        <div :ref="el => { if(el) cardsRef[0] = el as HTMLElement }" class="flex-1 w-full bg-white border border-gray-200 rounded-[20px] p-10 pb-12 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative overflow-hidden transition-transform hover:-translate-y-2 group z-10 min-h-[580px]">
          <span class="bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] text-white text-[10px] font-bold uppercase py-1.5 px-4 rounded-full absolute top-8 right-8 shadow-sm tracking-wider">popular</span>
          <h2 class="text-[22px] font-bold mt-2 font-outfit">Professional</h2>
          <div class="text-[50px] font-black font-outfit my-6 text-black">$59.99<span class="text-[18px] text-gray-500 font-normal"> /team</span></div>
          <div class="w-full h-px bg-gray-200 mb-8 opacity-60"></div>
          <ul class="space-y-5 mb-10 list-none p-0">
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">Full access to all features</span></li>
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">Fast and free standard shipping</span></li>
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">No credit card required</span></li>
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">Use on unlimited projects</span></li>
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">Team collaboration feature</span></li>
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">Friendly supports</span></li>
          </ul>
          <button class="w-full bg-black text-white py-4 rounded font-bold hover:bg-gradient-to-r hover:from-[rgba(247,141,167,0.9)] hover:to-[rgba(255,105,0,0.6)] hover:shadow-lg hover:shadow-red-200 transition-all text-base uppercase tracking-wider absolute bottom-10 inset-x-10 w-[calc(100%-80px)]">Purchase Now</button>
        </div>
        
        <div :ref="el => { if(el) cardsRef[1] = el as HTMLElement }" class="flex-1 w-full bg-white border border-gray-200 rounded-[20px] p-10 pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transform md:scale-95 md:translate-x-[-20px] transition-transform hover:-translate-y-2 z-0 hover:z-20 min-h-[520px]">
          <h2 class="text-[22px] font-bold mt-2 font-outfit">Professional</h2>
          <div class="text-[50px] font-black font-outfit my-6 text-black">$12.99<span class="text-[18px] text-gray-500 font-normal"> /user</span></div>
          <div class="w-full h-px bg-gray-200 mb-8 opacity-60"></div>
          <ul class="space-y-5 mb-10 list-none p-0">
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">Free licensed icons</span></li>
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">Fast and free standard shipping</span></li>
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">No credit card required</span></li>
            <li class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><i class="fas fa-check text-c-green text-sm"></i></div> <span class="font-bold text-gray-800 text-base">Friendly supports</span></li>
          </ul>
          <button class="w-[calc(100%-80px)] border-2 border-black text-black bg-white py-3.5 rounded font-bold hover:bg-black hover:text-white transition-colors text-base uppercase tracking-wider absolute bottom-10 inset-x-10">Purchase Now</button>
        </div>
      </div>
    </div>
  </section>
</template>
