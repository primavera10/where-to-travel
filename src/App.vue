<template>
  <div class="p-12">
    <div class="flex flex-col  items-center" :class="{
        'mb-14': autocompletedCities.length === 0,
      }">
      <div class="mt-10  flex items-center gap-8">
        <Autocomplete
          @select="checkData"
        v-model="city"/>
        <button class="bg-skyBlue rounded-lg p-3 text-white cursor-pointer hover:bg-darkBlue" @click="checkData">
          Search
        </button>
      </div>
      <div class="flex mt-6 z-20 items-start">
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
    </div>
    <div v-if="response">
      <div class="text-3xl text-center mb-14">
        Interesting places nearby {{ response.name }}
      </div>
      <div v-if="placesNearby" class="grid gap-4 grid-cols-3">
        <div v-for="place in placesNearby" :key="place.name"
             :class="{
          'hidden': place.name === '',
             }"
             class=" border-black border rounded-2xl p-4">
          <div class="mb-3">
            Name: {{ place.name }}
          </div>
          <div class="text-grey">
            Distance {{ Math.floor(place.dist) }} meters
          </div>
          <div>
            Rate {{ place.rate }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Autocomplete from "@/components/Autocomplete.vue";


const city = ref<string>("");
const KEY = "5ae2e3f221c38a28845f05b6bce54ceec3074e30e4fc5e2df84867fe";
const response = ref();
const placesNearby = ref();
const autocompletedCities = ref([]);
const radius = ref<string>("");


let getPlaceData = async function() {
  let data = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(city.value)}&apikey=${KEY}`);
  return await data.json();
};

const checkData = async () => {
  if (city.value !== "") {
    response.value = await getPlaceData();
    city.value = "";
  }
};

let getRadiusData = async function() {
  let data = await fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=${hasRadius()}&lon=${response.value.lon}&lat=${response.value.lat}&apikey=${KEY}`);
  return await data.json();
};
let writeRadius = async () => {
  let data = await getRadiusData();
  let a  = data.features.map((obj: any) => Object.values(obj));
  placesNearby.value = a.map((obj:any) => obj[3]);
};

watch(response, () => {
  if (response.value !== "") {
    writeRadius();
  }
});

function hasRadius() {
  return (radius.value !== "") ? radius.value : "2000";
}

</script>


