<script setup lang="ts">
import HomeMarquee from '../components/home/HomeMarquee.vue'
import HomeHero from '../components/home/HomeHero.vue'
import HomeHowItWorks from '../components/home/HomeHowItWorks.vue'
import HomeMaterials from '../components/home/HomeMaterials.vue'
import HomeWhyUs from '../components/home/HomeWhyUs.vue'
import HomeStats from '../components/home/HomeStats.vue'
import HomeTestimonials from '../components/home/HomeTestimonials.vue'
import HomeFaqs from '../components/home/HomeFaqs.vue'
import HomePricing from '../components/home/HomePricing.vue'
import HomeArticles from '../components/home/HomeArticles.vue'
import HomeBottom from '../components/home/HomeBottom.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Home',
  meta: [{ name: 'description', content: 'Pricom — fast, high-quality 3D printing and print-on-demand services for businesses and creators.' }],
})
</script>

<template>
  <div>
    <HomeMarquee />
    <HomeHero />
    <HomeHowItWorks />
    <HomeMaterials />
    <HomeWhyUs />
    <HomeStats />
    <HomeTestimonials />
    <HomeFaqs />
    <HomePricing />
    <HomeArticles />
    <HomeBottom />
  </div>
</template>
