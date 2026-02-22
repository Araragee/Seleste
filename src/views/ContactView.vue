<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  firstName: '',
  lastName: '',
  subject: '',
  message: ''
})

const submitForm = () => {
  console.log('Form submitted:', form.value)
  alert('Message sent successfully!')
  form.value = { firstName: '', lastName: '', subject: '', message: '' }
}
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

    <section class="pt-24 pb-12 px-4 md:px-10 max-w-5xl mx-auto text-center">
      <h2 class="text-4xl md:text-[50px] font-black font-outfit leading-tight mb-8 text-[#1E252C]">Keep in touch with us</h2>
      <p class="text-xl text-gray-500 leading-relaxed font-poppins">We’re talking about clean beauty gift sets, of course – and we’ve got a bouquet of<br>beauties for yourself or someone you love.</p>
    </section>

    <section class="py-12 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div class="text-center p-8 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] transition-shadow">
          <div class="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6 text-c-red"><i class="fas fa-map-marker-alt text-3xl"></i></div>
          <h3 class="text-2xl font-bold font-outfit mb-4 text-[#1E252C]">Address</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">3245 Abbot Kinney BLVD - PH<br>Venice, CA 124</p>
          <h4 class="font-bold text-gray-800 text-lg">13F Keangnam Landmark 72</h4>
        </div>
        
        <div class="text-center p-8 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] transition-shadow">
          <div class="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 text-c-green"><i class="fas fa-phone-alt text-3xl"></i></div>
          <h3 class="text-2xl font-bold font-outfit mb-4 text-[#1E252C]">Contact</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">Mobile: <span class="font-bold text-gray-800">068 26589 996</span></p>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">Hotline: <span class="font-bold text-gray-800">1900 26886</span></p>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">E-mail: hello@pricom.com</p>
        </div>
        
        <div class="text-center p-8 rounded-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] transition-shadow">
          <div class="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500"><i class="far fa-clock text-3xl"></i></div>
          <h3 class="text-2xl font-bold font-outfit mb-4 text-[#1E252C]">Hour of operation</h3>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">Mon - Fri: 08:30 - 20:00</p>
          <p class="text-gray-500 leading-relaxed font-poppins text-lg mb-2">Sat & Sun: 09:30 - 21:30</p>
        </div>
      </div>
    </section>

    <section class="w-full grayscale hover:grayscale-0 transition-all duration-700">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.362362987849!2d105.78199041493242!3d21.018182186004037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454ab43c0c4db%3A0xdb6effebd6991106!2sKeangnam%20Landmark%20Tower%2072!5e0!3m2!1sen!2sph!4v1683622764517!5m2!1sen!2sph"
        width="100%" height="500" style="border:0;" allowfullscreen="false" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </section>

    <section class="py-24 px-4 md:px-10 max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-[45px] font-black font-outfit text-[#1E252C]">Send a message</h2>
      </div>
      
      <form @submit.prevent="submitForm" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <input type="text" v-model="form.firstName" placeholder="First Name" required class="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-xl focus:outline-none focus:border-c-red focus:bg-white text-lg transition-colors font-poppins shadow-sm">
          <input type="text" v-model="form.lastName" placeholder="Last Name" required class="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-xl focus:outline-none focus:border-c-red focus:bg-white text-lg transition-colors font-poppins shadow-sm">
        </div>
        <input type="text" v-model="form.subject" placeholder="Subject" required class="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-xl focus:outline-none focus:border-c-red focus:bg-white text-lg transition-colors font-poppins shadow-sm">
        <textarea v-model="form.message" placeholder="Message" required rows="6" class="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-xl focus:outline-none focus:border-c-red focus:bg-white text-lg transition-colors font-poppins resize-none shadow-sm"></textarea>
        
        <div class="text-center pt-6">
          <button type="submit" class="bg-black text-white font-bold text-lg px-14 py-4 rounded-full hover:bg-c-red transition-all shadow-lg hover:shadow-red-500/30 hover:-translate-y-1 uppercase tracking-wider">Submit</button>
        </div>
      </form>
    </section>
  </div>
</template>
