<script setup lang="ts">
import { ref } from 'vue'

const carouselRef = ref<HTMLElement | null>(null)

const scroll = (direction: 'left' | 'right') => {
  if (carouselRef.value) {
    const scrollAmount = 350
    carouselRef.value.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }
}
</script>
<template>
  <section class="bg-white py-20 px-10 md:px-20 relative text-left">
    <div class="mb-10 min-w-full">
      <p class="inline-block bg-c-green/10 text-c-green px-5 py-2 rounded-full font-medium mb-4">Our Materials</p>
      <h1 class="text-4xl md:text-5xl font-black font-outfit text-black m-0 mt-2">Available 3D printing materials</h1>
    </div>

    <div class="relative flex items-center group w-full outline-none">
      <button @click="scroll('left')" class="absolute left-[-22px] z-10 w-11 h-11 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-transform active:scale-90 opacity-0 group-hover:opacity-100">
        <i class="fas fa-angle-left"></i>
      </button>
      
      <div ref="carouselRef" class="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-2" style="scrollbar-width: none; -ms-overflow-style: none;">
        <img src="/assets/banner-12-4.jpg" alt="Material 1" class="snap-start rounded-md object-cover w-[330px] h-auto flex-shrink-0 select-none">
        <img src="/assets/banner-12-5.png" alt="Material 2" class="snap-start rounded-md object-cover w-[330px] h-auto flex-shrink-0 select-none">
        <img src="/assets/banner-12-6.jpg" alt="Material 3" class="snap-start rounded-md object-cover w-[330px] h-auto flex-shrink-0 select-none">
        <img src="/assets/banner-12-7.jpg" alt="Material 4" class="snap-start rounded-md object-cover w-[330px] h-auto flex-shrink-0 select-none">
        <img src="/assets/banner-12-8.jpg" alt="Material 5" class="snap-start rounded-md object-cover w-[330px] h-auto flex-shrink-0 select-none">
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
