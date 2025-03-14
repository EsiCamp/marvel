import CryptoJS from "crypto-js";

const getAuthParams = () => {
  const config = useRuntimeConfig();
  const API_PUBLIC_KEY = config.public.marvelPublicKey;
  const API_PRIVATE_KEY = config.marvelPrivateKey;
  const ts = new Date().getTime();
  const hash = CryptoJS.MD5(ts + API_PRIVATE_KEY + API_PUBLIC_KEY).toString();
  return {
    ts,
    apikey: API_PUBLIC_KEY,
    hash,
  };
};

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.error("Request timeout");
    } else {
      console.error(`Error fetching from Marvel API:`, error);
    }
    throw createError({
      statusCode: error.name === "AbortError" ? 408 : 500,
      statusMessage:
        error.name === "AbortError"
          ? "Request Timeout"
          : "Failed to fetch from Marvel API",
    });
  }
};

const transformCharacter = (character) => {
  return {
    id: character.id,
    name: character.name,
    description: character.description,
    thumbnail: character.thumbnail,
    urls: character.urls,
    comics: {
      available: character.comics.available,
      items: character.comics.items?.slice(0, 5) || [],
    },
    series: {
      available: character.series.available,
      items: character.series.items?.slice(0, 5) || [],
    },
  };
};

const transformComic = (comic) => {
  return {
    id: comic.id,
    title: comic.title,
    description: comic.description,
    thumbnail: comic.thumbnail,
    dates: comic.dates,
    pageCount: comic.pageCount,
    urls: comic.urls,
  };
};

const transformSeries = (series) => {
  return {
    id: series.id,
    title: series.title,
    description: series.description,
    thumbnail: series.thumbnail,
    startYear: series.startYear,
    endYear: series.endYear,
    urls: series.urls,
  };
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.marvelBaseUrl;
  const query = getQuery(event);
  const endpoint = event.context.params.endpoint;
  const authParams = getAuthParams();

  switch (endpoint) {
    case "characters": {
      const queryParams = new URLSearchParams({
        ...authParams,
        ...query,
      });
      const url = `${API_BASE_URL}/characters?${queryParams}`;
      const response = await fetchWithTimeout(url);
      if (response.code === 200 && response.data && response.data.results) {
        response.data.results = response.data.results.map(transformCharacter);
      }
      return response;
    }

    case "character": {
      if (!query.id) {
        throw createError({
          statusCode: 400,
          statusMessage: "Character ID is required",
        });
      }
      const url = `${API_BASE_URL}/characters/${query.id}?${new URLSearchParams(
        authParams
      )}`;
      const response = await fetchWithTimeout(url);
      if (response.code === 200 && response.data && response.data.results) {
        response.data.results = response.data.results.map(transformCharacter);
      }
      return response;
    }

    case "comics": {
      const queryParams = new URLSearchParams({
        ...authParams,
        ...query,
      });
      const url = `${API_BASE_URL}/comics?${queryParams}`;
      const response = await fetchWithTimeout(url);
      if (response.code === 200 && response.data && response.data.results) {
        response.data.results = response.data.results.map(transformComic);
      }
      return response;
    }

    case "series": {
      const queryParams = new URLSearchParams({
        ...authParams,
        ...query,
      });
      const url = `${API_BASE_URL}/series?${queryParams}`;
      const response = await fetchWithTimeout(url);
      if (response.code === 200 && response.data && response.data.results) {
        response.data.results = response.data.results.map(transformSeries);
      }
      return response;
    }

    default:
      throw createError({
        statusCode: 404,
        statusMessage: "API endpoint not found",
      });
  }
});
