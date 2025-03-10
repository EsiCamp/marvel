<script setup>
import { ref, onMounted, onServerPrefetch } from "vue";
import { useAsyncData } from "nuxt/app";
import marvelService from "~/services/marvel";
import { useRouter } from "vue-router";
const router = useRouter();

const characters = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(0);
const pageSize = ref(20);
const searchQuery = ref("");
const searchTimeout = ref(null);
const selectedCharacter = ref(null);

const getSecureImageUrl = (thumbnail, size = "portrait_xlarge") => {
  if (!thumbnail) return "";
  const path = thumbnail.path.replace("http:", "https:");
  return `${path}/${size}.${thumbnail.extension}`;
};

const fetchCharacters = async () => {
  loading.value = true;
  error.value = null;

  try {
    const offset = currentPage.value * pageSize.value;
    const params = {
      limit: pageSize.value,
      offset: offset,
    };

    if (searchQuery.value) {
      params.nameStartsWith = searchQuery.value;
    }

    const response = await marvelService.getCharacters(params);

    if (response.code === 200) {
      characters.value = response.data.results;
    } else {
      error.value = `API Error: ${response.status}`;
    }
  } catch (err) {
    error.value = "Failed to load characters. Please try again.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onServerPrefetch(async () => {
  await fetchCharacters();
});

onMounted(() => {
  if (characters.value.length === 0) {
    fetchCharacters();
  }
});

const changePage = (newPage) => {
  if (newPage >= 0) {
    currentPage.value = newPage;
    fetchCharacters();
  }
};

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    currentPage.value = 0;
    fetchCharacters();
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

    <div v-if="loading" class="loading">Loading characters...</div>

    <div v-else-if="error" class="error">
      {{ error }}
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
        :disabled="characters.length < pageSize"
        @click="changePage(currentPage + 1)"
        class="pagination-button"
      >
        Next
      </button>
    </div>

    <div v-if="selectedCharacter" class="modal">
      <div class="modal-content">
        <span class="close" @click="selectedCharacter = null">&times;</span>
        <div class="character-detail">
          <div class="character-detail-image">
            <img
              :src="
                getSecureImageUrl(
                  selectedCharacter.thumbnail,
                  'portrait_uncanny'
                )
              "
              :alt="selectedCharacter.name"
            />
          </div>
          <div class="character-detail-info">
            <h2>{{ selectedCharacter.name }}</h2>
            <p v-if="selectedCharacter.description">
              {{ selectedCharacter.description }}
            </p>
            <p v-else>No description available.</p>

            <div
              v-if="
                selectedCharacter.comics &&
                selectedCharacter.comics.items.length
              "
            >
              <h3>Featured in Comics:</h3>
              <ul>
                <li
                  v-for="(comic, index) in selectedCharacter.comics.items.slice(
                    0,
                    5
                  )"
                  :key="index"
                >
                  {{ comic.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="attribution">
      Data provided by Marvel. © {{ new Date().getFullYear() }} MARVEL
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

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 28px;
  cursor: pointer;
}

.character-detail {
  display: flex;
  gap: 30px;
}

.character-detail-image {
  flex: 0 0 40%;
}

.character-detail-image img {
  width: 100%;
  border-radius: 8px;
}

.character-detail-info {
  flex: 1;
}

.attribution {
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .character-detail {
    flex-direction: column;
  }

  .characters-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
