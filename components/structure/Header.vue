<script setup>
import { useRoute, useRouter } from "vue-router";

const searchQuery = useState("marvelSearch", () => "");
const route = useRoute();
const router = useRouter();

const handleSearch = () => {
  if (route.path !== "/") {
    router.push("/");
  }
};
</script>

<template>
  <header class="header px-4 md:px-0 pt-2.5 pb-6">
    <div class="flex flex-col gap-y-[26px] max-w-[1608px] mx-auto">
      <div>
        <NuxtLink
          to="/"
          title="LOGO"
          class="bg-[#DC2626] text-white text-sm rounded-sm py-[6.5px] px-[9.85px] align-middle inline-block font-medium"
          >LOGO</NuxtLink
        >
      </div>
      <div class="flex items-center gap-4 p-4 rounded-lg bg-[#2C2E30]">
        <input
          v-model="searchQuery"
          placeholder="Search for characters..."
          class="bg-[#3B3D3F] px-4 py-[13.5px] rounded-sm text-sm leading-[21px] font-normal text-white w-full h-full"
        />
        <button @click="handleSearch" class="bg-[#DC2626] p-4 rounded-sm">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.70829 12.6876C3.41246 12.6876 0.729126 10.0042 0.729126 6.70841C0.729126 3.41258 3.41246 0.729248 6.70829 0.729248C10.0041 0.729248 12.6875 3.41258 12.6875 6.70841C12.6875 10.0042 10.0041 12.6876 6.70829 12.6876ZM6.70829 1.60425C3.89079 1.60425 1.60413 3.89675 1.60413 6.70841C1.60413 9.52008 3.89079 11.8126 6.70829 11.8126C9.52579 11.8126 11.8125 9.52008 11.8125 6.70841C11.8125 3.89675 9.52579 1.60425 6.70829 1.60425Z"
              fill="white"
            />
            <path
              d="M12.8333 13.2709C12.7225 13.2709 12.6116 13.2301 12.5241 13.1426L11.3575 11.9759C11.1883 11.8068 11.1883 11.5268 11.3575 11.3576C11.5266 11.1884 11.8066 11.1884 11.9758 11.3576L13.1425 12.5243C13.3116 12.6934 13.3116 12.9734 13.1425 13.1426C13.055 13.2301 12.9441 13.2709 12.8333 13.2709Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(90deg, #2c2e30 -0.76%, #0e0e0e 50%);
}
</style>
