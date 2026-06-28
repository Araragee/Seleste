<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const articles = [
  { image: '/assets/blog-color-1.jpg', tags: ['Print Company', 'Print Shop'], title: 'Are you ready to make it awesome', date: 'May 23, 2021', author: 'admin' },
  { image: '/assets/blog-color-2.jpg', tags: ['Print Shop'], title: 'Last printing website you need for WordPress', date: 'May 23, 2021', author: 'admin' },
  { image: '/assets/blog-color-3.jpg', tags: ['Print Company'], title: 'The best print WordPress theme', date: 'May 23, 2021', author: 'admin' },
]

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement[]>([])

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })

  tl.from(headerRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' })
    .from(cardsRef.value, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1)'
    }, "-=0.2")
})
</script>
<template>
  <section ref="sectionRef" class="py-32 px-4 md:px-10 lg:px-20 bg-white">
    <div ref="headerRef" class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
      <div>
        <p class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold mb-4 uppercase tracking-wider text-sm">Our Blog</p>
        <h1 class="text-4xl md:text-[55px] font-black font-outfit tracking-tight text-[#1E252C]">Articles daily updated</h1>
        <p class="text-gray-500 leading-relaxed mt-4 text-[18px] font-poppins">Get inspiration, updates, tips, &amp; other assorted awesomeness.</p>
      </div>
      <a href="#" class="inline-flex items-center gap-3 font-bold text-[#1E252C] hover:text-c-red transition-colors shrink-0">
        Read Latest Articles <i class="fas fa-angle-right"></i>
      </a>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <article
        v-for="(article, i) in articles"
        :key="article.title"
        :ref="el => { if(el) cardsRef[i] = el as HTMLElement }"
        class="group bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2"
      >
        <div class="overflow-hidden">
          <img :src="article.image" :alt="article.title" draggable="false" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="p-8">
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in article.tags" :key="tag" class="text-[11px] font-bold uppercase tracking-wider text-c-red bg-red-50 px-3 py-1 rounded-full">{{ tag }}</span>
          </div>
          <h3 class="text-2xl font-bold font-outfit leading-snug text-[#1E252C] mb-6 group-hover:text-c-red transition-colors">{{ article.title }}</h3>
          <div class="flex items-center gap-3 text-gray-400 text-sm font-poppins">
            <span>{{ article.date }}</span>
            <span class="w-6 h-px bg-gray-300"></span>
            <span>by <span class="font-bold text-[#1E252C]">{{ article.author }}</span></span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
