<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement[]>([])

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  tl.from(headerRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' })
    .from(cardsRef.value, { 
      x: 50, 
      opacity: 0, 
      duration: 0.6, 
      stagger: 0.15, 
      ease: 'back.out(1)' 
    }, "-=0.2")
})
</script>
<template>
  <section ref="sectionRef" class="py-32 relative bg-white overflow-hidden">
    <div ref="headerRef" class="container mx-auto px-4 md:px-10 flex flex-col items-center mb-16">
      <div class="relative w-full h-[150px] md:h-[200px] flex justify-center mb-10">
        <img src="/assets/decor-12-box-q438menvbv7qcyuac8herzth4t0zljqbmy2bxw0rnk.png" class="absolute left-10 top-0 w-16 md:w-24 animate-[bounce_3s_ease-in-out_infinite] hover:scale-110 transition-transform cursor-pointer">
        <img src="/assets/decor-12-smile.png" class="absolute right-[20%] top-[-20px] w-12 md:w-16 hover:rotate-12 transition-transform cursor-pointer">
        <img src="/assets/decor-12-heart-q438menvbv7qcyuac8herzth4t0zljqbmy2bxw0rnk.png" class="absolute left-[30%] bottom-0 w-12 md:w-16 animate-[pulse_2s_infinite] hover:scale-125 transition-transform cursor-pointer">
        <img src="/assets/decor-12-hand-q438menvbv7tu6sez624mlpksrd3pqytofsrhhqb5s.jpg" class="absolute right-10 bottom-0 w-16 md:w-24 border rounded-full hover:shadow-[0_0_20px_rgba(247,141,167,0.5)] transition-shadow">
      </div>
      
      <p class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold mb-4 uppercase tracking-wider text-sm">Rated 4.9 of 5</p>
      <h1 class="text-4xl md:text-[55px] font-black font-outfit text-center tracking-tight text-[#1E252C]">What our customers say</h1>
    </div>

    <div class="relative max-w-[100vw] group">
      <div class="flex gap-6 overflow-x-auto pb-10 px-4 md:px-10 snap-x snap-mandatory scrollbar-hide py-4" style="scrollbar-width: none; -ms-overflow-style: none;">
        
        <div :ref="el => { if(el) cardsRef[0] = el as HTMLElement }" class="flex-shrink-0 w-[300px] md:w-[420px] bg-white border border-gray-100 rounded-[20px] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 snap-center cursor-grab active:cursor-grabbing">
          <div class="text-yellow-400 text-lg mb-6 space-x-1 drop-shadow-sm">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
          <p class="text-gray-500 leading-[1.8] mb-10 font-poppins italic text-[17px]">“For all your printing prerequisites. Offer to make and print their pamphlets, business cards, solicitations, and occasion programs.”</p>
          <img src="/assets/logo-spotify-2.png" alt="Spotify" class="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity">
        </div>
        
        <div :ref="el => { if(el) cardsRef[1] = el as HTMLElement }" class="flex-shrink-0 w-[300px] md:w-[420px] bg-white border border-gray-100 rounded-[20px] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 snap-center cursor-grab active:cursor-grabbing">
          <div class="text-yellow-400 text-lg mb-6 space-x-1 drop-shadow-sm">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star text-gray-300"></i>
          </div>
          <p class="text-gray-500 leading-[1.8] mb-10 font-poppins italic text-[17px]">“For all your printing prerequisites. Offer to make and print their pamphlets, business cards, solicitations, and occasion programs.”</p>
          <img src="/assets/logo-hopin-2.png" alt="Hopin" class="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity">
        </div>
        
        <div :ref="el => { if(el) cardsRef[2] = el as HTMLElement }" class="flex-shrink-0 w-[300px] md:w-[420px] bg-white border border-gray-100 rounded-[20px] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 snap-center cursor-grab active:cursor-grabbing">
          <div class="text-yellow-400 text-lg mb-6 space-x-1 drop-shadow-sm">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
          <p class="text-gray-500 leading-[1.8] mb-10 font-poppins italic text-[17px]">“For all your printing prerequisites. Offer to make and print their pamphlets, business cards, solicitations, and occasion programs.”</p>
          <img src="/assets/logo-amazon-2.png" alt="Amazon" class="h-6 object-contain mt-2 opacity-80 hover:opacity-100 transition-opacity">
        </div>
        
        <div :ref="el => { if(el) cardsRef[3] = el as HTMLElement }" class="flex-shrink-0 w-[300px] md:w-[420px] bg-white border border-gray-100 rounded-[20px] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 snap-center cursor-grab active:cursor-grabbing">
          <div class="text-yellow-400 text-lg mb-6 space-x-1 drop-shadow-sm">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
          <p class="text-gray-500 leading-[1.8] mb-10 font-poppins italic text-[17px]">“For all your printing prerequisites. Offer to make and print their pamphlets, business cards, solicitations, and occasion programs.”</p>
          <img src="/assets/logo-ebay.png" alt="Ebay" class="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity">
        </div>
      </div>
    </div>
    
    <div class="text-center mt-6">
      <button class="bg-c-red text-white py-4 px-10 rounded text-base font-bold hover:bg-black transition-colors shadow-lg shadow-red-500/30">Get Instant Quote</button>
    </div>
  </section>
</template>
