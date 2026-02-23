<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const openIndex = ref(0)
const sectionRef = ref<HTMLElement | null>(null)
const prTag = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const faqRefs = ref<HTMLElement[]>([])

const faqs = [
  { question: 'What files do I need?', answer: '3D printing is a term used to describe a number of additive manufacturing technologies that produce parts one layer at a time from a 3D digital model.' },
  { question: 'Can I order a personalized gift?', answer: '3D printing is a term used to describe a number of additive manufacturing technologies that produce parts one layer at a time from a 3D digital model.' },
  { question: 'How long will my package take to arrive?', answer: '3D printing is a term used to describe a number of additive manufacturing technologies that produce parts one layer at a time from a 3D digital model.' },
  { question: 'What products can I customize?', answer: '3D printing is a term used to describe a number of additive manufacturing technologies that produce parts one layer at a time from a 3D digital model.' },
  { question: 'What options for finishes do you offer?', answer: '3D printing is a term used to describe a number of additive manufacturing technologies that produce parts one layer at a time from a 3D digital model.' }
]

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}

const beforeEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '0';
  htmlEl.style.opacity = '0';
}

const enter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = htmlEl.scrollHeight + 'px';
  htmlEl.style.opacity = '1';
}

const leave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = htmlEl.scrollHeight + 'px';
  // Trigger reflow
  void htmlEl.offsetHeight;
  htmlEl.style.height = '0';
  htmlEl.style.opacity = '0';
}

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  tl.from(prTag.value, { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' })
    .from(titleRef.value, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, "-=0.2")
    .from(faqRefs.value, { 
      y: 30, 
      opacity: 0, 
      duration: 0.5, 
      stagger: 0.1, 
      ease: 'power3.out' 
    }, "-=0.2")
})
</script>

<template>
  <section ref="sectionRef" class="py-32 bg-gray-50 flex flex-col items-center px-4">
    <div class="text-center mb-16">
      <p ref="prTag" class="inline-block bg-c-green/10 text-c-green px-6 py-2 rounded-full font-bold mb-6 uppercase tracking-wider text-sm">Frequently asked questions</p>
      <h1 ref="titleRef" class="text-4xl md:text-[50px] font-black font-outfit tracking-tight text-[#1E252C]">Frequently asked questions</h1>
    </div>

    <div class="w-full max-w-[800px]">
      <div v-for="(faq, index) in faqs" :key="index" :ref="el => { if(el) faqRefs[index] = el as HTMLElement }" class="mb-5 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
        <button @click="toggle(index)" class="w-full text-left px-8 py-6 font-bold text-[20px] text-[#1E252C] hover:text-c-red transition-colors flex justify-between items-center focus:outline-none font-outfit">
          {{ faq.question }}
          <span class="text-3xl font-light text-gray-400 transition-transform duration-300" :class="{'rotate-45 text-c-red': openIndex === index}">+</span>
        </button>
        <transition 
          name="faq"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <div v-show="openIndex === index" class="px-8 pb-8 text-gray-600 leading-relaxed text-[17px] font-poppins overflow-hidden transition-all duration-300 ease-in-out">
            <p class="m-0 bg-transparent text-gray-500">{{ faq.answer }}</p>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>
