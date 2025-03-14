export const useCharacter = () => {
  const cache = useState("character-cache", () => ({}));
  const cacheExpiry = useState("character-cache-expiry", () => ({}));
  const CACHE_DURATION = 10 * 60 * 1000;

  const isCacheValid = (key) => {
    return (
      cache.value[key] &&
      cacheExpiry.value[key] &&
      cacheExpiry.value[key] > Date.now()
    );
  };

  const getCharacterById = async (characterId) => {
    const cacheKey = `character-${characterId}`;
    if (process.client && isCacheValid(cacheKey)) {
      return cache.value[cacheKey];
    }
    try {
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/character?id=${characterId}`
      );
      const data = await response.json();
      if (process.client) {
        cache.value[cacheKey] = data;
        cacheExpiry.value[cacheKey] = Date.now() + CACHE_DURATION;
      }
      return data;
    } catch (error) {
      console.error(`Error fetching Marvel character ${characterId}:`, error);
      throw error;
    }
  };

  const getCharacterComics = async (characterId, params = {}) => {
    const paramsKey = JSON.stringify(params);
    const cacheKey = `comics-${characterId}-${paramsKey}`;
    if (process.client && isCacheValid(cacheKey)) {
      return cache.value[cacheKey];
    }
    try {
      const queryParams = new URLSearchParams({
        ...params,
        characters: characterId,
      }).toString();
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/comics?${queryParams}`
      );
      const data = await response.json();
      if (process.client) {
        cache.value[cacheKey] = data;
        cacheExpiry.value[cacheKey] = Date.now() + CACHE_DURATION;
      }
      return data;
    } catch (error) {
      console.error(
        `Error fetching comics for character ${characterId}:`,
        error
      );
      throw error;
    }
  };

  const getCharacterSeries = async (characterId, params = {}) => {
    const paramsKey = JSON.stringify(params);
    const cacheKey = `series-${characterId}-${paramsKey}`;
    if (process.client && isCacheValid(cacheKey)) {
      return cache.value[cacheKey];
    }
    try {
      const queryParams = new URLSearchParams({
        ...params,
        characters: characterId,
      }).toString();
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/series?${queryParams}`
      );
      const data = await response.json();
      if (process.client) {
        cache.value[cacheKey] = data;
        cacheExpiry.value[cacheKey] = Date.now() + CACHE_DURATION;
      }
      return data;
    } catch (error) {
      console.error(
        `Error fetching series for character ${characterId}:`,
        error
      );
      throw error;
    }
  };

  return {
    getCharacterById,
    getCharacterComics,
    getCharacterSeries,
  };
};
