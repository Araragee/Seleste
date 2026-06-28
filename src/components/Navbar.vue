<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
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
      <router-link to="/" @click="closeMobileMenu">
        <img src="/assets/logo.png" alt="Pricom Logo" class="max-w-full h-auto pl-4">
      </router-link>
    </div>

    <div class="flex-1 text-center md:pl-[10%] hidden md:block">
      <ul class="inline-flex m-0 p-0 list-none">
        <li v-for="link in navLinks" :key="link.to">
          <router-link :to="link.to" class="inline-block px-5 py-2.5 text-c-black text-base hover:text-c-red no-underline transition-colors" active-class="text-c-red">{{ link.label }}</router-link>
        </li>
      </ul>
    </div>

    <div class="flex items-center gap-4">
      <div class="w-10 h-10 rounded-full bg-c-light-gray flex justify-center items-center">
        <!-- Cart Icon Placeholder -->
        <button aria-label="Cart" class="bg-[url('/assets/cart.png')] bg-[length:80%] bg-no-repeat bg-center border-none w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity"></button>
      </div>

      <div class="hidden lg:flex flex-col text-right">
        <span class="text-sm">Hotline</span>
        <span class="text-c-red font-bold font-roboto">00 1900 8188</span>
      </div>

      <button class="bg-c-black text-white rounded-[5px] px-5 py-3.5 text-base font-bold transition-colors duration-300 hover:bg-c-red hidden md:block">
        Start A Project
      </button>

      <!-- Hamburger Menu for Mobile -->
      <button
        type="button"
        aria-label="Toggle menu"
        :aria-expanded="isMobileMenuOpen"
        @click="toggleMobileMenu"
        class="md:hidden flex flex-col justify-center gap-1.5 p-2"
      >
        <span :class="['block w-6 h-[2px] bg-black transition-transform duration-300', { 'translate-y-2 rotate-45': isMobileMenuOpen }]"></span>
        <span :class="['block w-6 h-[2px] bg-black transition-opacity duration-300', { 'opacity-0': isMobileMenuOpen }]"></span>
        <span :class="['block w-6 h-[2px] bg-black transition-transform duration-300', { '-translate-y-2 -rotate-45': isMobileMenuOpen }]"></span>
      </button>
    </div>

    <!-- Mobile Menu Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-show="isMobileMenuOpen" class="md:hidden w-full mt-4 basis-full">
        <ul class="flex flex-col gap-1 list-none m-0 p-0">
          <li v-for="link in navLinks" :key="link.to">
            <router-link :to="link.to" @click="closeMobileMenu" class="block px-4 py-3 text-c-black text-base hover:text-c-red hover:bg-c-light-gray rounded-md no-underline transition-colors" active-class="text-c-red">{{ link.label }}</router-link>
          </li>
          <li class="mt-2">
            <button @click="closeMobileMenu" class="w-full bg-c-black text-white rounded-[5px] px-5 py-3.5 text-base font-bold transition-colors duration-300 hover:bg-c-red">
              Start A Project
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </nav>
</template>
