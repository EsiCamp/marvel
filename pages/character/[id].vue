<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "#app";
import marvelService from "~/services/marvel";
import DetailCharacter from "~/components/detail/DetailCharacter.vue";
import CharacterInfo from "~/components/detail/CharacterInfo.vue";

definePageMeta({
  layout: "detail",
});

const route = useRoute();
const characterId = route.params.id;

const {
  data: characterData,
  pending: characterPending,
  error: characterError,
} = await useAsyncData(
  `character-${characterId}`,
  async () => {
    const response = await marvelService.getCharacterById(characterId);
    if (response.code === 200 && response.data.results.length > 0) {
      return response.data.results[0];
    }
    throw new Error("Character not found");
  },
  {
    server: true,
    lazy: false,
  }
);

const hasCharacter = computed(
  () => characterData.value !== null && characterData.value !== undefined
);

const { data: comicsList, pending: comicsPending } = await useAsyncData(
  `comics-${characterId}`,
  async () => {
    if (!hasCharacter.value) return [];
    try {
      const params = {
        limit: 10,
        orderBy: "-onsaleDate",
        characters: characterId,
      };
      const response = await marvelService.getComics(params);
      if (response.code === 200) {
        return response.data.results;
      }
      return [];
    } catch (err) {
      console.error("Error fetching comics:", err);
      return [];
    }
  },
  {
    server: true,
    lazy: false,
    watch: [characterData],
  }
);

const { data: seriesList, pending: seriesPending } = await useAsyncData(
  `series-${characterId}`,
  async () => {
    if (!hasCharacter.value) return [];
    try {
      const params = {
        limit: 10,
        characters: characterId,
      };
      const response = await marvelService.getSeries(params);
      if (response.code === 200) {
        return response.data.results;
      }
      return [];
    } catch (err) {
      console.error("Error fetching series:", err);
      return [];
    }
  },
  {
    server: true,
    lazy: false,
    watch: [characterData],
  }
);

const displaySeries = computed(() => {
  if (seriesList.value && seriesList.value.length > 0) {
    return seriesList.value;
  } else if (
    characterData.value &&
    characterData.value.series &&
    characterData.value.series.items &&
    characterData.value.series.items.length > 0
  ) {
    return characterData.value.series.items.map((item, index) => ({
      id: `series-${index}`,
      name: item.name,
      resourceURI: item.resourceURI,
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
        extension: "jpg",
      },
    }));
  }
  return [];
});

useHead(() => ({
  title: hasCharacter.value
    ? `${characterData.value?.name} | Marvel Character`
    : "Character Details | Marvel Explorer",
  meta: [
    {
      name: "description",
      content:
        hasCharacter.value && characterData.value?.description
          ? characterData.value.description
          : hasCharacter.value
          ? `Details about ${characterData.value?.name} from Marvel Comics`
          : "Details about Marvel characters",
    },
    {
      name: "keywords",
      content: hasCharacter.value
        ? `marvel, ${characterData.value?.name}, superheroes, comics, character`
        : "marvel, superheroes, comics, characters",
    },
  ],
}));

const isLoading = computed(
  () => characterPending.value || comicsPending.value || seriesPending.value
);

if (characterError.value) {
  console.error("Character not found, redirecting to home page");
}

const getImageUrl = (thumbnail) => {
  if (!thumbnail || !thumbnail.path || !thumbnail.extension) {
    return "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
  }
  return `${thumbnail.path}.${thumbnail.extension}`;
};
</script>

<template>
  <div class="detail-header">
    <div class="max-w-[1608px] mx-auto">
      <div class="pt-8 md:pt-16 px-4 md:px-0">
        <div v-if="isLoading" class="loading text-white text-center py-12">
          Loading character details...
        </div>

        <div
          v-else-if="characterError"
          class="text-[#f0141e] text-center py-12"
        >
          Character not found
        </div>

        <div v-else-if="characterData">
          <CharacterInfo :character="characterData" />

          <DetailCharacter
            :items="comicsList || []"
            :loading="comicsPending"
            title="Comics"
            emptyMessage="No comics available for this character."
            class="pb-8"
          />

          <DetailCharacter
            :items="displaySeries"
            :loading="seriesPending"
            title="Series"
            emptyMessage="No series available for this character."
            class="pb-16"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-header {
  background: linear-gradient(90deg, #2c2e30 -0.76%, #0e0e0e 50%);
}
</style>
