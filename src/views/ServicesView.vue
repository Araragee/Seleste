<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const openIndex = ref(0)
const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}

// Animation Refs
const introSectionRef = ref<HTMLElement | null>(null)
const introElementsRef = ref<HTMLElement[]>([])

const servicesGridRef = ref<HTMLElement | null>(null)
const servicesCardsRef = ref<HTMLElement[]>([])

const accordionSectionRef = ref<HTMLElement | null>(null)
const accordionTitleRef = ref<HTMLElement | null>(null)
const accordionDescRef = ref<HTMLElement | null>(null)
const accordionFaqRefs = ref<HTMLElement[]>([])
const accordionImgRef = ref<HTMLElement | null>(null)

const fourCardsSectionRef = ref<HTMLElement | null>(null)
const fourCardsRef = ref<HTMLElement[]>([])
const fourCardsContentRef = ref<HTMLElement | null>(null)

const finalCarouselSectionRef = ref<HTMLElement | null>(null)
const finalCarouselTitleRef = ref<HTMLElement | null>(null)
const finalCarouselRef = ref<HTMLElement | null>(null)

const faqs = [
  { question: 'Printing Services', answer: 'Fast print, flyer, and pamphlet printing organization. Pleased with our past. Printing for what’s to come. What’s more, we do it right! A full administration printing background.' },
  { question: 'Digital Scanning', answer: 'Fast digital scanning services for all your needs.' },
  { question: 'Design Services', answer: 'Professional design services for all your needs.' },
  { question: 'Copying Services', answer: 'Efficient and reliable copying services for all your needs.' }
]

