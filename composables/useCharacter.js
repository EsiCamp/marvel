export const useCharacter = () => {
  const getCharacterById = async (characterId) => {
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
  };

  const getCharacterComics = async (characterId, params = {}) => {
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
      return await response.json();
    } catch (error) {
      console.error(
        `Error fetching comics for character ${characterId}:`,
        error
      );
      throw error;
    }
  };

  const getCharacterSeries = async (characterId, params = {}) => {
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
      return await response.json();
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
