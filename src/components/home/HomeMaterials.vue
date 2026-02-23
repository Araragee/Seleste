<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const carouselRef = ref<HTMLElement | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const prTag = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

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
    .from(carouselRef.value, { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' }, "-=0.2")
})

const scroll = (direction: 'left' | 'right') => {
  if (carouselRef.value) {
    const scrollAmount = 350
    carouselRef.value.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }
}
</script>
<template>
  <section ref="sectionRef" class="bg-white py-24 md:py-32 px-10 md:px-20 relative text-left">
    <div class="mb-14 min-w-full">
      <p ref="prTag" class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold mb-4 uppercase tracking-wider text-sm">Our Materials</p>
      <h1 ref="titleRef" class="text-4xl md:text-5xl lg:text-[55px] font-black font-outfit text-[#1E252C] m-0 mt-2 tracking-tight">Available 3D printing materials</h1>
    </div>

    <div class="relative flex items-center group w-full outline-none">
      <button @click="scroll('left')" class="absolute left-[-22px] z-10 w-11 h-11 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-transform active:scale-90 opacity-0 group-hover:opacity-100">
        <i class="fas fa-angle-left"></i>
      </button>
      
      <div ref="carouselRef" class="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-6 px-2" style="scrollbar-width: none; -ms-overflow-style: none;">
        <img src="/assets/banner-12-4.jpg" alt="Material 1" class="snap-start rounded-[20px] object-cover w-[330px] h-auto flex-shrink-0 select-none hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        <img src="/assets/banner-12-5.png" alt="Material 2" class="snap-start rounded-[20px] object-cover w-[330px] h-auto flex-shrink-0 select-none hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        <img src="/assets/banner-12-6.jpg" alt="Material 3" class="snap-start rounded-[20px] object-cover w-[330px] h-auto flex-shrink-0 select-none hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        <img src="/assets/banner-12-7.jpg" alt="Material 4" class="snap-start rounded-[20px] object-cover w-[330px] h-auto flex-shrink-0 select-none hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        <img src="/assets/banner-12-8.jpg" alt="Material 5" class="snap-start rounded-[20px] object-cover w-[330px] h-auto flex-shrink-0 select-none hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer">
      </div>
      
      <button @click="scroll('right')" class="absolute right-[-22px] z-10 w-11 h-11 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-transform active:scale-90 opacity-0 group-hover:opacity-100">
        <i class="fas fa-angle-right"></i>
      </button>
    </div>
  </section>
</template>
<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
