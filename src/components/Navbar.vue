<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav :class="['sticky top-0 z-50 flex flex-wrap items-center justify-between px-5 py-4 transition-all duration-300 backdrop-blur-md bg-white/80', { 'shadow-[0_10px_30px_rgba(0,0,0,0.05)]': isScrolled }]">
    <div class="flex-none logo">
      <router-link to="/">
        <img src="/assets/logo.png" alt="Pricom Logo" class="max-w-full h-auto pl-4">
      </router-link>
    </div>
    
    <div class="flex-1 text-center md:pl-[10%] hidden md:block">
      <ul class="inline-flex m-0 p-0 list-none">
        <li><router-link to="/" class="inline-block px-5 py-2.5 text-c-black text-base hover:text-c-red no-underline transition-colors">Home</router-link></li>
        <li><a href="#" class="inline-block px-5 py-2.5 text-c-black text-base hover:text-c-red no-underline transition-colors">Pricom</a></li>
        <li><a href="#" class="inline-block px-5 py-2.5 text-c-black text-base hover:text-c-red no-underline transition-colors">Shop</a></li>
        <li><a href="#" class="inline-block px-5 py-2.5 text-c-black text-base hover:text-c-red no-underline transition-colors">Blog</a></li>
        <li><a href="#" class="inline-block px-5 py-2.5 text-c-black text-base hover:text-c-red no-underline transition-colors">Pages</a></li>
      </ul>
    </div>
    
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 rounded-full bg-c-light-gray flex justify-center items-center">
        <!-- Cart Icon Placeholder -->
        <button class="bg-[url('/assets/cart.png')] bg-[length:80%] bg-no-repeat bg-center border-none w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity"></button>
      </div>
      
      <div class="hidden lg:flex flex-col text-right">
        <span class="text-sm">Hotline</span>
        <span class="text-c-red font-bold font-roboto">00 1900 8188</span>
      </div>
      
      <button class="bg-c-black text-white rounded-[5px] px-5 py-3.5 text-base font-bold transition-colors duration-300 hover:bg-c-red hidden md:block">
        Start A Project
      </button>
      
      <!-- Hamburger Menu for Mobile -->
      <button class="md:hidden flex flex-col gap-1 p-2">
        <span class="block w-6 h-[2px] bg-black"></span>
        <span class="block w-6 h-[2px] bg-black"></span>
        <span class="block w-6 h-[2px] bg-black"></span>
      </button>
    </div>
  </nav>
</template>
