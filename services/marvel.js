export default {
  async getCharacters(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/characters?${queryParams}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching Marvel characters:", error);
      throw error;
    }
  },

  async getCharacterById(characterId) {
    try {
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/character?id=${characterId}`
      );
      return await response.json();
    } catch (error) {
      console.error(`Error fetching Marvel character ${characterId}:`, error);
      throw error;
    }
  },

  async getComics(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const baseUrl = process.client
        ? window.location.origin
        : "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/marvel/comics?${queryParams}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching Marvel comics:", error);
      throw error;
    }
  },
};
