<script setup lang="ts">
import { ref } from 'vue'

const openIndex = ref(0)
const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}

const companyCarouselRef = ref<HTMLElement | null>(null)
const teamCarouselRef = ref<HTMLElement | null>(null)
const testiCarouselRef = ref<HTMLElement | null>(null)

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
    <section class="py-24 px-4 md:px-10 max-w-5xl mx-auto text-center">
      <p class="inline-block bg-c-green/10 text-c-green px-5 py-2 rounded-full font-medium mb-6 uppercase tracking-wider text-sm">WE ARE PROFESSIONAL</p>
      <h2 class="text-4xl md:text-[50px] font-black font-outfit leading-tight mb-8 text-[#1E252C]">We’re something other than duplicates…<br>What’s more, we do it right!</h2>
      <p class="text-xl text-gray-500 leading-relaxed font-poppins">Printing organization mottos While the Internet might assume control of numerous parts<br>of printing, a few things are as yet favored on paper.</p>
    </section>

    <!-- 6 Features Grid -->
    <section class="pb-24 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all bg-white group hover:-translate-y-1">
          <div class="shrink-0 group-hover:scale-110 transition-transform"><img src="/assets/icons8-computer-60.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Top quality prints using the latest technology</h3><p class="text-gray-500 leading-relaxed font-poppins m-0">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all bg-white group hover:-translate-y-1">
          <div class="shrink-0 group-hover:scale-110 transition-transform"><img src="/assets/icons8-rgb-96.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Mix and match colors, sizes, <br>and designs</h3><p class="text-gray-500 leading-relaxed font-poppins m-0">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all bg-white group hover:-translate-y-1">
          <div class="shrink-0 group-hover:scale-110 transition-transform"><img src="/assets/icons8-location-100.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Shipping worldwide</h3><p class="text-gray-500 leading-relaxed font-poppins m-0">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all bg-white group hover:-translate-y-1">
          <div class="shrink-0 group-hover:scale-110 transition-transform"><img src="/assets/icons8-box-100.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Made-to-measure<br>packaging</h3><p class="text-gray-500 leading-relaxed font-poppins m-0">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all bg-white group hover:-translate-y-1">
          <div class="shrink-0 group-hover:scale-110 transition-transform"><img src="/assets/icons8-consumable-64.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Reorder quickly and easily</h3><p class="text-gray-500 leading-relaxed font-poppins m-0">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
        
        <div class="flex items-start gap-6 p-8 border border-gray-100 rounded-[20px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all bg-white group hover:-translate-y-1">
          <div class="shrink-0 group-hover:scale-110 transition-transform"><img src="/assets/icons8-leaf-96.png" class="w-12 h-12 object-contain"></div>
          <div><h3 class="text-xl font-bold font-outfit mb-3 text-[#1E252C]">Environmentally friendly<br>production processes</h3><p class="text-gray-500 leading-relaxed font-poppins m-0">Lorem ipsum det, consec tetur adipiscing elit duis nec fringi</p></div>
        </div>
      </div>
    </section>

    <!-- Third Container: Accordions & Video -->
    <section class="py-24 bg-[#1E252C] relative overflow-hidden px-4 md:px-10 lg:px-20 text-white">
      <!-- Particles Background (using global particles but scoped via absolute) -->
      <div id="particle-container" class="absolute inset-0 pointer-events-none opacity-50"><div class="particle" v-for="n in 30" :key="n"></div></div>
      
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative z-10 items-center">
        <div class="w-full lg:w-[45%]">
           <p class="text-c-red font-bold tracking-wider mb-4 uppercase text-sm">Fast and quality services</p>
           <h2 class="text-4xl md:text-[50px] font-black font-outfit mb-10 leading-tight">Let us show you <br>how your products <br>come to life</h2>
           
           <div class="space-y-4">
              <div v-for="(faq, index) in faqs" :key="index" class="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300">
                <button @click="toggle(index)" class="w-full text-left px-6 py-5 font-bold text-lg text-white hover:text-c-red transition-colors flex items-center gap-4 focus:outline-none font-outfit group relative">
                  <span class="w-6 h-6 rounded-full border border-gray-500 flex items-center justify-center shrink-0 group-hover:border-c-red transition-colors" :class="{'bg-c-red border-c-red': openIndex === index}">
                    <span v-if="openIndex === index" class="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                  {{ faq.question }}
                </button>
                <div v-show="openIndex === index" class="px-6 pb-6 pl-16 text-gray-400 leading-relaxed">
                  <p class="m-0 text-base">{{ faq.answer }}</p>
                </div>
              </div>
           </div>
        </div>
        <div class="w-full lg:w-[55%] flex justify-center lg:justify-end">
           <video class="w-full max-w-[650px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-700" controls>
              <source src="/assets/Toad The Wet Sprocket - Fly From Heaven.mp4" type="video/mp4">
           </video>
        </div>
      </div>
    </section>

    <!-- Fourth Container (Best shipping rates) -->
    <section class="py-24 px-4 md:px-10 lg:px-20 bg-white">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div class="w-full lg:w-1/2 relative min-h-[500px]">
          <img src="/assets/banner-about-1.png" class="absolute top-0 right-10 w-[65%] rounded-2xl shadow-xl z-20">
          <img src="/assets/banner-about-2.png" class="absolute bottom-0 left-0 w-[60%] rounded-2xl shadow-xl z-10 border-4 border-white">
        </div>
        
        <div class="w-full lg:w-1/2">
          <p class="text-c-red font-bold tracking-wider mb-4 uppercase text-sm">Fast and quality service</p>
          <h1 class="text-4xl md:text-[50px] font-black font-outfit mb-6 leading-tight text-[#1E252C]">Best shipping rates<br>for print-on-demand<br>services</h1>
          <p class="text-gray-500 leading-relaxed font-poppins mb-10 text-lg">Fast print, flyer, and pamphlet printing organization. Pleased with our past. Printing for what’s to come. What’s more, we do it right! A full administration printing background.</p>
          
          <ul class="space-y-6">
            <li class="flex items-start gap-4">
              <span class="text-c-red mt-1 shrink-0 bg-red-50 p-1.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="currentColor" /></svg></span>
              <span class="font-bold text-[#1E252C] text-lg">Top quality prints using the latest technology</span>
            </li>
            <li class="flex items-start gap-4">
               <span class="text-c-red mt-1 shrink-0 bg-red-50 p-1.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="currentColor" /></svg></span>
              <span class="font-bold text-[#1E252C] text-lg">Mix and match colors, sizes, and designs</span>
            </li>
            <li class="flex items-start gap-4">
               <span class="text-c-red mt-1 shrink-0 bg-red-50 p-1.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="currentColor" /></svg></span>
              <span class="font-bold text-[#1E252C] text-lg">Shipping worldwide</span>
            </li>
            <li class="flex items-start gap-4">
               <span class="text-c-red mt-1 shrink-0 bg-red-50 p-1.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="currentColor" /></svg></span>
              <span class="font-bold text-[#1E252C] text-lg">Printed locally, worn globally.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Fifth Container (Companies) -->
    <section class="py-16 bg-gray-50 border-t border-b border-gray-100 relative group overflow-hidden">
      <div class="text-center mb-10 text-gray-400 font-bold tracking-widest text-sm">JOIN THE 10.000+ COMPANIES TRUSTING PRICOM</div>
      
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
    <section class="py-24 bg-[linear-gradient(135deg,rgba(255,206,236,0.3)_0%,rgba(152,150,240,0.3)_100%)]">
      <div class="max-w-7xl mx-auto px-4 md:px-10 flex flex-col lg:flex-row gap-12 items-center">
        <div class="w-full lg:w-[30%]">
          <h2 class="text-[50px] font-black font-outfit leading-tight mb-4 text-[#1E252C]">Customer<br>Love</h2>
          <p class="text-gray-600 text-lg mb-8 font-poppins">Over 10000 Reviews</p>
          <button class="border-2 border-black text-black px-8 py-3 rounded text-base font-bold hover:bg-black hover:text-white transition-colors">View More</button>
        </div>
        
        <div class="w-full lg:w-[70%] relative group">
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
    <section class="py-24 relative overflow-hidden bg-white text-center">
      <div class="mb-16">
        <p class="inline-block bg-c-green/10 text-c-green px-5 py-2 rounded-full font-medium mb-4 uppercase text-sm tracking-wider">OUR TEAM</p>
        <h2 class="text-[50px] font-black font-outfit text-[#1E252C]">We are the best team</h2>
      </div>

      <div class="relative group max-w-[100vw]">
        <button @click="scrollTeam('left')" class="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-white hover:bg-c-red transition-colors active:scale-90 opacity-0 group-hover:opacity-100 text-xl"><i class="fas fa-angle-left"></i></button>
        
        <div ref="teamCarouselRef" class="flex gap-8 overflow-x-auto px-4 md:px-20 pb-10 snap-x snap-mandatory scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
          <div class="shrink-0 w-[320px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white snap-center group/card cursor-pointer">
            <div class="relative overflow-hidden bg-blue-50">
              <img src="/assets/member-21.png" class="w-full h-[350px] object-cover object-top transition-transform duration-500 group-hover/card:scale-110">
            </div>
            <div class="p-6 text-center">
              <h3 class="text-2xl font-bold font-outfit text-[#1E252C] mb-1">John Doe</h3>
              <p class="text-gray-500">President & CEO</p>
            </div>
          </div>
          <div class="shrink-0 w-[320px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white snap-center group/card cursor-pointer">
            <div class="relative overflow-hidden bg-yellow-50">
              <img src="/assets/member-22.png" class="w-full h-[350px] object-cover object-top transition-transform duration-500 group-hover/card:scale-110">
            </div>
            <div class="p-6 text-center">
              <h3 class="text-2xl font-bold font-outfit text-[#1E252C] mb-1">Mariana Lous</h3>
              <p class="text-gray-500">Designer</p>
            </div>
          </div>
          <div class="shrink-0 w-[320px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white snap-center group/card cursor-pointer">
            <div class="relative overflow-hidden bg-pink-50">
              <img src="/assets/member-23.png" class="w-full h-[350px] object-cover object-top transition-transform duration-500 group-hover/card:scale-110">
            </div>
            <div class="p-6 text-center">
              <h3 class="text-2xl font-bold font-outfit text-[#1E252C] mb-1">Stephan Mearsley</h3>
              <p class="text-gray-500">Developer</p>
            </div>
          </div>
          <div class="shrink-0 w-[320px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white snap-center group/card cursor-pointer">
            <div class="relative overflow-hidden bg-green-50">
              <img src="/assets/member-24.png" class="w-full h-[350px] object-cover object-top transition-transform duration-500 group-hover/card:scale-110">
            </div>
            <div class="p-6 text-center">
              <h3 class="text-2xl font-bold font-outfit text-[#1E252C] mb-1">Pablo Brock</h3>
              <p class="text-gray-500">Project Manager</p>
            </div>
          </div>
          <div class="shrink-0 w-[320px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white snap-center group/card cursor-pointer">
            <div class="relative overflow-hidden bg-purple-50">
              <img src="/assets/member-21.png" class="w-full h-[350px] object-cover object-top transition-transform duration-500 group-hover/card:scale-110">
            </div>
            <div class="p-6 text-center">
              <h3 class="text-2xl font-bold font-outfit text-[#1E252C] mb-1">Bryon Cory</h3>
              <p class="text-gray-500">Copy Writer</p>
            </div>
          </div>
        </div>
        
        <button @click="scrollTeam('right')" class="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-white hover:bg-c-red transition-colors active:scale-90 opacity-0 group-hover:opacity-100 text-xl"><i class="fas fa-angle-right"></i></button>
      </div>
    </section>

    <!-- Eighth Container (Ready to buy bulk) -->
    <section class="py-24 md:py-32 bg-[url('/assets/bg-red.png')] bg-c-red text-center text-white relative">
       <!-- Use standard background if bg-red.png not found, fallback to red color -->
       <div class="max-w-4xl mx-auto px-4 relative z-10">
         <h1 class="text-4xl md:text-[55px] font-black font-outfit mb-6 leading-tight">Ready to buy in bulk &<br>save up to 30%?</h1>
         <h2 class="text-xl md:text-2xl font-bold font-poppins mb-10 opacity-90">Printed and shipped on demand!</h2>
         <button class="bg-white text-black font-bold text-base md:text-lg px-12 py-4 rounded hover:bg-black hover:text-white transition-colors duration-300 shadow-xl shadow-black/20">Shop Now</button>
       </div>
       <div class="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-10">
          <img src="/assets/elip-sale-31.png" class="w-full max-w-[800px] object-contain">
       </div>
    </section>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
