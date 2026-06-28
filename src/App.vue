<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useHead } from '@unhead/vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import CartDrawer from './components/CartDrawer.vue'

useHead({
  titleTemplate: (title?: string) => (title ? `${title} | Pricom` : 'Pricom — 3D Printing & Print on Demand'),
  meta: [
    { name: 'description', content: 'Pricom delivers fast, high-quality 3D printing and print-on-demand services for businesses and creators.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Pricom' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>

<template>
  <DefaultLayout>
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </DefaultLayout>
  <CartDrawer />
</template>

<style>
/* Fast, snappy page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
