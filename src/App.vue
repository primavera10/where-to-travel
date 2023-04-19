<template>
  <div class="p-6 sm:p-12 bg-white text-black min-h-[100vh]">
    <div class="flex flex-col  items-center" :class="{
        'mb-14': autocompletedCities.length === 0,
      }">
      <div class="mt-10  flex items-center gap-2 sm:gap-8">
        <Autocomplete
          @select="checkData"
          v-model:model-value="city"
          :history="responseHistory" />
        <button class="bg-skyBlue rounded-lg p-3 text-white cursor-pointer hover:bg-darkBlue" @click="checkData">
          Search
        </button>
      </div>
      <div class="flex flex-col sm:flex-row gap-4  mt-6 z-20 items-center sm:items-start">
        <div class="flex gap-2 sm:block">
          <div>
            <div class="text-sm">
              Select search radius
            </div>
            <div class="mt-1 text-grey text-xs">
              *Default - 2000 meters
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="10000"
            v-model="radius"
            placeholder="max 10000"
            class=" focus:outline-none border-grey border rounded pl-2 py-1"
          />
        </div>
        <select v-model="select" class="focus:outline-none">
          <option value="rate"> Sort by rate</option>
          <option value="distance"> Sort by distance</option>
        </select>
      </div>
    </div>
    <div v-if="response">
      <div v-if="placesNearby.length > 0">
        <div class="text-3xl text-center mb-14">
          Interesting places nearby <span class="text-skyBlue">{{ response.name }}</span> in <span class="text-skyBlue">{{ radius
          }}</span>
          meters
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" v-if="placesNearby.length > 0">
          <div v-for="place in itemsPage" :key="place.xid"
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
        <Paginator
          v-model:current-page="currentPage"
          :total-pages="numberOfPages"
          class="mt-6" />
      </div>
      <div v-else class="text-3xl text-center mb-14">
        Sorry, we haven't found any sights in <span class="text-slyBlue">{{ response.name }}</span> :(
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, type Ref, ref, watch } from "vue";
import Autocomplete from "@/components/Autocomplete.vue";
import Paginator from "@/components/Paginator.vue";


const city = ref<string>("");
const KEY = "5ae2e3f221c38a28845f05b6bce54ceec3074e30e4fc5e2df84867fe";
const response = ref();
const placesNearby = ref<Array<any>>([]);
const autocompletedCities = ref([]);
const radius = ref<string>("2000");
const currentPage = ref<number>(1);
const perPage = ref<number>(22);
const responseHistory = ref([]);
const select = ref("distance");

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
  let data = await fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=${radius.value}&lon=${response.value.lon}&lat=${response.value.lat}&apikey=${KEY}`);
  return await data.json();
};
let writeRadius = async () => {
  let data = await getRadiusData();
  let a = data.features.map((obj: any) => Object.values(obj));
  let b = a.map((obj: any) => obj[3]);
  placesNearby.value = b.filter((obj: any) => obj.name !== "");
  currentPage.value = 1;
};

watch(response, () => {
  if (response.value != null) {
    writeRadius();
    checkResponseHistory(response.value.name, responseHistory);
  }
});


const numberOfPages = computed(() => {
  if (!placesNearby.value) {
    return 0;
  }
  return Math.ceil(placesNearby.value.length / perPage.value);
});


const itemsPage = computed(() => {
  if (!placesNearby.value) {
    return [];
  }
  let arr = [];
  if (select.value === "rate") {
    arr = [...placesNearby.value].sort((a: any, b: any) => {
      if (a.rate < b.rate) {
        return 1;
      }
      if (a.rate > b.rate) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  if (select.value === "distance") {
    arr = placesNearby.value;
  }
  let start = (currentPage.value - 1) * perPage.value;
  let end = perPage.value * currentPage.value - 1;
  return arr.slice(start, end);
});

watch(response, (newResponse) => {
  localStorage.setItem("response-name", JSON.stringify(newResponse));
});
const responseData = localStorage.getItem("response-name");

function getFromLocalStorage(data: any) {
  if (!data) {
    return;
  }
  response.value = JSON.parse(data);
}

onMounted(() => {
  getFromLocalStorage(responseData);
  getHistoryFromLocalStorage(historyData);
});

const windowData = Object.fromEntries(
  new URL(window.location.href).searchParams.entries()
);
if (windowData.page) {
  currentPage.value = +windowData.page;
}

watch([currentPage, response], ([newPage, newResponse], [oldPage, oldResponse]) => {
  let p = oldPage !== newPage ? newPage : oldPage;
  const resp = newResponse !== oldResponse ? newResponse : oldResponse;
  window.history.pushState(null, document.title,
    `${window.location.pathname}?city=${resp.name}&page=${p}`);
});

function checkResponseHistory(city: string, arr: Ref<Array<string>>) {
  if (arr.value.includes(city) && arr.value.length < 11) {
    return;
  } else if (arr.value.length > 10) {
    arr.value.push(city);
    let a = arr.value.shift();
    return arr;
  } else return arr.value.push(city);
}

watch(responseHistory, (newHistory) => {
  localStorage.setItem("history", JSON.stringify(newHistory));
}, { deep: true });
const historyData = localStorage.getItem("history");

function getHistoryFromLocalStorage(data: any) {
  if (!data) {
    return;
  }
  responseHistory.value = JSON.parse(data);
}

watch(radius, () => {
  if (response.value != null) {
    writeRadius();
  }
});

// const sortedPlaces = computed(() => {
//   if (select.value === "rate") {
//     return placesNearby.value.sort((a: any, b: any) => {
//       if (a.rate < b.rate) {
//         return 1;
//       }
//       if (a.rate > b.rate) {
//         return -1;
//       } else {
//         return 0;
//       }
//     });
//   } else {
//     return placesNearby.value;
//   }
// });

</script>


