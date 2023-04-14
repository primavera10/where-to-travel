<template>
  <div class="relative">
    <input
      type="text"
      @focus="showAutocomplete = true"
      @blur="showAutocomplete = false"
      :value="modelValue"
      @input="$emit('update:model-value', $event.target.value)"
      @keydown.enter="$emit('select', $event.target.value)"
      class="focus:outline-none text-xl"
      placeholder="Enter your city" />
    <div class="w-full py-4 pr-4 top-full bg-white absolute z-50 mb-8 mt-2 autocompleteShadow rounded-lg pl-2"
         v-if="autocompletedCities.length!== 0 && showAutocomplete === true">
      <div v-for="city in autocompletedCities"
           :key="city"
           @click="onCitySelect(city)"
           class="cursor-pointer hover:text-white hover:bg-skyBlue">
        {{ city }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

const showAutocomplete = ref<boolean>(false);
const prop = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});
const emit = defineEmits(["update:model-value", "select"]);
const autocompletedCities = ref([]);

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "e014dd2be7mshb4c842b876ec2c4p1eb946jsncaa5e0348633",
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
  }
};

function getAutoCompletedCities(city: string) {
  return fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(city)}&limit=10`, options)
    .then((e) => e.json());
}

async function writeAutocompletedCities() {
  if (prop.modelValue === "") {
    return autocompletedCities.value = [];
  }
  let data = await getAutoCompletedCities(prop.modelValue);
  let a = data.data.map((obj: any) => Object.values(obj));
  autocompletedCities.value = a.map((elem: Array<any>) => {
    return elem[3];
  });
}
const debounce = useDebounceFn(writeAutocompletedCities, 700);


watch(() => prop.modelValue, debounce);

function onCitySelect(city:string){
  emit('update:model-value', city);
  emit('select', city);
}
</script>

<style scoped>
.autocompleteShadow {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
</style>
