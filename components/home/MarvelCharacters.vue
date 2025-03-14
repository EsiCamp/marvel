<script setup>
import { ref, computed, watch } from "vue";
import Pagination from "~/components/structure/Pagination.vue";

const searchQuery = useState("marvelSearch", () => "");
const currentPage = ref(0);
const pageSize = ref(12);
const searchTimeout = ref(null);
const totalItems = ref(0);

const fetchCharactersData = async () => {
  const offset = currentPage.value * pageSize.value;
  const params = {
    limit: pageSize.value,
    offset: offset,
  };
  if (searchQuery.value) {
    params.nameStartsWith = searchQuery.value;
  }
  const baseUrl = process.client
    ? window.location.origin
    : "http://localhost:3000";
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(
    `${baseUrl}/api/marvel/characters?${queryParams}`
  );
  return await response.json();
};

const {
  data: charactersResponse,
  pending,
  error,
  refresh,
} = await useAsyncData("characters-data", fetchCharactersData, {
  server: true,
  lazy: false,
  watch: [currentPage, searchQuery],
});

watch(
  charactersResponse,
  (newValue) => {
    if (newValue && newValue.data && newValue.data.total !== undefined) {
      totalItems.value = newValue.data.total;
    }
  },
  { immediate: true }
);

watch(searchQuery, () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 0;
  }, 500);
});

const characters = computed(() => {
  if (
    charactersResponse.value &&
    charactersResponse.value.code === 200 &&
    charactersResponse.value.data &&
    charactersResponse.value.data.results
  ) {
    return charactersResponse.value.data.results;
  }
  return [];
});

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value);
});

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};
</script>

<template>
  <div>
    <p v-if="pending" class="text-white text-center mb-2">
      Loading characters...
    </p>

    <div v-else-if="error" class="error">
      Failed to load characters. Please try again.
      <button @click="refresh" class="retry-button">Retry</button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        v-for="character in characters"
        :key="character.id"
        class="flex flex-col gap-y-4 p-4 border border-transparent hover:border-[#404244] transition duration-300 rounded-lg"
      >
        <NuxtLink
          :to="`/character/${character.id}`"
          :title="character.name"
          class="rounded-lg block"
        >
          <img
            :src="`${character.thumbnail.path}.${character.thumbnail.extension}`"
            :alt="character.name"
            width="216"
            height="216"
            class="aspect-[296/391] md:aspect-[352/469] w-full block h-auto rounded-lg"
            loading="lazy"
          />
        </NuxtLink>
        <NuxtLink
          :to="`/character/${character.id}`"
          :title="character.name"
          class="text-white text-base font-medium"
        >
          <h3>{{ character.name }}</h3>
        </NuxtLink>
      </div>
    </div>

    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @change-page="handlePageChange"
    />
  </div>
</template>
