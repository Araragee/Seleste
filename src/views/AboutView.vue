<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const openIndex = ref(0)
const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}

const companyCarouselRef = ref<HTMLElement | null>(null)
const teamCarouselRef = ref<HTMLElement | null>(null)
const testiCarouselRef = ref<HTMLElement | null>(null)
// Animation refs
const introSectionRef = ref<HTMLElement | null>(null)
const introElementsRef = ref<HTMLElement[]>([])
const featuresSectionRef = ref<HTMLElement | null>(null)
const featuresRef = ref<HTMLElement[]>([])

const accordionSectionRef = ref<HTMLElement | null>(null)
const accordionTitleRef = ref<HTMLElement | null>(null)
const accordionFaqRefs = ref<HTMLElement[]>([])
const accordionVideoRef = ref<HTMLElement | null>(null)

const shippingSectionRef = ref<HTMLElement | null>(null)
const shippingImagesRef = ref<HTMLElement[]>([])
const shippingContentRefs = ref<HTMLElement[]>([])
const shippingListRefs = ref<HTMLElement[]>([])

const companiesSectionRef = ref<HTMLElement | null>(null)
const companiesContentRef = ref<HTMLElement | null>(null)

const customerSectionRef = ref<HTMLElement | null>(null)
const customerTitleRef = ref<HTMLElement | null>(null)
const customerCarouselRef = ref<HTMLElement | null>(null)

const teamSectionRef = ref<HTMLElement | null>(null)
const teamTitleRef = ref<HTMLElement | null>(null)

const bulkSectionRef = ref<HTMLElement | null>(null)
const bulkContentRefs = ref<HTMLElement[]>([])

const scrollCompany = (direction: 'left' | 'right') => {
  if (companyCarouselRef.value) companyCarouselRef.value.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' })
}
const scrollTeam = (direction: 'left' | 'right') => {
  if (teamCarouselRef.value) teamCarouselRef.value.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' })
}
const scrollTesti = (direction: 'left' | 'right') => {
  if (testiCarouselRef.value) testiCarouselRef.value.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' })
}

const faqs = [
  { question: 'Find the perfect product', answer: 'Fast print, flyer, and pamphlet printing organization. Pleased with our past. Printing for what’s to come. What’s more, we do it right! A full administration printing background.' },
  { question: 'Make it print ready', answer: 'Fast print, flyer, and pamphlet printing organization. Pleased with our past. Printing for what’s to come. What’s more, we do it right! A full administration printing background.' },
  { question: 'Ship it for you', answer: 'Fast print, flyer, and pamphlet printing organization. Pleased with our past. Printing for what’s to come. What’s more, we do it right! A full administration printing background.' }
]

