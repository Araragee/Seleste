<script setup lang="ts">
// Interactive logic for marquee drag could go here if needed,
// but pure CSS animation often suffices.
</script>

<template>
  <div class="w-full overflow-hidden whitespace-nowrap flex gap-4 relative select-none bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] cursor-pointer group">
    <div class="flex-shrink-0 flex justify-around min-w-full gap-4 text-white tracking-widest animate-[scroll_25s_linear_infinite] group-hover:[animation-play-state:paused]">
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">WELCOME TO PRICOM</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">SIGN UP & ENJOY 10% OFF</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">FREE SHIPPING ON ALL U.S ORDERS $50+</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">WELCOME TO PRICOM</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">SIGN UP & ENJOY 10% OFF</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">FREE SHIPPING ON ALL U.S ORDERS $50+</h4>
    </div>
    <div class="flex-shrink-0 flex justify-around min-w-full gap-4 text-white tracking-widest animate-[scroll_25s_linear_infinite] group-hover:[animation-play-state:paused]">
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">WELCOME TO PRICOM</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">SIGN UP & ENJOY 10% OFF</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">FREE SHIPPING ON ALL U.S ORDERS $50+</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">WELCOME TO PRICOM</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">SIGN UP & ENJOY 10% OFF</h4>
      <h4 class="m-0 py-2 text-lg font-bold font-outfit">FREE SHIPPING ON ALL U.S ORDERS $50+</h4>
    </div>
  </div>
</template>

<style scoped>
@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - 1rem));
  }
}
</style>
