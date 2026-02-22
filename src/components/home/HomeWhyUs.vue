<script setup lang="ts">
</script>
<template>
  <section class="py-10 px-0 md:px-0 lg:min-h-[500px] overflow-hidden">
    <div class="flex flex-col md:flex-row items-stretch justify-center h-full">
      <div class="w-full md:w-[55%] relative text-right bg-[url('/assets/banner-12-bgSAMPLE.jpg')] bg-no-repeat bg-center bg-cover min-h-[400px]">
        <img src="/assets/banner-12-9.png" alt="Why us" class="absolute right-0 top-1/2 -translate-y-1/2 max-w-[90%] md:mr-[5%]">
      </div>

      <div class="w-full md:w-[45%] md:pl-12 flex flex-col justify-center py-10 px-8 lg:py-0">
        <p class="inline-block bg-c-green/10 text-c-green px-4 py-2 rounded-full font-medium self-start mb-4">Why Pricom?</p>
        <h1 class="text-[45px] font-black font-outfit m-0 mt-5 mb-8">Why 3D Printing?</h1>

        <div class="h-[300px] overflow-y-auto pr-2 custom-scrollbar hover-show-scrollbar">
          <ul class="list-none p-0 m-0 space-y-8">
            <li>
              <h3 class="text-xl font-bold font-outfit mb-3 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">Reliable Quality</h3>
              <h2 class="text-base text-gray-500 font-normal leading-relaxed">Proprietary processes, expert 3D printing operators, and inspections are our secrets to delivering exceptional, quality products every time.</h2>
            </li>
            <li>
              <h3 class="text-xl font-bold font-outfit mb-3 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">Fast Turnaround</h3>
              <h2 class="text-base text-gray-500 font-normal leading-relaxed">Working on a project for a customer that has to be just right? Get models back fast, and 3D print new iterations, if needed, for final feedback and production.</h2>
            </li>
            <li>
              <h3 class="text-xl font-bold font-outfit mb-3 bg-gradient-to-r from-[rgba(247,141,167,0.9)] to-[rgba(255,105,0,0.6)] bg-clip-text text-transparent">Reliable Quality</h3>
              <h2 class="text-base text-gray-500 font-normal leading-relaxed">Proprietary processes, expert 3D printing operators, and inspections are our secrets to delivering exceptional, quality products every time.</h2>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  background-color: #f2f2f2;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  transition: background-color 0.2s ease-in-out;
}
.hover-show-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #7d7d7d;
}
</style>
