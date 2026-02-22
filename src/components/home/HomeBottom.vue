<script setup lang="ts">
</script>
<template>
  <div class="bg-white pb-20">
    <section class="border-t border-b border-gray-100 py-16 bg-white overflow-x-auto">
      <div class="container mx-auto px-4 flex justify-between gap-8 min-w-[800px] lg:min-w-0 flex-wrap lg:flex-nowrap">
        <div class="flex items-center gap-6 p-4 rounded-xl hover:shadow-md transition-shadow cursor-default flex-1 bg-white">
          <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0">
            <img src="/assets/global-navigation.png" class="w-10 opacity-80 mix-blend-multiply">
          </div>
          <div>
            <h3 class="text-xl font-bold font-outfit m-0">Worldwide Shipping</h3>
            <p class="text-gray-500 text-sm mt-1 m-0 leading-snug">Get free shipping over $65.</p>
          </div>
        </div>
        
        <div class="flex items-center gap-6 p-4 rounded-xl hover:shadow-md transition-shadow cursor-default flex-1 bg-white">
          <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0">
            <img src="/assets/delivery.png" class="w-10 opacity-80 mix-blend-multiply">
          </div>
          <div>
            <h3 class="text-xl font-bold font-outfit m-0">Free Returns</h3>
            <p class="text-gray-500 text-sm mt-1 m-0 leading-snug">Within 30 days for an exchange.</p>
          </div>
        </div>
        
        <div class="flex items-center gap-6 p-4 rounded-xl hover:shadow-md transition-shadow cursor-default flex-1 bg-white">
          <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0">
            <img src="/assets/support.png" class="w-10 opacity-80 mix-blend-multiply">
          </div>
          <div>
            <h3 class="text-xl font-bold font-outfit m-0">24/7 Support</h3>
            <p class="text-gray-500 text-sm mt-1 m-0 leading-snug">Top notch customer service.</p>
          </div>
        </div>
        
        <div class="flex items-center gap-6 p-4 rounded-xl hover:shadow-md transition-shadow cursor-default flex-1 bg-white">
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
    <section class="bg-[#F0F4FC] rounded-3xl mx-4 md:mx-10 lg:mx-20 mt-20 pt-16 px-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center">
      <div class="w-full md:w-[45%] z-10 pb-16">
        <h2 class="text-4xl md:text-[55px] font-black font-outfit leading-tight text-[#1E252C] m-0 mb-4">Shop Faster with<br>Pricom App</h2>
        <h5 class="text-xl text-[#7A7A7A] m-0 mb-10 font-normal">Available for iOS and Android</h5>
        
        <div class="mt-8">
          <h3 class="text-[22px] font-bold mb-6 text-[#1E252C]">Download our<br>app today</h3>
          <div class="flex gap-4">
            <a href="#" class="hover:opacity-80 transition-opacity"><img src="/assets/google-play.png" alt="Google Play" class="h-12 w-auto"></a>
            <a href="#" class="hover:opacity-80 transition-opacity"><img src="/assets/app-store.png" alt="App Store" class="h-12 w-auto"></a>
          </div>
        </div>
      </div>
      
      <div class="w-full md:w-[50%] flex justify-end relative h-[400px] md:h-[500px]">
        <img src="/assets/banner-app-3.png" alt="Smartphone App" class="absolute bottom-0 right-0 w-[85%] md:w-auto h-auto max-h-[120%] origin-bottom-right object-contain">
      </div>
    </section>

    <!-- Social Section -->
    <section class="py-16 mb-[-4rem]">
      <div class="container mx-auto px-4">
        <ul class="flex flex-wrap justify-center gap-4 list-none p-0 m-0">
          <li><button class="bg-[#3B5998] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity min-w-[140px]">Facebook</button></li>
          <li><button class="bg-[#1DA1F2] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity min-w-[140px]">Twitter</button></li>
          <li><button class="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity min-w-[140px]">Instagram</button></li>
          <li><button class="bg-[#FF0000] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity min-w-[140px]">Youtube</button></li>
          <li><button class="bg-[#1AB7EA] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity min-w-[140px]">Vimeo</button></li>
        </ul>
      </div>
    </section>
  </div>
</template>
