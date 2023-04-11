<template>
<div>
  <div v-for="city in autocompletedCities"
       @click="$emit('select', city)"
       class="cursor-pointer hover:text-white hover:bg-skyBlue">
    {{ city }}
  </div>
</div>
</template>

<script setup lang="ts">
const prop = defineProps({
  autocompletedCities: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['select']);
</script>

<style scoped>

</style>
