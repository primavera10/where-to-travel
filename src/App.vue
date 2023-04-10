<template>
  <div class="p-12">
    <div class="flex flex-col items-center" :class="{
        'mb-14': autocompletedCities === undefined,
      }">
      <div class="mt-10  flex items-center  gap-4">
        <input
          type="text"
          v-model="city"
          class="focus:outline-none  text-xl"
          @keydown.enter="checkData"
          placeholder="Enter your city" />
        <button class="bg-skyBlue rounded-lg p-3 text-white cursor-pointer hover:bg-darkBlue" @click="checkData">
          Search
        </button>
      </div>
      <div class="flex mt-6 items-start">
        <div>
          <div>
            Select search radius
          </div>
          <div class="mt-1 text-grey text-xs">
            *Default - 2000 meters
          </div>
        </div>
        <input
          type="text"
          v-model="radius"
          placeholder="max 10000"
          class="ml-4 focus:outline-none border-grey border rounded pl-2 py-1"
        />
      </div>
      <div class="w-80 py-4 pr-4 mb-8 mt-2 " v-if="autocompletedCities!==undefined">
        <div v-for="city in autocompletedCities.data"
             @click="fillCity(city.name)"
             :key="city.id"
             class="cursor-pointer hover:text-white hover:bg-skyBlue">
          {{ city.name }}
        </div>
      </div>
    </div>
    <div v-if="response">
      <div class="text-3xl text-center mb-14">
        Interesting places nearby {{ response.name }}
      </div>
      <div v-if="placesNearby" class="grid gap-4 grid-cols-3">
        <div v-for="place in placesNearby.features" :key="place.id"
             :class="{
          'hidden': place.properties.name === '',
             }"
             class=" border-black border rounded-2xl p-4">
          <div class="mb-3">
            Name: {{ place.properties.name }}
          </div>
          <div class="text-grey">
            Distance {{ Math.floor(place.properties.dist) }} meters
          </div>
          <div>
            Rate {{ place.properties.rate }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

const city = ref<string>("");
const KEY = "5ae2e3f221c38a28845f05b6bce54ceec3074e30e4fc5e2df84867fe";
const response = ref();
const placesNearby = ref();
const autocompletedCities = ref();
const radius = ref<string>("");


let getPlaceData = async function() {
  let data = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${city.value}&apikey=${KEY}`);
  return await data.json();
};

const checkData = async () => {
  if (city.value !== "") {
    response.value = await getPlaceData();
    city.value = "";
    autocompletedCities.value = {};
  }
};

let getRadiusData = async function() {
  let data = await fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=${hasRadius()}&lon=${response.value.lon}&lat=${response.value.lat}&apikey=${KEY}`);
  return await data.json();
};
let writeRadius = async () => {
  placesNearby.value = await getRadiusData();
};

watch(response, () => {
  if (response.value !== "") {
    writeRadius();
  }
});
watch(city, () => {
  if (city.value !== "") {
    debounce();
  }
  if (city.value === "") {
    autocompletedCities.value = {};
  }
});

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "e014dd2be7mshb4c842b876ec2c4p1eb946jsncaa5e0348633",
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
  }
};


let getAutoCompletedCities = async function() {
  let data = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city.value}&limit=10`, options);
  return await data.json();
};

const writeAutocompletedCities = async () => {
  if (city.value === "") {
    return autocompletedCities.value = undefined;
  }
  autocompletedCities.value = await getAutoCompletedCities();
};

const debounce = useDebounceFn(writeAutocompletedCities, 700);

function fillCity(name: string) {
  city.value = name;
  checkData();
}

function hasRadius() {
  return (radius.value !== "") ? radius.value : "2000";
}

</script>

