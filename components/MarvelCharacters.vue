<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import marvelService from "~/services/marvel";

const router = useRouter();
const currentPage = ref(0);
const pageSize = ref(20);
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

const getSecureImageUrl = (thumbnail, size = "portrait_xlarge") => {
  if (!thumbnail) return "";
  const path = thumbnail.path.replace("http:", "https:");
  return `${path}/${size}.${thumbnail.extension}`;
};

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

const selectCharacter = (character) => {
  router.push(`/character/${character.id}`);
};
</script>

<template>
  <div class="marvel-characters">
    <h1>Marvel Characters</h1>

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

    <div v-else class="characters-grid">
      <div
        v-for="character in characters"
        :key="character.id"
        class="character-card"
        @click="selectCharacter(character)"
      >
        <div class="character-image">
          <img
            :src="getSecureImageUrl(character.thumbnail)"
            :alt="character.name"
          />
        </div>
        <div class="character-info">
          <h3>{{ character.name }}</h3>
        </div>
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

<style scoped>
.marvel-characters {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.character-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
  background-color: #fff;
}

.character-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.character-image img {
  width: 100%;
  height: auto;
  display: block;
}

.character-info {
  padding: 15px;
}

.character-info h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination-button {
  padding: 8px 16px;
  background-color: #f0141e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading,
.error {
  text-align: center;
  padding: 50px;
  font-size: 18px;
}

.error {
  color: #f0141e;
}

.retry-button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #f0141e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
