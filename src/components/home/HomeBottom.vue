<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const featuresRef = ref<HTMLElement[]>([])
const featureSectionRef = ref<HTMLElement | null>(null)

const appSectionRef = ref<HTMLElement | null>(null)
const appTitleRef = ref<HTMLElement | null>(null)
const appDescRef = ref<HTMLElement | null>(null)
const appDownloadRef = ref<HTMLElement | null>(null)
const appImageRef = ref<HTMLElement | null>(null)

const socialSectionRef = ref<HTMLElement | null>(null)
const socialBtnsRef = ref<HTMLElement[]>([])

onMounted(() => {
  // Features section
  gsap.from(featuresRef.value, {
    scrollTrigger: { trigger: featureSectionRef.value, start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out'
  })

  // App section
  const tlApp = gsap.timeline({
    scrollTrigger: { trigger: appSectionRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  tlApp.from(appTitleRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' })
       .from(appDescRef.value, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, "-=0.3")
       .from(appDownloadRef.value, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, "-=0.3")
       .from(appImageRef.value, { x: 50, opacity: 0, duration: 0.7, ease: 'back.out(1.2)' }, "-=0.5")

  // Social section
  gsap.from(socialBtnsRef.value, {
    scrollTrigger: { trigger: socialSectionRef.value, start: 'top 95%', toggleActions: 'play none none reverse' },
    y: 20, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1)'
  })
})
</script>
<template>
  <div class="bg-white pb-32">
    <section ref="featureSectionRef" class="border-t border-b border-gray-100 py-24 bg-white overflow-x-auto">
      <div class="container mx-auto px-4 flex justify-between gap-8 min-w-[800px] lg:min-w-0 flex-wrap lg:flex-nowrap">
        <div :ref="el => { if(el) featuresRef[0] = el as HTMLElement }" class="flex items-center gap-6 p-6 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 cursor-default flex-1 bg-white border border-transparent hover:border-gray-100">
          <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0">
            <img src="/assets/global-navigation.png" class="w-10 opacity-80 mix-blend-multiply">
          </div>
          <div>
            <h3 class="text-xl font-bold font-outfit m-0">Worldwide Shipping</h3>
            <p class="text-gray-500 text-sm mt-1 m-0 leading-snug">Get free shipping over $65.</p>
          </div>
        </div>
        
        <div :ref="el => { if(el) featuresRef[1] = el as HTMLElement }" class="flex items-center gap-6 p-6 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 cursor-default flex-1 bg-white border border-transparent hover:border-gray-100">
          <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0">
            <img src="/assets/delivery.png" class="w-10 opacity-80 mix-blend-multiply">
          </div>
          <div>
            <h3 class="text-xl font-bold font-outfit m-0">Free Returns</h3>
            <p class="text-gray-500 text-sm mt-1 m-0 leading-snug">Within 30 days for an exchange.</p>
          </div>
        </div>
        
        <div :ref="el => { if(el) featuresRef[2] = el as HTMLElement }" class="flex items-center gap-6 p-6 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 cursor-default flex-1 bg-white border border-transparent hover:border-gray-100">
          <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0">
            <img src="/assets/support.png" class="w-10 opacity-80 mix-blend-multiply">
          </div>
          <div>
            <h3 class="text-xl font-bold font-outfit m-0">24/7 Support</h3>
            <p class="text-gray-500 text-sm mt-1 m-0 leading-snug">Top notch customer service.</p>
          </div>
        </div>
        
        <div :ref="el => { if(el) featuresRef[3] = el as HTMLElement }" class="flex items-center gap-6 p-6 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 cursor-default flex-1 bg-white border border-transparent hover:border-gray-100">
          <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0">
            <img src="/assets/credit-card.png" class="w-10 opacity-80 mix-blend-multiply">
          </div>
          <div>
            <h3 class="text-xl font-bold font-outfit m-0">Flexible Payment</h3>
            <p class="text-gray-500 text-sm mt-1 m-0 leading-snug">Pay with Multiple Credit Cards</p>
          </div>
        </div>
      </div>
    </section>

    <!-- App Section -->
    <section ref="appSectionRef" class="bg-[#F0F4FC] rounded-[40px] mx-4 md:mx-10 lg:mx-20 mt-24 pt-16 px-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center shadow-inner">
      <div class="w-full md:w-[45%] z-10 pb-16 md:pl-8">
        <h2 ref="appTitleRef" class="text-4xl md:text-[55px] font-black font-outfit leading-[1.1] text-[#1E252C] m-0 mb-6 tracking-tight">Shop Faster with<br>Pricom App</h2>
        <h5 ref="appDescRef" class="text-xl text-[#7A7A7A] m-0 mb-10 font-normal font-poppins">Available for iOS and Android</h5>
        
        <div ref="appDownloadRef" class="mt-8">
          <h3 class="text-[22px] font-bold mb-6 text-[#1E252C] font-outfit">Download our<br>app today</h3>
          <div class="flex gap-4">
            <a href="#" class="hover:-translate-y-1 transition-transform drop-shadow hover:drop-shadow-md duration-300"><img src="/assets/google-play.png" alt="Google Play" class="h-14 w-auto object-contain"></a>
            <a href="#" class="hover:-translate-y-1 transition-transform drop-shadow hover:drop-shadow-md duration-300"><img src="/assets/app-store.png" alt="App Store" class="h-14 w-auto object-contain"></a>
          </div>
        </div>
      </div>
      
      <div class="w-full md:w-[50%] flex justify-end relative h-[450px] md:h-[550px]">
        <img ref="appImageRef" src="/assets/banner-app-3.png" alt="Smartphone App" class="absolute bottom-0 right-[-5%] w-[90%] md:w-auto h-auto max-h-[110%] origin-bottom-right object-contain hover:scale-105 transition-transform duration-500 hover:drop-shadow-2xl">
      </div>
    </section>

    <!-- Social Section -->
    <section ref="socialSectionRef" class="py-24 mb-[-4rem]">
      <div class="container mx-auto px-4">
        <ul class="flex flex-wrap justify-center gap-6 list-none p-0 m-0">
          <li :ref="el => { if(el) socialBtnsRef[0] = el as HTMLElement }"><button class="bg-[#3B5998] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3B5998]/30 min-w-[140px] text-[15px] uppercase tracking-wider">Facebook</button></li>
          <li :ref="el => { if(el) socialBtnsRef[1] = el as HTMLElement }"><button class="bg-[#1DA1F2] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1DA1F2]/30 min-w-[140px] text-[15px] uppercase tracking-wider">Twitter</button></li>
          <li :ref="el => { if(el) socialBtnsRef[2] = el as HTMLElement }"><button class="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#DD2A7B]/30 min-w-[140px] text-[15px] uppercase tracking-wider">Instagram</button></li>
          <li :ref="el => { if(el) socialBtnsRef[3] = el as HTMLElement }"><button class="bg-[#FF0000] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF0000]/30 min-w-[140px] text-[15px] uppercase tracking-wider">Youtube</button></li>
          <li :ref="el => { if(el) socialBtnsRef[4] = el as HTMLElement }"><button class="bg-[#1AB7EA] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1AB7EA]/30 min-w-[140px] text-[15px] uppercase tracking-wider">Vimeo</button></li>
        </ul>
      </div>
    </section>
  </div>
</template>
