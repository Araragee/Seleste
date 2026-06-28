<script setup lang="ts">
import { useCartStore } from '../stores/cart'

const cart = useCartStore()

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
</script>

<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="cart.isOpen" class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" @click="cart.close()"></div>
  </Transition>

  <!-- Drawer -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="cart.isOpen"
      class="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] flex flex-col"
      role="dialog"
      aria-label="Shopping cart"
    >
      <header class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 class="text-2xl font-bold font-outfit text-c-black">Your Cart <span class="text-c-red">({{ cart.count }})</span></h2>
        <button type="button" aria-label="Close cart" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-c-light-gray transition-colors" @click="cart.close()">
          <i class="fas fa-times text-lg"></i>
        </button>
      </header>

      <!-- Empty state -->
      <div v-if="cart.isEmpty" class="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
        <div class="w-20 h-20 rounded-full bg-c-light-gray flex items-center justify-center text-c-gray">
          <i class="fas fa-shopping-bag text-3xl"></i>
        </div>
        <p class="text-c-gray font-poppins">Your cart is empty.</p>
        <router-link to="/services" class="text-c-red font-bold hover:underline" @click="cart.close()">Browse our services</router-link>
      </div>

      <!-- Items -->
      <ul v-else class="flex-1 overflow-y-auto px-6 py-4 space-y-4 list-none m-0">
        <li v-for="item in cart.items" :key="item.id" class="flex items-start gap-4 border border-gray-100 rounded-xl p-4">
          <div class="flex-1">
            <h3 class="font-bold font-outfit text-c-black">{{ item.name }}</h3>
            <p class="text-c-gray text-sm font-poppins">{{ formatPrice(item.price) }}<span v-if="item.unit"> / {{ item.unit }}</span></p>
            <div class="flex items-center gap-3 mt-3">
              <button type="button" aria-label="Decrease quantity" class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-c-red hover:text-c-red transition-colors" @click="cart.updateQuantity(item.id, item.quantity - 1)">
                <i class="fas fa-minus text-xs"></i>
              </button>
              <span class="w-6 text-center font-bold">{{ item.quantity }}</span>
              <button type="button" aria-label="Increase quantity" class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-c-red hover:text-c-red transition-colors" @click="cart.updateQuantity(item.id, item.quantity + 1)">
                <i class="fas fa-plus text-xs"></i>
              </button>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold font-outfit">{{ formatPrice(item.price * item.quantity) }}</p>
            <button type="button" aria-label="Remove item" class="text-c-gray hover:text-c-red transition-colors mt-2 text-sm" @click="cart.removeItem(item.id)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </li>
      </ul>

      <!-- Footer -->
      <footer v-if="!cart.isEmpty" class="border-t border-gray-100 px-6 py-5 space-y-4">
        <div class="flex items-center justify-between text-lg">
          <span class="font-poppins text-c-gray">Subtotal</span>
          <span class="font-black font-outfit text-c-black">{{ formatPrice(cart.total) }}</span>
        </div>
        <button type="button" class="w-full bg-c-black text-white rounded-lg py-4 font-bold uppercase tracking-wider hover:bg-c-red transition-colors">
          Checkout
        </button>
        <button type="button" class="w-full text-c-gray text-sm hover:text-c-red transition-colors" @click="cart.clear()">
          Clear cart
        </button>
      </footer>
    </aside>
  </Transition>
</template>
