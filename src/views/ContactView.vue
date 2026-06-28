<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { submitContactForm } from '../services/contact'

gsap.registerPlugin(ScrollTrigger)

useHead({
  title: 'Contact Us',
  meta: [{ name: 'description', content: 'Get in touch with the Pricom team — questions, quotes, and support for all your printing needs.' }],
})

const form = ref({
  firstName: '',
  lastName: '',
  subject: '',
  message: ''
})

type FormField = keyof typeof form.value
const errors = reactive<Record<FormField, string>>({
  firstName: '',
  lastName: '',
  subject: '',
  message: ''
})
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')

const validateForm = () => {
  errors.firstName = form.value.firstName.trim() ? '' : 'First name is required'
  errors.lastName = form.value.lastName.trim() ? '' : 'Last name is required'
  errors.subject = form.value.subject.trim() ? '' : 'Subject is required'
  errors.message = form.value.message.trim().length >= 10 ? '' : 'Message must be at least 10 characters'
  return !Object.values(errors).some(Boolean)
}

const submitForm = async () => {
  submitError.value = ''
  if (!validateForm()) return

  submitting.value = true
  try {
    const result = await submitContactForm({ ...form.value })
    submitted.value = true
    submitError.value = ''
    form.value = { firstName: '', lastName: '', subject: '', message: '' }
    console.info('[contact]', result.message)
  } catch (error) {
    submitError.value = 'Something went wrong while sending your message. Please try again.'
    console.error('[contact] submission failed', error)
  } finally {
    submitting.value = false
  }
}

const inputBaseClass = 'w-full bg-gray-50 border px-6 py-4 rounded-xl focus:outline-none focus:bg-white text-lg transition-colors font-poppins shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'
const inputState = (field: FormField) =>
  errors[field] ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-c-red'

// Animation Refs
const introSectionRef = ref<HTMLElement | null>(null)
const introElementsRef = ref<HTMLElement[]>([])

const cardsSectionRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement[]>([])

const mapSectionRef = ref<HTMLElement | null>(null)
const mapElementRef = ref<HTMLElement | null>(null)

const formSectionRef = ref<HTMLElement | null>(null)
const formTitleRef = ref<HTMLElement | null>(null)
const formElementsRef = ref<HTMLElement[]>([])

