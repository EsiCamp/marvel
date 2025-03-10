// pages/character/[id].vue
<script setup>
import { ref, onMounted, onServerPrefetch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "#app";
import marvelService from "~/services/marvel";

const route = useRoute();
const router = useRouter();
const character = ref(null);
const loading = ref(true);
const error = ref(null);
const comicsList = ref([]);

// Set page metadata
const updateMetadata = () => {
  if (character.value) {
    useHead({
      title: `${character.value.name} | Marvel Character`,
      meta: [
        {
          name: "description",
          content:
            character.value.description ||
            `Details about ${character.value.name} from Marvel Comics`,
        },
        {
          name: "keywords",
          content: `marvel, ${character.value.name}, superheroes, comics, character`,
        },
      ],
    });
  } else {
    useHead({
      title: "Character Details | Marvel Explorer",
      meta: [
        { name: "description", content: "Details about Marvel characters" },
        {
          name: "keywords",
          content: "marvel, superheroes, comics, characters",
        },
      ],
    });
  }
};

// Function to convert HTTP URLs to HTTPS
const getSecureImageUrl = (thumbnail, size = "portrait_incredible") => {
  if (!thumbnail) return "";
  const path = thumbnail.path.replace("http:", "https:");
  return `${path}/${size}.${thumbnail.extension}`;
};

// Fetch character data
const fetchCharacter = async () => {
  const characterId = route.params.id;
  if (!characterId) {
    router.push("/");
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await marvelService.getCharacterById(characterId);

    if (response.code === 200 && response.data.results.length > 0) {
      character.value = response.data.results[0];
      updateMetadata();

      // Fetch comics if character has any
      if (character.value.comics && character.value.comics.available > 0) {
        await fetchCharacterComics(characterId);
      }
    } else {
      error.value = "Character not found";
      router.push("/");
    }
  } catch (err) {
    error.value = "Failed to load character details. Please try again.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Fetch comics for the character
const fetchCharacterComics = async (characterId) => {
  try {
    const params = {
      limit: 10,
      orderBy: "-onsaleDate",
      characters: characterId,
    };

    const response = await marvelService.getComics(params);

    if (response.code === 200) {
      comicsList.value = response.data.results;
    }
  } catch (err) {
    console.error("Error fetching comics:", err);
  }
};

// Go back to characters list
const goBack = () => {
  router.push("/");
};

// For SSR prefetching
onServerPrefetch(async () => {
  await fetchCharacter();
});

// For client-side
onMounted(() => {
  if (!character.value) {
    fetchCharacter();
  }
});
</script>

<template>
  <div class="character-detail-page">
    <button @click="goBack" class="back-button">← Back to Characters</button>

    <div v-if="loading" class="loading">Loading character details...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="character" class="character-container">
      <div class="character-header">
        <div class="character-image">
          <img
            :src="getSecureImageUrl(character.thumbnail)"
            :alt="character.name"
          />
        </div>

        <div class="character-info">
          <h1>{{ character.name }}</h1>

          <div class="character-description">
            <p v-if="character.description">{{ character.description }}</p>
            <p v-else>No description available for this character.</p>
          </div>

          <div class="character-stats">
            <div class="stat">
              <span class="stat-label">Comics:</span>
              <span class="stat-value">{{
                character.comics?.available || 0
              }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Series:</span>
              <span class="stat-value">{{
                character.series?.available || 0
              }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Stories:</span>
              <span class="stat-value">{{
                character.stories?.available || 0
              }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Events:</span>
              <span class="stat-value">{{
                character.events?.available || 0
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Comics section -->
      <div v-if="comicsList.length > 0" class="comics-section">
        <h2>Recent Comics</h2>
        <div class="comics-grid">
          <div v-for="comic in comicsList" :key="comic.id" class="comic-card">
            <div class="comic-image">
              <img
                :src="getSecureImageUrl(comic.thumbnail, 'portrait_medium')"
                :alt="comic.title"
              />
            </div>
            <div class="comic-info">
              <h3>{{ comic.title }}</h3>
              <p v-if="comic.description" class="comic-description">
                {{ comic.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Links section -->
      <div
        v-if="character.urls && character.urls.length > 0"
        class="links-section"
      >
        <h2>External Resources</h2>
        <div class="links-list">
          <a
            v-for="(link, index) in character.urls"
            :key="index"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="external-link"
          >
            {{
              link.type === "detail"
                ? "Marvel Profile"
                : link.type === "wiki"
                ? "Marvel Wiki"
                : link.type === "comiclink"
                ? "Comics"
                : link.type
            }}
          </a>
        </div>
      </div>
    </div>

    <!-- Marvel attribution -->
    <div class="attribution">
      Data provided by Marvel. © {{ new Date().getFullYear() }} MARVEL
    </div>
  </div>
</template>

<style scoped>
.character-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #f0141e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.character-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.character-header {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

@media (min-width: 768px) {
  .character-header {
    flex-direction: row;
  }
}

.character-image {
  flex: 0 0 300px;
  margin-right: 0;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .character-image {
    margin-right: 30px;
    margin-bottom: 0;
  }
}

.character-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.character-info {
  flex: 1;
}

.character-info h1 {
  color: #f0141e;
  margin-top: 0;
  font-size: 32px;
}

.character-description {
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.6;
}

.character-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.stat {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.stat-label {
  display: block;
  font-weight: bold;
  color: #f0141e;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 18px;
}

.comics-section,
.links-section {
  padding: 20px;
  border-top: 1px solid #eee;
}

.comics-section h2,
.links-section h2 {
  color: #f0141e;
  margin-top: 0;
}

.comics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.comic-card {
  display: flex;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
}

.comic-image {
  flex: 0 0 100px;
}

.comic-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comic-info {
  flex: 1;
  padding: 10px;
}

.comic-info h3 {
  margin-top: 0;
  font-size: 16px;
}

.comic-description {
  font-size: 14px;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.links-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.external-link {
  display: inline-block;
  padding: 8px 16px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.external-link:hover {
  background-color: #f0141e;
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

.attribution {
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  color: #666;
}
</style>
