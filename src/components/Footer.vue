<script setup lang="ts">
</script>

<template>
  <footer class="bg-gray-100 pt-16 pb-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div class="footer__column">
          <img src="/assets/logo-footer.png" alt="Pricom Footer Logo" class="mb-4 max-w-full h-auto">
          <p class="text-gray-500 mb-2">hello@pricom.io</p>
          <h3 class="text-xl font-bold mb-4">+02 036 038 3996</h3>
          <p class="text-gray-500 leading-relaxed">3665 Paseo Place, Suite 0960 San <br> Diego</p>
        </div>
        
        <div class="footer__column">
          <h3 class="text-lg font-bold mb-6 font-outfit tracking-wide">Information</h3>
          <ul class="list-none p-0 m-0 space-y-4">
            <li><router-link to="/about" class="text-gray-500 hover:text-red-500 transition-colors">About us</router-link></li>
            <li><router-link to="/contact" class="text-gray-500 hover:text-red-500 transition-colors">Contact Us</router-link></li>
            <li><a href="#" class="text-gray-500 hover:text-red-500 transition-colors">Start a Return</a></li>
            <li><a href="#" class="text-gray-500 hover:text-red-500 transition-colors">Shipping FAQ</a></li>
          </ul>
        </div>
        
        <div class="footer__column">
          <h3 class="text-lg font-bold mb-6 font-outfit tracking-wide">Services</h3>
          <ul class="list-none p-0 m-0 space-y-4">
            <li><router-link to="/services" class="text-gray-500 hover:text-red-500 transition-colors">Printing Services</router-link></li>
            <li><a href="#" class="text-gray-500 hover:text-red-500 transition-colors">Digital Scanning</a></li>
            <li><a href="#" class="text-gray-500 hover:text-red-500 transition-colors">Design Services</a></li>
            <li><a href="#" class="text-gray-500 hover:text-red-500 transition-colors">Copying Services</a></li>
            <li><a href="#" class="text-gray-500 hover:text-red-500 transition-colors">Customize Design</a></li>
          </ul>
        </div>
        
        <div class="footer__column">
          <h3 class="text-lg font-bold mb-6 font-outfit tracking-wide">Newsletter</h3>
          <p class="text-gray-500 mb-6 leading-relaxed">
            Get the latest news, events & more delivered to your inbox.
          </p>
          <form class="flex" @submit.prevent>
            <input type="email" placeholder="Your email address" class="flex-grow bg-white border border-gray-200 px-4 py-3 rounded-l-md focus:outline-none focus:border-gray-400">
            <button type="submit" class="bg-red-500 text-white px-6 py-3 rounded-r-md hover:bg-black transition-colors flex items-center justify-center">
              <i class="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-8 flex flex-wrap justify-between items-center">
        <div>
          <h3 class="text-gray-500 text-sm">© 2026 Pricom. All rights reserved.</h3>
        </div>
        <div class="mt-4 md:mt-0">
          <img src="/assets/payment-method.png" alt="Payment Methods" class="max-w-[250px] h-auto">
        </div>
      </div>
    </div>
  </footer>
</template>
