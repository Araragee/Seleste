<script setup lang="ts">
</script>
<template>
  <section class="py-20 relative bg-white overflow-hidden">
    <div class="container mx-auto px-4 md:px-10 flex flex-col items-center mb-12">
      <div class="relative w-full h-[150px] md:h-[200px] flex justify-center mb-8">
        <img src="/assets/decor-12-box-q438menvbv7qcyuac8herzth4t0zljqbmy2bxw0rnk.png" class="absolute left-10 top-0 w-16 md:w-24 animate-[bounce_3s_ease-in-out_infinite]">
        <img src="/assets/decor-12-smile.png" class="absolute right-[20%] top-[-20px] w-12 md:w-16">
        <img src="/assets/decor-12-heart-q438menvbv7qcyuac8herzth4t0zljqbmy2bxw0rnk.png" class="absolute left-[30%] bottom-0 w-12 md:w-16 animate-[pulse_2s_infinite]">
        <img src="/assets/decor-12-hand-q438menvbv7tu6sez624mlpksrd3pqytofsrhhqb5s.jpg" class="absolute right-10 bottom-0 w-16 md:w-24 border rounded-full">
      </div>
      
      <p class="inline-block bg-c-green/10 text-c-green px-5 py-2 rounded-full font-medium mb-4">Rated 4.9 of 5</p>
      <h1 class="text-4xl md:text-[50px] font-black font-outfit text-center">What our customers say</h1>
    </div>

    <div class="relative max-w-[100vw] group">
      <div class="flex gap-6 overflow-x-auto pb-10 px-4 md:px-10 snap-x snap-mandatory scrollbar-hide" ref="scrollContainer" style="scrollbar-width: none; -ms-overflow-style: none;">
        
        <div class="flex-shrink-0 w-[300px] md:w-[400px] bg-white border border-gray-100 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-shadow snap-center">
          <div class="text-yellow-400 text-lg mb-4 space-x-1">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
          <p class="text-gray-500 leading-relaxed mb-8 font-poppins italic">“For all your printing prerequisites. Offer to make and print their pamphlets, business cards, solicitations, and occasion programs.”</p>
          <img src="/assets/logo-spotify-2.png" alt="Spotify" class="h-8 object-contain">
        </div>
        
        <div class="flex-shrink-0 w-[300px] md:w-[400px] bg-white border border-gray-100 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-shadow snap-center">
          <div class="text-yellow-400 text-lg mb-4 space-x-1">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star text-gray-300"></i>
          </div>
          <p class="text-gray-500 leading-relaxed mb-8 font-poppins italic">“For all your printing prerequisites. Offer to make and print their pamphlets, business cards, solicitations, and occasion programs.”</p>
          <img src="/assets/logo-hopin-2.png" alt="Hopin" class="h-8 object-contain">
        </div>
        
        <div class="flex-shrink-0 w-[300px] md:w-[400px] bg-white border border-gray-100 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-shadow snap-center">
          <div class="text-yellow-400 text-lg mb-4 space-x-1">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
          <p class="text-gray-500 leading-relaxed mb-8 font-poppins italic">“For all your printing prerequisites. Offer to make and print their pamphlets, business cards, solicitations, and occasion programs.”</p>
          <img src="/assets/logo-amazon-2.png" alt="Amazon" class="h-6 object-contain mt-2">
        </div>
        
        <div class="flex-shrink-0 w-[300px] md:w-[400px] bg-white border border-gray-100 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-shadow snap-center">
          <div class="text-yellow-400 text-lg mb-4 space-x-1">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
          <p class="text-gray-500 leading-relaxed mb-8 font-poppins italic">“For all your printing prerequisites. Offer to make and print their pamphlets, business cards, solicitations, and occasion programs.”</p>
          <img src="/assets/logo-ebay.png" alt="Ebay" class="h-8 object-contain">
        </div>
      </div>
    </div>
    
    <div class="text-center mt-6">
      <button class="bg-c-red text-white py-4 px-10 rounded text-base font-bold hover:bg-black transition-colors shadow-lg shadow-red-500/30">Get Instant Quote</button>
    </div>
  </section>
</template>
