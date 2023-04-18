<template>
  <div class="flex items-center justify-center  gap-2 mx-auto">
    <div
      :class="{
      'pointer-events-none cursor-not-allowed text-grey': prop.currentPage <= buffer + 1,
      'text-darkBlue pointer-events-auto hover:text-white hover:bg-darkBlue rounded-3xl cursor-pointer': prop.currentPage > buffer + 1,
         }"
      @click="$emit('update:current-page', 1)">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="M18.41 7.41L17 6l-6 6l6 6l1.41-1.41L13.83 12l4.58-4.59m-6 0L11 6l-6 6l6 6l1.41-1.41L7.83 12l4.58-4.59Z" />
      </svg>
    </div>
    <div v-for="page in visiblePages"
         :class="{
      'bg-darkBlue text-white': page === prop.currentPage,
         }"
         @click="$emit('update:current-page', page)"
         class="border w-8 text-center p-1 border-skyBlue cursor-pointer hover:bg-skyBlue hover:text-white rounded-3xl">
      {{ page }}
    </div>
    <div  :class="{
      'pointer-events-none cursor-not-allowed text-grey': prop.currentPage > prop.totalPages - 3,
      'text-darkBlue pointer-events-auto hover:text-white hover:bg-darkBlue rounded-3xl cursor-pointer':  prop.currentPage <= prop.totalPages - 3,
         }"
          @click="$emit('update:current-page', prop.totalPages)">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="M5.59 7.41L7 6l6 6l-6 6l-1.41-1.41L10.17 12L5.59 7.41m6 0L13 6l6 6l-6 6l-1.41-1.41L16.17 12l-4.58-4.59Z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const prop = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});
defineEmits(["update:current-page"]);
const buffer = 2;

const visiblePages = computed(() => {
  let min = Math.max(prop.currentPage - buffer, 1);
  let max = Math.min(prop.currentPage + buffer, prop.totalPages);
  if (prop.currentPage - 1 <= buffer) {
    max = Math.min(1 + buffer * 2, prop.totalPages);
  }
  if (prop.totalPages - prop.currentPage <= buffer ){
    min = Math.max(prop.totalPages - buffer * 2, 1) ;
  }
  const arr = [];
  for (let i = min; i <= max; i++) {
    arr.push(i);
  }
  return arr;
});

</script>

<style scoped>

</style>
