<script setup lang="ts">
</script>

<template>
  <section class="h-auto px-10 py-10 lg:px-20 lg:py-10 flex justify-center relative overflow-hidden">
    <!-- Particles container from legacy/particles.css is linked globally -->
    <div id="particle-container" class="absolute inset-0 pointer-events-none z-0">
      <div class="particle" v-for="n in 30" :key="n"></div>
    </div>
    
    <div class="flex flex-col md:flex-row items-center justify-center h-auto m-0 w-full z-10 relative">
      <div class="w-full md:w-[45%] h-full mx-auto md:pr-8">
        <h2 class="text-c-green bg-c-green/10 inline-block p-2 rounded text-base font-bold mb-4 font-outfit">PRINTING MADE EASIER</h2>
        <h1 class="mb-5 mt-2.5 text-4xl md:text-5xl lg:text-6xl text-c-black font-black font-outfit">Your 3D Printing Services</h1>
        <h3 class="text-xl md:text-2xl mb-2.5 leading-relaxed inline-block text-gray-500 font-normal">Whats more, we do it right! A full administration printing background.</h3>
        
        <div class="mt-8 flex flex-wrap gap-4">
          <button class="bg-c-red text-white py-3.5 px-11 text-base font-bold rounded hover:opacity-90 transition-opacity">Let's Talk</button>
          <button class="bg-transparent text-black py-3.5 px-6 text-base font-bold rounded hover:text-c-red transition-colors">How We Work</button>
        </div>
      </div>
      
      <div class="w-full md:w-[55%] h-full mx-auto mt-10 md:mt-0">
        <img src="/assets/top-banner-12.png" alt="3D Printing Computer" class="block w-full h-full mx-auto transition-transform duration-200 hover:-translate-y-1">
      </div>
    </div>
  </section>
</template>
