<script setup lang="ts">
</script>
<template>
  <section class="flex flex-col items-center justify-center bg-gray-100 bg-[linear-gradient(135deg,rgba(255,206,236,0.2)_0%,rgba(152,150,240,0.2)_100%)] pb-20 overflow-hidden">
    <h2 class="mt-16 text-[40px] font-bold text-center mb-10">The power of user-led growth</h2>

    <div class="flex flex-wrap justify-center m-10 gap-8">
      <div class="flex flex-col justify-center items-center w-[258px] h-[239px] rounded-[10px] bg-white shadow-sm hover:shadow-md transition-shadow">
        <h1 class="text-[70px] font-bold mb-1 -mt-1 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">21<span class="text-[40px]">M</span></h1>
        <h3 class="text-[18px] text-[#999] text-center">Parts 3D printed</h3>
      </div>
      <div class="flex flex-col justify-center items-center w-[258px] h-[239px] rounded-[10px] bg-white shadow-sm hover:shadow-md transition-shadow">
        <h1 class="text-[70px] font-bold mb-1 -mt-1 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">10<span class="text-[40px]">+</span></h1>
        <h3 class="text-[18px] text-[#999] text-center">3D Printing Technologies</h3>
      </div>
      <div class="flex flex-col justify-center items-center w-[258px] h-[239px] rounded-[10px] bg-white shadow-sm hover:shadow-md transition-shadow">
        <h1 class="text-[70px] font-bold mb-1 -mt-1 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">90<span class="text-[40px]">+</span></h1>
        <h3 class="text-[18px] text-[#999] text-center">Materials & Finishings</h3>
      </div>
      <div class="flex flex-col justify-center items-center w-[258px] h-[239px] rounded-[10px] bg-white shadow-sm hover:shadow-md transition-shadow">
        <h1 class="text-[70px] font-bold mb-1 -mt-1 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">160</h1>
        <h3 class="text-[18px] text-[#999] text-center">Countries Shipped</h3>
      </div>
    </div>
    
    <div class="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-10 mt-10">
      <div class="w-full lg:w-1/2 relative lg:min-h-[600px] flex flex-col justify-center mb-16 lg:mb-0">
        <img src="/assets/banner-12-map.png" alt="map" class="absolute w-[80%] top-20 left-0 opacity-50 z-0">
        <div class="relative z-10 w-[80%]">
          <p class="inline-block bg-c-green/10 text-c-green px-5 py-2 rounded-full font-medium mb-6">They love us</p>
          <div class="text-yellow-400 text-xl space-x-1 mb-4 flex">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
          <h1 class="text-[50px] font-black font-outfit mb-5 leading-tight">100+ Manufacturing partners</h1>
          <h3 class="text-gray-500 font-normal leading-[1.6] mb-8 text-lg">3D printing is a term used to describe a number of additive manufacturing technologies that produce parts one layer at a time from a 3D digital model.</h3>
          <button class="bg-c-red text-white py-3.5 px-11 text-base font-bold rounded hover:opacity-90 transition-opacity">Get Instant Quote</button>
        </div>
      </div>
      
      <div class="w-full lg:w-1/2 relative flex justify-center items-center min-h-[400px]">
        <div class="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] border border-gray-300 rounded-full flex justify-center items-center border-dashed">
          <img src="/assets/logo-amazon-fill.png" alt="Amazon" class="absolute z-20 w-16 h-16 bg-white rounded-full shadow-lg p-2">
          
          <div class="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] border border-gray-300 rounded-full flex justify-center items-center border-dashed animate-[spin_40s_linear_infinite_reverse]">
             <img src="/assets/logo-google-fill.png" class="absolute top-0 right-0 w-12 h-12 bg-white rounded-full shadow-md p-2 animate-[spin_40s_linear_infinite]">
          </div>

          <div class="absolute w-full h-full animate-[spin_30s_linear_infinite] pointer-events-none">
            <img src="/assets/logo-feedly-fill.png" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md p-2 pointer-events-auto">
            <img src="/assets/logo-craft-fill.png" class="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md p-2 pointer-events-auto">
            <img src="/assets/logo-shopify-fill.png" class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md p-2 pointer-events-auto">
            <img src="/assets/logo-twitch-fill.png" class="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md p-2 pointer-events-auto">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
