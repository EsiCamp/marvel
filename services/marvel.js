export default {
  async getCharacters(params = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const queryParams = new URLSearchParams(params).toString();
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/characters?${queryParams}`,
        {
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout");
      } else {
        console.error("Error fetching Marvel characters:", error);
      }
      throw error;
    }
  },

  async getCharacterById(characterId) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/character?id=${characterId}`,
        {
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout");
      } else {
        console.error(`Error fetching Marvel character ${characterId}:`, error);
      }
      throw error;
    }
  },

  async getComics(params = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const queryParams = new URLSearchParams(params).toString();
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/comics?${queryParams}`,
        {
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout");
      } else {
        console.error("Error fetching Marvel comics:", error);
      }
      throw error;
    }
  },

  async getSeries(params = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const queryParams = new URLSearchParams(params).toString();
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/series?${queryParams}`,
        {
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout");
      } else {
        console.error("Error fetching Marvel series:", error);
      }
      throw error;
    }
  },
};