onMounted(() => {
  // Intro Animation
  gsap.from(introElementsRef.value, {
    scrollTrigger: { trigger: introSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out'
  })

  // Features Grid Animation
  gsap.from(featuresRef.value, {
    scrollTrigger: { trigger: featuresSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1)'
  })

  // Accordion & Video Animation
  const tlAccordion = gsap.timeline({
    scrollTrigger: { trigger: accordionSectionRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  tlAccordion.from(accordionTitleRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' })
             .from(accordionFaqRefs.value, { x: -30, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, "-=0.2")
             .from(accordionVideoRef.value, { x: 50, opacity: 0, duration: 0.7, ease: 'back.out(1)' }, "-=0.5")

  // Shipping Section Animation
  const tlShipping = gsap.timeline({
    scrollTrigger: { trigger: shippingSectionRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  tlShipping.from(shippingImagesRef.value, { x: -50, opacity: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out' })
            .from(shippingContentRefs.value, { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, "-=0.4")
            .from(shippingListRefs.value, { x: 20, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' }, "-=0.2")

  // Companies Section
  gsap.from(companiesContentRef.value, {
    scrollTrigger: { trigger: companiesSectionRef.value, start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.6, ease: 'power3.out'
  })

  // Customer Love Section
  const tlCustomer = gsap.timeline({
    scrollTrigger: { trigger: customerSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' }
  })
  tlCustomer.from(customerTitleRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' })
            .from(customerCarouselRef.value, { x: 50, opacity: 0, duration: 0.7, ease: 'back.out(1)' }, "-=0.3")

  // Team Section
  gsap.from(teamTitleRef.value, {
    scrollTrigger: { trigger: teamSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.5, ease: 'power3.out'
  })

  // Bulk Section
  gsap.from(bulkContentRefs.value, {
    scrollTrigger: { trigger: bulkSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1)'
  })
})
</script>

<template>
  <div class="bg-white">
    <!-- Hero / Breadcrumb -->
    <section class="bg-gray-50 py-20 text-center relative border-b border-gray-100">
      <h1 class="text-[50px] font-black font-outfit mb-4 text-[#1E252C]">About Us</h1>
      <div class="flex items-center justify-center text-gray-400 gap-3 font-medium text-lg">
        <router-link to="/" class="hover:text-c-red transition-colors text-black">Home</router-link>
        <span class="w-8 h-px bg-c-red"></span>
        <span class="text-c-red">About Us</span>
      </div>
    </section>

    <!-- Intro -->
    <section ref="introSectionRef" class="py-32 px-4 md:px-10 max-w-5xl mx-auto text-center">
      <p :ref="el => { if(el) introElementsRef[0] = el as HTMLElement }" class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold mb-6 uppercase tracking-wider text-sm shadow-sm">WE ARE PROFESSIONAL</p>
      <h2 :ref="el => { if(el) introElementsRef[1] = el as HTMLElement }" class="text-4xl md:text-[55px] font-black font-outfit leading-[1.1] mb-8 text-[#1E252C] tracking-tight">We’re something other than duplicates…<br>What’s more, we do it right!</h2>
      <p :ref="el => { if(el) introElementsRef[2] = el as HTMLElement }" class="text-xl text-gray-500 leading-relaxed font-poppins text-[18px]">Printing organization mottos While the Internet might assume control of numerous parts<br>of printing, a few things are as yet favored on paper.</p>
    </section>

    <!-- 6 Features Grid -->
    <section ref="featuresSectionRef" class="pb-32 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div :ref="el => { if(el) featuresRef[0] = el as HTMLElement }" class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 bg-white group hover:-translate-y-2">
          <div class="shrink-0 group-hover:scale-110 transition-transform drop-shadow"><img src="/assets/icons8-computer-60.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Top quality prints using the latest technology</h3><p class="text-gray-500 leading-relaxed font-poppins m-0 text-sm">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div :ref="el => { if(el) featuresRef[1] = el as HTMLElement }" class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 bg-white group hover:-translate-y-2">
          <div class="shrink-0 group-hover:scale-110 transition-transform drop-shadow"><img src="/assets/icons8-rgb-96.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Mix and match colors, sizes, <br>and designs</h3><p class="text-gray-500 leading-relaxed font-poppins m-0 text-sm">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div :ref="el => { if(el) featuresRef[2] = el as HTMLElement }" class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 bg-white group hover:-translate-y-2">
          <div class="shrink-0 group-hover:scale-110 transition-transform drop-shadow"><img src="/assets/icons8-location-100.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Shipping worldwide</h3><p class="text-gray-500 leading-relaxed font-poppins m-0 text-sm">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div :ref="el => { if(el) featuresRef[3] = el as HTMLElement }" class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 bg-white group hover:-translate-y-2">
          <div class="shrink-0 group-hover:scale-110 transition-transform drop-shadow"><img src="/assets/icons8-box-100.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Made-to-measure<br>packaging</h3><p class="text-gray-500 leading-relaxed font-poppins m-0 text-sm">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div :ref="el => { if(el) featuresRef[4] = el as HTMLElement }" class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 bg-white group hover:-translate-y-2">
          <div class="shrink-0 group-hover:scale-110 transition-transform drop-shadow"><img src="/assets/icons8-consumable-64.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Reorder quickly and easily</h3><p class="text-gray-500 leading-relaxed font-poppins m-0 text-sm">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div :ref="el => { if(el) featuresRef[5] = el as HTMLElement }" class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 bg-white group hover:-translate-y-2">
          <div class="shrink-0 group-hover:scale-110 transition-transform drop-shadow"><img src="/assets/icons8-leaf-96.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Environmentally friendly<br>production processes</h3><p class="text-gray-500 leading-relaxed font-poppins m-0 text-sm">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
      </div>
    </section>

    <!-- Third Container: Accordions & Video -->
    <section ref="accordionSectionRef" class="py-32 bg-[#1E252C] relative overflow-hidden px-4 md:px-10 lg:px-20 text-white">
      <!-- Particles Background (using global particles but scoped via absolute) -->
      <div id="particle-container" class="absolute inset-0 pointer-events-none opacity-50"><div class="particle" v-for="n in 30" :key="n"></div></div>
      
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative z-10 items-center">
        <div class="w-full lg:w-[45%]">
           <p class="text-c-red font-bold tracking-wider mb-4 uppercase text-sm">Fast and quality services</p>
           <h2 ref="accordionTitleRef" class="text-4xl md:text-[55px] font-black font-outfit mb-10 leading-[1.1] tracking-tight">Let us show you <br>how your products <br>come to life</h2>
           
           <div class="space-y-4">
              <div v-for="(faq, index) in faqs" :key="index" :ref="el => { if(el) accordionFaqRefs[index] = el as HTMLElement }" class="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300">
                <button @click="toggle(index)" class="w-full text-left px-6 py-5 font-bold text-lg text-white hover:text-c-red transition-colors flex items-center gap-4 focus:outline-none font-outfit group relative">
                  <span class="w-6 h-6 rounded-full border border-gray-500 flex items-center justify-center shrink-0 group-hover:border-c-red transition-colors" :class="{'bg-c-red border-c-red': openIndex === index}">
                    <span v-if="openIndex === index" class="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                  {{ faq.question }}
                </button>
                <div v-show="openIndex === index" class="px-6 pb-6 pl-16 text-gray-400 leading-relaxed font-poppins">
                  <p class="m-0 text-base">{{ faq.answer }}</p>
                </div>
              </div>
           </div>
        </div>
        <div class="w-full lg:w-[55%] flex justify-center lg:justify-end">
           <video ref="accordionVideoRef" class="w-full max-w-[650px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-700 hover:scale-[1.02] transition-transform duration-500" controls>
              <source src="/assets/Toad The Wet Sprocket - Fly From Heaven.mp4" type="video/mp4">
           </video>
        </div>
      </div>
    </section>

    <!-- Fourth Container (Best shipping rates) -->
    <section ref="shippingSectionRef" class="py-32 px-4 md:px-10 lg:px-20 bg-white">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div class="w-full lg:w-1/2 relative min-h-[500px]">
          <img :ref="el => { if(el) shippingImagesRef[0] = el as HTMLElement }" src="/assets/banner-about-1.png" class="absolute top-0 right-10 w-[65%] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-20 hover:scale-105 transition-transform duration-500 hover:z-30">
          <img :ref="el => { if(el) shippingImagesRef[1] = el as HTMLElement }" src="/assets/banner-about-2.png" class="absolute bottom-0 left-0 w-[60%] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-10 border-[6px] border-white hover:scale-105 transition-transform duration-500 hover:z-30">
        </div>
        
        <div class="w-full lg:w-1/2">
          <p :ref="el => { if(el) shippingContentRefs[0] = el as HTMLElement }" class="text-c-red font-bold tracking-wider mb-4 uppercase text-sm inline-block bg-red-50 px-4 py-1.5 rounded-full">Fast and quality service</p>
          <h1 :ref="el => { if(el) shippingContentRefs[1] = el as HTMLElement }" class="text-4xl md:text-[55px] font-black font-outfit mb-6 leading-[1.1] text-[#1E252C] tracking-tight">Best shipping rates<br>for print-on-demand<br>services</h1>
          <p :ref="el => { if(el) shippingContentRefs[2] = el as HTMLElement }" class="text-gray-500 leading-relaxed font-poppins mb-10 text-[18px]">Fast print, flyer, and pamphlet printing organization. Pleased with our past. Printing for what’s to come. What’s more, we do it right! A full administration printing background.</p>
          
          <ul class="space-y-6">
            <li :ref="el => { if(el) shippingListRefs[0] = el as HTMLElement }" class="flex items-start gap-4">
              <span class="text-c-red mt-1 shrink-0 bg-red-50 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="currentColor" /></svg></span>
              <span class="font-bold text-[#1E252C] text-lg">Top quality prints using the latest technology</span>
            </li>
            <li :ref="el => { if(el) shippingListRefs[1] = el as HTMLElement }" class="flex items-start gap-4">
               <span class="text-c-red mt-1 shrink-0 bg-red-50 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="currentColor" /></svg></span>
              <span class="font-bold text-[#1E252C] text-lg">Mix and match colors, sizes, and designs</span>
            </li>
            <li :ref="el => { if(el) shippingListRefs[2] = el as HTMLElement }" class="flex items-start gap-4">
               <span class="text-c-red mt-1 shrink-0 bg-red-50 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="currentColor" /></svg></span>
              <span class="font-bold text-[#1E252C] text-lg">Shipping worldwide</span>
            </li>
            <li :ref="el => { if(el) shippingListRefs[3] = el as HTMLElement }" class="flex items-start gap-4">
               <span class="text-c-red mt-1 shrink-0 bg-red-50 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="currentColor" /></svg></span>
              <span class="font-bold text-[#1E252C] text-lg">Printed locally, worn globally.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Fifth Container (Companies) -->
    <section ref="companiesSectionRef" class="py-24 bg-gray-50 border-t border-b border-gray-100 relative group overflow-hidden">
      <div ref="companiesContentRef" class="text-center mb-10 text-gray-400 font-bold tracking-widest text-sm">JOIN THE 10.000+ COMPANIES TRUSTING PRICOM</div>
      
      <button @click="scrollCompany('left')" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-transform active:scale-90 opacity-0 group-hover:opacity-100"><i class="fas fa-angle-left"></i></button>
      
      <div ref="companyCarouselRef" class="flex gap-16 overflow-x-auto items-center px-20 snap-x snap-mandatory scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
        <img src="/assets/logo-design.png" class="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity snap-center shrink-0">
        <img src="/assets/logo-cougar.png" class="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity snap-center shrink-0">
        <img src="/assets/logo-intdeco.png" class="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity snap-center shrink-0">
        <img src="/assets/logo-company.png" class="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity snap-center shrink-0">
        <img src="/assets/logo-cosmic.png" class="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity snap-center shrink-0">
        <img src="/assets/logo-findr.png" class="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity snap-center shrink-0">
        <img src="/assets/logo-intdeco.png" class="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity snap-center shrink-0">
      </div>
      
      <button @click="scrollCompany('right')" class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-transform active:scale-90 opacity-0 group-hover:opacity-100"><i class="fas fa-angle-right"></i></button>
    </section>

    <!-- Sixth Container (Customer Love) -->
    <section ref="customerSectionRef" class="py-32 bg-[linear-gradient(135deg,rgba(255,206,236,0.3)_0%,rgba(152,150,240,0.3)_100%)] relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 md:px-10 flex flex-col lg:flex-row gap-12 items-center">
        <div ref="customerTitleRef" class="w-full lg:w-[30%]">
          <h2 class="text-[55px] font-black font-outfit leading-[1.1] mb-6 text-[#1E252C] tracking-tight">Customer<br>Love</h2>
          <p class="text-gray-600 text-xl mb-10 font-poppins">Over 10000 Reviews</p>
          <button class="border-2 border-[#1E252C] text-[#1E252C] px-10 py-4 rounded-lg text-lg font-bold hover:bg-[#1E252C] hover:text-white transition-all shadow-sm hover:-translate-y-1">View More</button>
        </div>
        
        <div ref="customerCarouselRef" class="w-full lg:w-[70%] relative group">
          <button @click="scrollTesti('left')" class="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-c-red hover:text-white transition-colors active:scale-90 opacity-0 group-hover:opacity-100"><i class="fas fa-angle-left"></i></button>
          
          <div ref="testiCarouselRef" class="flex gap-6 overflow-x-auto p-4 snap-x snap-mandatory scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
            <!-- Testimonial 1 -->
            <div v-for="i in 4" :key="i" class="flex-shrink-0 w-[400px] bg-white rounded-2xl p-10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] snap-center">
              <div class="text-yellow-400 text-lg mb-6 space-x-1">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
              </div>
              <p class="font-bold text-[20px] text-[#1E252C] leading-relaxed mb-8 font-outfit italic">"A superior method to print. Inquire tas to whether you can utulize that you've made in yoru portfolio. More than Ink..."<br>Solutions.</p>
              <div class="flex items-center gap-4">
                <img src="/assets/testi-avatar-2.jpg" alt="Avatar" class="w-14 h-14 rounded-full object-cover">
                <div>
                  <h3 class="font-bold text-lg text-[#1E252C] m-0">John Doe</h3>
                  <h5 class="text-gray-400 text-sm font-normal m-0 mt-1">/ Orlando, FL</h5>
                </div>
              </div>
            </div>
          </div>
          
          <button @click="scrollTesti('right')" class="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-c-red hover:text-white transition-colors active:scale-90 opacity-0 group-hover:opacity-100"><i class="fas fa-angle-right"></i></button>
        </div>
      </div>
    </section>

    <!-- Seventh Container (Team) -->
    <section ref="teamSectionRef" class="py-32 relative overflow-hidden bg-white text-center">
      <div ref="teamTitleRef" class="mb-20">
        <p class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold mb-6 uppercase text-sm tracking-wider shadow-sm">OUR TEAM</p>
        <h2 class="text-[55px] font-black font-outfit text-[#1E252C] tracking-tight">We are the best team</h2>
      </div>

      <div class="relative group max-w-[100vw]">
        <button @click="scrollTeam('left')" class="absolute left-4 md:left-10 top-[40%] -translate-y-1/2 z-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-white hover:bg-c-red transition-colors active:scale-90 opacity-0 group-hover:opacity-100 text-2xl"><i class="fas fa-angle-left"></i></button>
        
        <div ref="teamCarouselRef" class="flex gap-8 overflow-x-auto px-4 md:px-20 pb-16 snap-x snap-mandatory scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
          <div class="shrink-0 w-[350px] rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] bg-white snap-center group/card cursor-pointer transition-all duration-300 hover:-translate-y-2">
            <div class="relative overflow-hidden bg-blue-50">
              <img src="/assets/member-21.png" class="w-full h-[400px] object-cover object-top transition-transform duration-700 group-hover/card:scale-110">
            </div>
            <div class="p-8 text-center bg-white relative z-10">
              <h3 class="text-[26px] font-bold font-outfit text-[#1E252C] mb-2">John Doe</h3>
              <p class="text-gray-500 font-poppins text-[17px]">President & CEO</p>
            </div>
          </div>
          <div class="shrink-0 w-[350px] rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] bg-white snap-center group/card cursor-pointer transition-all duration-300 hover:-translate-y-2">
            <div class="relative overflow-hidden bg-yellow-50">
              <img src="/assets/member-22.png" class="w-full h-[400px] object-cover object-top transition-transform duration-700 group-hover/card:scale-110">
            </div>
            <div class="p-8 text-center bg-white relative z-10">
              <h3 class="text-[26px] font-bold font-outfit text-[#1E252C] mb-2">Mariana Lous</h3>
              <p class="text-gray-500 font-poppins text-[17px]">Designer</p>
            </div>
          </div>
          <div class="shrink-0 w-[350px] rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] bg-white snap-center group/card cursor-pointer transition-all duration-300 hover:-translate-y-2">
            <div class="relative overflow-hidden bg-pink-50">
              <img src="/assets/member-23.png" class="w-full h-[400px] object-cover object-top transition-transform duration-700 group-hover/card:scale-110">
            </div>
            <div class="p-8 text-center bg-white relative z-10">
              <h3 class="text-[26px] font-bold font-outfit text-[#1E252C] mb-2">Stephan Mearsley</h3>
              <p class="text-gray-500 font-poppins text-[17px]">Developer</p>
            </div>
          </div>
          <div class="shrink-0 w-[350px] rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] bg-white snap-center group/card cursor-pointer transition-all duration-300 hover:-translate-y-2">
            <div class="relative overflow-hidden bg-green-50">
              <img src="/assets/member-24.png" class="w-full h-[400px] object-cover object-top transition-transform duration-700 group-hover/card:scale-110">
            </div>
            <div class="p-8 text-center bg-white relative z-10">
              <h3 class="text-[26px] font-bold font-outfit text-[#1E252C] mb-2">Pablo Brock</h3>
              <p class="text-gray-500 font-poppins text-[17px]">Project Manager</p>
            </div>
          </div>
          <div class="shrink-0 w-[350px] rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] bg-white snap-center group/card cursor-pointer transition-all duration-300 hover:-translate-y-2">
            <div class="relative overflow-hidden bg-purple-50">
              <img src="/assets/member-21.png" class="w-full h-[400px] object-cover object-top transition-transform duration-700 group-hover/card:scale-110">
            </div>
            <div class="p-8 text-center bg-white relative z-10">
              <h3 class="text-[26px] font-bold font-outfit text-[#1E252C] mb-2">Bryon Cory</h3>
              <p class="text-gray-500 font-poppins text-[17px]">Copy Writer</p>
            </div>
          </div>
        </div>
        
        <button @click="scrollTeam('right')" class="absolute right-4 md:right-10 top-[40%] -translate-y-1/2 z-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-white hover:bg-c-red transition-colors active:scale-90 opacity-0 group-hover:opacity-100 text-2xl"><i class="fas fa-angle-right"></i></button>
      </div>
    </section>

    <!-- Eighth Container (Ready to buy bulk) -->
    <section ref="bulkSectionRef" class="py-32 md:py-40 bg-[url('/assets/bg-red.png')] bg-c-red text-center text-white relative">
       <!-- Use standard background if bg-red.png not found, fallback to red color -->
       <div class="max-w-4xl mx-auto px-4 relative z-10">
         <h1 :ref="el => { if(el) bulkContentRefs[0] = el as HTMLElement }" class="text-4xl md:text-[65px] font-black font-outfit mb-8 leading-[1.1] tracking-tight">Ready to buy in bulk &<br>save up to 30%?</h1>
         <h2 :ref="el => { if(el) bulkContentRefs[1] = el as HTMLElement }" class="text-xl md:text-[22px] font-bold font-poppins mb-12 opacity-90">Printed and shipped on demand!</h2>
         <button :ref="el => { if(el) bulkContentRefs[2] = el as HTMLElement }" class="bg-white text-[#1E252C] font-bold text-lg md:text-xl px-14 py-5 rounded-lg hover:scale-105 transition-transform duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">Shop Now</button>
       </div>
       <div class="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-10 mix-blend-overlay">
          <img src="/assets/elip-sale-31.png" class="w-full max-w-[1000px] object-contain animate-[spin_60s_linear_infinite]">
       </div>
    </section>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
