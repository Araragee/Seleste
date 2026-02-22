<script setup lang="ts">
import { ref } from 'vue'

const openIndex = ref(0) // Default string open to mimic 'checked' input from radio

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
</script>

<template>
  <section class="py-24 bg-gray-50 flex flex-col items-center px-4">
    <div class="text-center mb-12">
      <p class="inline-block bg-c-green/10 text-c-green px-5 py-2 rounded-full font-medium mb-4">Frequently asked questions</p>
      <h1 class="text-4xl md:text-[45px] font-black font-outfit">Frequently asked questions</h1>
    </div>

    <div class="w-full max-w-3xl">
      <div v-for="(faq, index) in faqs" :key="index" class="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
        <button @click="toggle(index)" class="w-full text-left px-6 py-5 font-bold text-[18px] text-gray-800 hover:text-c-red transition-colors flex justify-between items-center focus:outline-none focus:bg-gray-50 font-outfit">
          {{ faq.question }}
          <span class="text-2xl font-light text-gray-400 transition-transform duration-300" :class="{'rotate-45 text-c-red': openIndex === index}">+</span>
        </button>
        <div v-show="openIndex === index" class="px-6 pb-6 text-gray-600 leading-relaxed text-base">
          <p class="m-0 bg-transparent text-gray-500">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
