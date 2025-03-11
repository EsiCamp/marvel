<script setup>
import { ref, computed, watch } from "vue";
import marvelService from "~/services/marvel";

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

const paginationRange = computed(() => {
  const totalPageCount = totalPages.value;
  const currentPageNum = currentPage.value + 1;
  const siblingCount = 1;
  const totalPageNumbers = siblingCount * 2 + 3;
  if (totalPageCount <= totalPageNumbers) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1);
  }
  const leftSiblingIndex = Math.max(currentPageNum - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPageNum + siblingCount,
    totalPageCount
  );
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 1;
  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "RIGHT_DOTS", lastPageIndex];
  }
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPageCount - rightItemCount + i + 1
    );
    return [firstPageIndex, "LEFT_DOTS", ...rightRange];
  }
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [
      firstPageIndex,
      "LEFT_DOTS",
      ...middleRange,
      "RIGHT_DOTS",
      lastPageIndex,
    ];
  }
});

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    currentPage.value = newPage;
  }
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

    <div
      v-if="totalPages > 0"
      class="pt-6 pb-8 flex items-center justify-center gap-x-2"
    >
      <button
        @click="changePage(0)"
        :disabled="currentPage === 0"
        class="w-[24px] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        aria-label="First page"
      >
        &lt;&lt;
      </button>
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 0"
        class="w-[24px] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        &lt;
      </button>
      <template v-for="(pageNumber, index) in paginationRange" :key="index">
        <template
          v-if="pageNumber === 'LEFT_DOTS' || pageNumber === 'RIGHT_DOTS'"
        >
          <span class="text-[#989A9C] text-base font-medium">...</span>
        </template>
        <template v-else>
          <button
            @click="changePage(pageNumber - 1)"
            :class="[
              'rounded-full w-[24px] flex items-center justify-center text-base cursor-pointer',
              currentPage === pageNumber - 1
                ? 'bg-[#DC2626] text-white'
                : 'text-[#989A9C]',
            ]"
          >
            {{ pageNumber }}
          </button>
        </template>
      </template>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="w-[24px] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        &gt;
      </button>
      <button
        @click="changePage(totalPages - 1)"
        :disabled="currentPage >= totalPages - 1"
        class="w-[24px] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Last page"
      >
        &gt;&gt;
      </button>
    </div>
  </div>
</template>
