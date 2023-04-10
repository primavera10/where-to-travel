<template>
<div>
  <div v-for="city in autocompletedCities.data"
       @click="$emit('select', city.name)"
       :key="city.id"
       class="cursor-pointer hover:text-white hover:bg-skyBlue">
    {{ city.name }}
  </div>
</div>
</template>

<script setup lang="ts">
const prop = defineProps({
  autocompletedCities: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['select']);
</script>

<style scoped>

</style>