onMounted(() => {
  // Intro Animation
  gsap.from(introElementsRef.value, {
    scrollTrigger: { trigger: introSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out'
  })

  // 4 Services First Row
  gsap.from(servicesCardsRef.value, {
    scrollTrigger: { trigger: servicesGridRef.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1)'
  })

  // Fast and Quality Services (Accordion)
  const tlAccordion = gsap.timeline({
    scrollTrigger: { trigger: accordionSectionRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  tlAccordion.from([accordionTitleRef.value, accordionDescRef.value], { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' })
             .from(accordionFaqRefs.value, { x: -30, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, "-=0.2")
             .from(accordionImgRef.value, { x: 50, opacity: 0, duration: 0.7, ease: 'back.out(1)' }, "-=0.5")

  // Fourth Container
  const tlFourCards = gsap.timeline({
    scrollTrigger: { trigger: fourCardsSectionRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  tlFourCards.from(fourCardsContentRef.value, { x: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
             .from(fourCardsRef.value, { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, "-=0.4")

  // Final Carousel
  const tlFinal = gsap.timeline({
    scrollTrigger: { trigger: finalCarouselSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' }
  })
  tlFinal.from(finalCarouselTitleRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' })
         .from(finalCarouselRef.value, { y: 50, opacity: 0, duration: 0.7, ease: 'back.out(1)' }, "-=0.3")
})
</script>

<template>
  <div class="bg-white border-t border-gray-100">
    <!-- Hero / Breadcrumb -->
    <section class="bg-gray-50 py-20 text-center relative border-b border-gray-100">
      <h1 class="text-[50px] font-black font-outfit mb-4 text-[#1E252C]">Services</h1>
      <div class="flex items-center justify-center text-gray-400 gap-3 font-medium text-lg">
        <router-link to="/" class="hover:text-c-red transition-colors text-black">Home</router-link>
        <span class="w-8 h-px bg-c-red"></span>
        <span class="text-c-red">Services</span>
      </div>
    </section>

    <!-- Intro -->
    <section ref="introSectionRef" class="py-32 px-4 md:px-10 max-w-5xl mx-auto text-center">
      <p :ref="el => { if(el) introElementsRef[0] = el as HTMLElement }" class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold mb-6 uppercase tracking-wider text-sm shadow-sm">WE ARE PROFESSIONAL</p>
      <h2 :ref="el => { if(el) introElementsRef[1] = el as HTMLElement }" class="text-4xl md:text-[55px] font-black font-outfit leading-[1.1] mb-8 text-[#1E252C] tracking-tight">We’re something other than duplicates…<br>What’s more, we do it right!</h2>
      <p :ref="el => { if(el) introElementsRef[2] = el as HTMLElement }" class="text-xl text-gray-500 leading-relaxed font-poppins text-[18px]">Printing organization mottos While the Internet might assume control of numerous parts<br>of printing, a few things are as yet favored on paper.</p>
    </section>

    <!-- 4 Services First Row -->
    <section ref="servicesGridRef" class="pb-32 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div :ref="el => { if(el) servicesCardsRef[0] = el as HTMLElement }" class="bg-white border border-gray-100 rounded-[20px] p-8 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group hover:-translate-y-2 text-center">
          <div class="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-c-red group-hover:scale-110 transition-all duration-300"><img src="/assets/icons8-computer-60.png" class="w-10 h-10 object-contain filter group-hover:brightness-200"></div>
          <h3 class="text-xl font-bold font-outfit mb-4 text-[#1E252C]">Printing Services</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-sm m-0">Fast print, flyer, and pamphlet printing organization. Pleased with our past. Printing for what’s to come.</p>
        </div>
        
        <div :ref="el => { if(el) servicesCardsRef[1] = el as HTMLElement }" class="bg-white border border-gray-100 rounded-[20px] p-8 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group hover:-translate-y-2 text-center">
          <div class="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-c-green group-hover:scale-110 transition-all duration-300"><img src="/assets/icons8-computer-60.png" class="w-10 h-10 object-contain filter group-hover:brightness-200"></div>
          <h3 class="text-xl font-bold font-outfit mb-4 text-[#1E252C]">Digital Scanning</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-sm m-0">Praesent porta quam non aliquam rhoncus. Suspendisse eget tempor urna. In quis consequat diam.</p>
        </div>
        
        <div :ref="el => { if(el) servicesCardsRef[2] = el as HTMLElement }" class="bg-white border border-gray-100 rounded-[20px] p-8 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group hover:-translate-y-2 text-center">
          <div class="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300"><img src="/assets/icons8-computer-60.png" class="w-10 h-10 object-contain filter group-hover:brightness-200"></div>
          <h3 class="text-xl font-bold font-outfit mb-4 text-[#1E252C]">Design Services</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-sm m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet orci id mauris pharetra finibus.</p>
        </div>
        
        <div :ref="el => { if(el) servicesCardsRef[3] = el as HTMLElement }" class="bg-white border border-gray-100 rounded-[20px] p-8 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group hover:-translate-y-2 text-center">
          <div class="w-20 h-20 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:scale-110 transition-all duration-300"><img src="/assets/icons8-computer-60.png" class="w-10 h-10 object-contain filter group-hover:brightness-200"></div>
          <h3 class="text-xl font-bold font-outfit mb-4 text-[#1E252C]">Copying Services</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-sm m-0">Donec in porttitor massa, vel feugiat mi. Fusce sagittis eros vel urna pharetra accumsan.</p>
        </div>
      </div>
    </section>

    <!-- Fast and Quality Services: Accordion & Image -->
    <section ref="accordionSectionRef" class="py-32 bg-[#1E252C] relative overflow-hidden px-4 md:px-10 lg:px-20 text-white">
      <!-- Particles Background -->
      <div id="particle-container" class="absolute inset-0 pointer-events-none opacity-50"><div class="particle" v-for="n in 30" :key="n"></div></div>
      
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative z-10 items-center">
         <div class="w-full lg:w-[45%]">
            <h1 ref="accordionTitleRef" class="text-4xl md:text-[55px] font-black font-outfit mb-6 leading-[1.1] tracking-tight">Fast and Quality Services</h1>
            <h3 ref="accordionDescRef" class="text-xl text-gray-400 font-normal leading-relaxed mb-10 font-poppins text-[18px]">Elegant makes it easy to order super soft, stylish custom printed everything that get your message into the world.</h3>
            
            <div class="space-y-4">
              <div v-for="(faq, index) in faqs" :key="index" :ref="el => { if(el) accordionFaqRefs[index] = el as HTMLElement }" class="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300">
                <button @click="toggle(index)" class="w-full text-left px-6 py-5 font-bold text-lg text-white hover:text-c-red transition-colors flex justify-between items-center focus:outline-none font-outfit group">
                  <span>{{ faq.question }}</span>
                  <span class="text-2xl font-light text-gray-500 transition-transform duration-300" :class="{'rotate-45 text-c-red': openIndex === index}">+</span>
                </button>
                <div v-show="openIndex === index" class="px-6 pb-6 text-gray-400 leading-relaxed font-poppins">
                  <p class="m-0 text-base">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
         </div>
         <div class="w-full lg:w-[55%] flex justify-center lg:justify-end">
            <img ref="accordionImgRef" src="/assets/services-31.png" alt="Services" class="w-full max-w-[650px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-transform duration-500">
         </div>
      </div>
    </section>

    <!-- Fourth Container: 4 Cards and Text -->
    <section ref="fourCardsSectionRef" class="py-32 px-4 md:px-10 lg:px-20 bg-gray-50 relative overflow-hidden border-b border-gray-100">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
        <div class="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="i" :ref="el => { if(el) fourCardsRef[i-1] = el as HTMLElement }" class="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 text-center outline outline-1 outline-gray-100 group">
            <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-c-red transition-all duration-300"><img src="/assets/icons8-printer-80.png" class="w-8 h-8 group-hover:brightness-200 transition-all"></div>
            <h3 class="text-lg font-bold font-outfit text-[#1E252C] mb-3">Printing Services</h3>
            <p class="text-gray-500 text-sm leading-relaxed font-poppins m-0">Fast print, flyer, and pamphlet printing organization. Pleased with our past. Printing for what’s to come.</p>
          </div>
        </div>
        
        <div ref="fourCardsContentRef" class="w-full lg:w-1/2">
          <p class="text-c-red font-bold tracking-wider mb-4 uppercase text-sm inline-block bg-red-50 px-4 py-1.5 rounded-full">PRINTING MADE EASY</p>
          <h1 class="text-4xl md:text-[55px] font-black font-outfit mb-8 leading-[1.1] text-[#1E252C] tracking-tight">Fast and Quality<br>Service</h1>
          <p class="text-gray-500 leading-relaxed font-poppins mb-10 text-[18px]">We're something other than duplicates… What’s more, we do it right! A full administration printing background. Fast print, flyer, and pamphlet printing organization. Pleased with our past. Printing for what’s to come. What’s more, we do it right! A full administration printing background.</p>
          <div class="flex flex-wrap gap-4">
            <button class="bg-c-red text-white font-bold text-base px-10 py-4 rounded hover:bg-[#1E252C] hover:-translate-y-1 transition-all shadow-lg shadow-red-500/30">Learn More</button>
            <button class="border-2 border-[#1E252C] text-[#1E252C] font-bold text-base px-10 py-4 rounded hover:bg-[#1E252C] hover:text-white hover:-translate-y-1 transition-all">How It Works</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Final Carousel -->
    <section ref="finalCarouselSectionRef" class="py-32 relative overflow-hidden bg-white text-center">
      <div ref="finalCarouselTitleRef" class="mb-20 px-4">
        <h2 class="text-[40px] md:text-[55px] font-black font-outfit text-[#1E252C] leading-[1.1] mb-6 tracking-tight">We’re something other than duplicates…<br>What’s more, we do it right!</h2>
        <p class="text-gray-500 text-[18px] font-poppins">Printing organization mottos While the Internet might assume control of numerous<br>parts of printing, a few things are as yet favored on paper.</p>
      </div>

      <div class="relative group max-w-[100vw]">
        <div ref="finalCarouselRef" class="flex gap-8 overflow-x-auto px-4 md:px-20 pb-16 snap-x snap-mandatory scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
          <div class="shrink-0 w-[300px] bg-white snap-center group/card cursor-pointer">
            <div class="rounded-2xl overflow-hidden mb-6"><img src="/assets/banner-services-21.png" class="w-full h-[300px] object-cover transition-transform duration-500 group-hover/card:scale-110"></div>
            <h3 class="text-2xl font-bold font-outfit text-[#1E252C]">Printing Services</h3>
          </div>
          <div class="shrink-0 w-[300px] bg-white snap-center group/card cursor-pointer">
            <div class="rounded-2xl overflow-hidden mb-6"><img src="/assets/banner-services-22.png" class="w-full h-[300px] object-cover transition-transform duration-500 group-hover/card:scale-110"></div>
            <h3 class="text-2xl font-bold font-outfit text-[#1E252C]">Design Services</h3>
          </div>
          <div class="shrink-0 w-[300px] bg-white snap-center group/card cursor-pointer">
            <div class="rounded-2xl overflow-hidden mb-6"><img src="/assets/banner-services-23.png" class="w-full h-[300px] object-cover transition-transform duration-500 group-hover/card:scale-110"></div>
            <h3 class="text-2xl font-bold font-outfit text-[#1E252C]">Digital Scanning</h3>
          </div>
          <div class="shrink-0 w-[300px] bg-white snap-center group/card cursor-pointer">
            <div class="rounded-2xl overflow-hidden mb-6"><img src="/assets/banner-services-24.png" class="w-full h-[300px] object-cover transition-transform duration-500 group-hover/card:scale-110"></div>
            <h3 class="text-2xl font-bold font-outfit text-[#1E252C]">Copying Services</h3>
          </div>
        </div>
      </div>
      
      <div class="mt-8">
        <button class="bg-black text-white font-bold text-base px-10 py-4 rounded hover:bg-c-red transition-colors shadow-lg">Check All Services</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
