<script setup>
import { ref, computed, watch } from "vue";
import marvelService from "~/services/marvel";

const currentPage = ref(0);
const pageSize = ref(12);
const searchQuery = ref("");
const searchTimeout = ref(null);

const fetchCharactersData = async () => {
  const offset = currentPage.value * pageSize.value;
  const params = {
    limit: pageSize.value,
    offset: offset,
  };
  if (searchQuery.value) {
    params.nameStartsWith = searchQuery.value;
  }
  return await marvelService.getCharacters(params);
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

const hasMorePages = computed(() => {
  return characters.value.length >= pageSize.value;
});

const changePage = (newPage) => {
  if (newPage >= 0) {
    currentPage.value = newPage;
  }
};

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 0;
  }, 500);
};
</script>

<template>
  <div class="marvel-characters">
    <div class="search-container">
      <input
        v-model="searchQuery"
        @input="debounceSearch"
        placeholder="Search characters..."
        class="search-input"
      />
    </div>

    <div v-if="pending" class="loading">Loading characters...</div>

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

    <!-- Pagination -->
    <div class="pagination">
      <button
        :disabled="currentPage === 0"
        @click="changePage(currentPage - 1)"
        class="pagination-button"
      >
        Previous
      </button>
      <span>Page {{ currentPage + 1 }}</span>
      <button
        :disabled="!hasMorePages"
        @click="changePage(currentPage + 1)"
        class="pagination-button"
      >
        Next
      </button>
    </div>
  </div>
</template>