onMounted(() => {
  // Intro Animation
  gsap.from(introElementsRef.value, {
    scrollTrigger: { trigger: introSectionRef.value, start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out'
  })

  // Contact Cards
  gsap.from(cardsRef.value, {
    scrollTrigger: { trigger: cardsSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1)'
  })

  // Map Animation
  gsap.from(mapElementRef.value, {
    scrollTrigger: { trigger: mapSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.7, ease: 'power3.out'
  })

  // Form Animation
  const tlForm = gsap.timeline({
    scrollTrigger: { trigger: formSectionRef.value, start: 'top 80%', toggleActions: 'play none none reverse' }
  })
  tlForm.from(formTitleRef.value, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' })
        .from(formElementsRef.value, { y: 20, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' }, "-=0.2")
})
</script>

<template>
  <div class="bg-white border-t border-gray-100">
    <section class="bg-gray-50 py-20 text-center relative border-b border-gray-100">
      <h1 class="text-[50px] font-black font-outfit mb-4 text-[#1E252C]">Contact Us</h1>
      <div class="flex items-center justify-center text-gray-400 gap-3 font-medium text-lg">
        <router-link to="/" class="hover:text-c-red transition-colors text-black">Home</router-link>
        <span class="w-8 h-px bg-c-red"></span>
        <span class="text-c-red">Contact Us</span>
      </div>
    </section>

    <section ref="introSectionRef" class="pt-32 pb-16 px-4 md:px-10 max-w-5xl mx-auto text-center">
      <h2 :ref="el => { if(el) introElementsRef[0] = el as HTMLElement }" class="text-4xl md:text-[55px] font-black font-outfit leading-[1.1] mb-8 text-[#1E252C] tracking-tight">Keep in touch with us</h2>
      <p :ref="el => { if(el) introElementsRef[1] = el as HTMLElement }" class="text-xl text-gray-500 leading-relaxed font-poppins text-[18px]">We’re talking about clean beauty gift sets, of course – and we’ve got a bouquet of<br>beauties for yourself or someone you love.</p>
    </section>

    <section ref="cardsSectionRef" class="py-16 pb-32 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div :ref="el => { if(el) cardsRef[0] = el as HTMLElement }" class="text-center p-8 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group bg-white border border-gray-100 hover:-translate-y-2">
          <div class="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6 text-c-red group-hover:bg-c-red group-hover:text-white transition-colors duration-300"><i class="fas fa-map-marker-alt text-3xl"></i></div>
          <h3 class="text-2xl font-bold font-outfit mb-4 text-[#1E252C]">Address</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">3245 Abbot Kinney BLVD - PH<br>Venice, CA 124</p>
          <h4 class="font-bold text-[#1E252C] text-lg">13F Keangnam Landmark 72</h4>
        </div>
        
        <div :ref="el => { if(el) cardsRef[1] = el as HTMLElement }" class="text-center p-8 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group bg-white border border-gray-100 hover:-translate-y-2">
          <div class="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 text-c-green group-hover:bg-c-green group-hover:text-white transition-colors duration-300"><i class="fas fa-phone-alt text-3xl"></i></div>
          <h3 class="text-2xl font-bold font-outfit mb-4 text-[#1E252C]">Contact</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">Mobile: <span class="font-bold text-[#1E252C]">068 26589 996</span></p>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">Hotline: <span class="font-bold text-[#1E252C]">1900 26886</span></p>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">E-mail: hello@pricom.com</p>
        </div>
        
        <div :ref="el => { if(el) cardsRef[2] = el as HTMLElement }" class="text-center p-8 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group bg-white border border-gray-100 hover:-translate-y-2">
          <div class="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300"><i class="far fa-clock text-3xl"></i></div>
          <h3 class="text-2xl font-bold font-outfit mb-4 text-[#1E252C]">Hour of operation</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">Mon - Fri: 08:30 - 20:00</p>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">Sat & Sun: 09:30 - 21:30</p>
        </div>
      </div>
    </section>

    <section ref="mapSectionRef" class="w-full grayscale hover:grayscale-0 transition-all duration-700">
      <iframe ref="mapElementRef" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.362362987849!2d105.78199041493242!3d21.018182186004037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454ab43c0c4db%3A0xdb6effebd6991106!2sKeangnam%20Landmark%20Tower%2072!5e0!3m2!1sen!2sph!4v1683622764517!5m2!1sen!2sph"
        width="100%" height="500" style="border:0;" allowfullscreen="false" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </section>

    <section ref="formSectionRef" class="py-32 px-4 md:px-10 max-w-4xl mx-auto">
      <div ref="formTitleRef" class="text-center mb-16">
        <h2 class="text-4xl md:text-[55px] font-black font-outfit text-[#1E252C] tracking-tight">Send a message</h2>
      </div>
      
      <p v-if="submitted" class="mb-8 text-center bg-green-50 text-c-green border border-green-200 rounded-xl px-6 py-4 font-poppins text-lg">
        Thanks! Your message has been sent successfully.
      </p>
      <p v-if="submitError" class="mb-8 text-center bg-red-50 text-red-600 border border-red-200 rounded-xl px-6 py-4 font-poppins text-lg">
        {{ submitError }}
      </p>

      <form @submit.prevent="submitForm" novalidate class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div :ref="el => { if(el) formElementsRef[0] = el as HTMLElement }">
            <input type="text" v-model="form.firstName" @blur="validateForm" placeholder="First Name" :class="[inputBaseClass, inputState('firstName')]">
            <p v-if="errors.firstName" class="mt-2 text-sm text-red-500 font-poppins">{{ errors.firstName }}</p>
          </div>
          <div :ref="el => { if(el) formElementsRef[1] = el as HTMLElement }">
            <input type="text" v-model="form.lastName" @blur="validateForm" placeholder="Last Name" :class="[inputBaseClass, inputState('lastName')]">
            <p v-if="errors.lastName" class="mt-2 text-sm text-red-500 font-poppins">{{ errors.lastName }}</p>
          </div>
        </div>
        <div :ref="el => { if(el) formElementsRef[2] = el as HTMLElement }">
          <input type="text" v-model="form.subject" @blur="validateForm" placeholder="Subject" :class="[inputBaseClass, inputState('subject')]">
          <p v-if="errors.subject" class="mt-2 text-sm text-red-500 font-poppins">{{ errors.subject }}</p>
        </div>
        <div :ref="el => { if(el) formElementsRef[3] = el as HTMLElement }">
          <textarea v-model="form.message" @blur="validateForm" placeholder="Message" rows="6" :class="[inputBaseClass, inputState('message'), 'resize-none']"></textarea>
          <p v-if="errors.message" class="mt-2 text-sm text-red-500 font-poppins">{{ errors.message }}</p>
        </div>

        <div :ref="el => { if(el) formElementsRef[4] = el as HTMLElement }" class="text-center pt-6">
          <button type="submit" :disabled="submitting" class="bg-[#1E252C] text-white font-bold text-lg px-14 py-4 rounded-full hover:bg-c-red transition-all shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(202,60,60,0.3)] hover:-translate-y-1 uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 inline-flex items-center gap-3">
            <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
            {{ submitting ? 'Sending…' : 'Submit' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
