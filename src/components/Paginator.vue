<template>
<div>
</div>
</template>

<script setup lang="ts">
const prop = defineProps({
  sights:{
    type:Array,
  },
  perPage:{
    type: Number,
    required: true,
  },
  currentPage:{
    type:Number,
    required: true,
  },
  totalPages:{
    type: Number,
    required: true,
  }
})
</script>

<style scoped>

</style>
