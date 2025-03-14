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
      return await fetchWithTimeout(url);
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
      return await fetchWithTimeout(url);
    }

    case "comics": {
      const queryParams = new URLSearchParams({
        ...authParams,
        ...query,
      });
      const url = `${API_BASE_URL}/comics?${queryParams}`;
      return await fetchWithTimeout(url);
    }

    case "series": {
      const queryParams = new URLSearchParams({
        ...authParams,
        ...query,
      });
      const url = `${API_BASE_URL}/series?${queryParams}`;
      return await fetchWithTimeout(url);
    }

    default:
      throw createError({
        statusCode: 404,
        statusMessage: "API endpoint not found",
      });
  }
});
