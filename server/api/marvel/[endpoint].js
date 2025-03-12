import CryptoJS from "crypto-js";

const config = useRuntimeConfig();
const API_PUBLIC_KEY = config.public.marvelPublicKey;
const API_PRIVATE_KEY = config.marvelPrivateKey;
const API_BASE_URL = config.public.marvelBaseUrl;

const getAuthParams = () => {
  const ts = new Date().getTime();
  const hash = CryptoJS.MD5(ts + API_PRIVATE_KEY + API_PUBLIC_KEY).toString();
  return {
    ts,
    apikey: API_PUBLIC_KEY,
    hash,
  };
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const endpoint = event.context.params.endpoint;
  const authParams = getAuthParams();
  const queryParams = new URLSearchParams({
    ...authParams,
    ...query,
  });

  let url = "";

  switch (endpoint) {
    case "characters":
      url = `${API_BASE_URL}/characters?${queryParams}`;
      break;
    case "character":
      if (query.id) {
        url = `${API_BASE_URL}/characters/${query.id}?${new URLSearchParams(
          authParams
        )}`;
      } else {
        throw createError({
          statusCode: 400,
          statusMessage: "Character ID is required",
        });
      }
      break;
    case "comics":
      url = `${API_BASE_URL}/comics?${queryParams}`;
      break;
    case "series":
      url = `${API_BASE_URL}/series?${queryParams}`;
      break;
    default:
      throw createError({
        statusCode: 404,
        statusMessage: "API endpoint not found",
      });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching Marvel API (${endpoint}):`, error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch from Marvel API",
    });
  }
});
