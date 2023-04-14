<template>
  <div class="flex items-center justify-center  gap-2 mx-auto">
    <div v-for="page in prop.totalPages"
         :class="{
      'bg-darkBlue text-white': page === prop.currentPage,
         }"
         @click="$emit('update:current-page', page)"
         class="border w-8 text-center p-1 border-skyBlue cursor-pointer hover:bg-skyBlue hover:text-white rounded-3xl">
      {{ page }}
    </div>
  </div>
</template>

<script setup lang="ts">
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
defineEmits(['update:current-page'])

</script>

<style scoped>

</style>
