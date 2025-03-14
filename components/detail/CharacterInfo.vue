<script setup>
const props = defineProps({
  character: {
    type: Object,
    required: true,
  },
});

const getImageUrl = (thumbnail) => {
  if (!thumbnail || !thumbnail.path || !thumbnail.extension) {
    return "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
  }
  return `${thumbnail.path}.${thumbnail.extension}`;
};
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 md:gap-12">
    <div class="w-[180px] md:w-[240px]">
      <img
        v-if="character.thumbnail"
        :src="getImageUrl(character.thumbnail)"
        :alt="character.name"
        loading="lazy"
        class="w-full h-auto rounded-lg aspect-[180/180] md:aspect-[240/240]"
      />
    </div>
    <div class="flex flex-col md:justify-center gap-4">
      <h1 class="text-white font-[32px]">{{ character.name }}</h1>

      <p
        v-if="character.description"
        class="text-white text-xs md:text-sm text-[#F2F2F3]"
      >
        {{ character.description }}
      </p>

      <p v-else class="text-white text-xs md:text-sm text-[#F2F2F3]">
        No description available for this character.
      </p>

      <div class="flex gap-4">
        <NuxtLink
          to="#"
          class="text-white py-2 px-4 border border-[#E5E6E6] rounded-sm flex items-center gap-[8px]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.74996 8.81243C9.60746 8.81243 9.46496 8.75993 9.35246 8.64743C9.13496 8.42993 9.13496 8.06993 9.35246 7.85243L15.5025 1.70243C15.72 1.48493 16.08 1.48493 16.2975 1.70243C16.515 1.91993 16.515 2.27993 16.2975 2.49743L10.1475 8.64743C10.035 8.75993 9.89246 8.81243 9.74996 8.81243Z"
              fill="#F2F2F3"
            />
            <path
              d="M16.5 5.6625C16.1925 5.6625 15.9375 5.4075 15.9375 5.1V2.0625H12.9C12.5925 2.0625 12.3375 1.8075 12.3375 1.5C12.3375 1.1925 12.5925 0.9375 12.9 0.9375H16.5C16.8075 0.9375 17.0625 1.1925 17.0625 1.5V5.1C17.0625 5.4075 16.8075 5.6625 16.5 5.6625Z"
              fill="#F2F2F3"
            />
            <path
              d="M11.25 17.0625H6.75C2.6775 17.0625 0.9375 15.3225 0.9375 11.25V6.75C0.9375 2.6775 2.6775 0.9375 6.75 0.9375H8.25C8.5575 0.9375 8.8125 1.1925 8.8125 1.5C8.8125 1.8075 8.5575 2.0625 8.25 2.0625H6.75C3.2925 2.0625 2.0625 3.2925 2.0625 6.75V11.25C2.0625 14.7075 3.2925 15.9375 6.75 15.9375H11.25C14.7075 15.9375 15.9375 14.7075 15.9375 11.25V9.75C15.9375 9.4425 16.1925 9.1875 16.5 9.1875C16.8075 9.1875 17.0625 9.4425 17.0625 9.75V11.25C17.0625 15.3225 15.3225 17.0625 11.25 17.0625Z"
              fill="#F2F2F3"
            />
          </svg>
          <span class="text-xs md:text-sm">Details</span>
        </NuxtLink>
        <NuxtLink
          to="#"
          class="text-white py-2 px-4 border border-[#E5E6E6] rounded-sm flex items-center gap-[8px]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.74996 8.81243C9.60746 8.81243 9.46496 8.75993 9.35246 8.64743C9.13496 8.42993 9.13496 8.06993 9.35246 7.85243L15.5025 1.70243C15.72 1.48493 16.08 1.48493 16.2975 1.70243C16.515 1.91993 16.515 2.27993 16.2975 2.49743L10.1475 8.64743C10.035 8.75993 9.89246 8.81243 9.74996 8.81243Z"
              fill="#F2F2F3"
            />
            <path
              d="M16.5 5.6625C16.1925 5.6625 15.9375 5.4075 15.9375 5.1V2.0625H12.9C12.5925 2.0625 12.3375 1.8075 12.3375 1.5C12.3375 1.1925 12.5925 0.9375 12.9 0.9375H16.5C16.8075 0.9375 17.0625 1.1925 17.0625 1.5V5.1C17.0625 5.4075 16.8075 5.6625 16.5 5.6625Z"
              fill="#F2F2F3"
            />
            <path
              d="M11.25 17.0625H6.75C2.6775 17.0625 0.9375 15.3225 0.9375 11.25V6.75C0.9375 2.6775 2.6775 0.9375 6.75 0.9375H8.25C8.5575 0.9375 8.8125 1.1925 8.8125 1.5C8.8125 1.8075 8.5575 2.0625 8.25 2.0625H6.75C3.2925 2.0625 2.0625 3.2925 2.0625 6.75V11.25C2.0625 14.7075 3.2925 15.9375 6.75 15.9375H11.25C14.7075 15.9375 15.9375 14.7075 15.9375 11.25V9.75C15.9375 9.4425 16.1925 9.1875 16.5 9.1875C16.8075 9.1875 17.0625 9.4425 17.0625 9.75V11.25C17.0625 15.3225 15.3225 17.0625 11.25 17.0625Z"
              fill="#F2F2F3"
            />
          </svg>
          <span class="text-xs md:text-sm">Wiki</span>
        </NuxtLink>
        <NuxtLink
          to="#"
          class="text-white py-2 px-4 border border-[#E5E6E6] rounded-sm flex items-center gap-[8px]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.74996 8.81243C9.60746 8.81243 9.46496 8.75993 9.35246 8.64743C9.13496 8.42993 9.13496 8.06993 9.35246 7.85243L15.5025 1.70243C15.72 1.48493 16.08 1.48493 16.2975 1.70243C16.515 1.91993 16.515 2.27993 16.2975 2.49743L10.1475 8.64743C10.035 8.75993 9.89246 8.81243 9.74996 8.81243Z"
              fill="#F2F2F3"
            />
            <path
              d="M16.5 5.6625C16.1925 5.6625 15.9375 5.4075 15.9375 5.1V2.0625H12.9C12.5925 2.0625 12.3375 1.8075 12.3375 1.5C12.3375 1.1925 12.5925 0.9375 12.9 0.9375H16.5C16.8075 0.9375 17.0625 1.1925 17.0625 1.5V5.1C17.0625 5.4075 16.8075 5.6625 16.5 5.6625Z"
              fill="#F2F2F3"
            />
            <path
              d="M11.25 17.0625H6.75C2.6775 17.0625 0.9375 15.3225 0.9375 11.25V6.75C0.9375 2.6775 2.6775 0.9375 6.75 0.9375H8.25C8.5575 0.9375 8.8125 1.1925 8.8125 1.5C8.8125 1.8075 8.5575 2.0625 8.25 2.0625H6.75C3.2925 2.0625 2.0625 3.2925 2.0625 6.75V11.25C2.0625 14.7075 3.2925 15.9375 6.75 15.9375H11.25C14.7075 15.9375 15.9375 14.7075 15.9375 11.25V9.75C15.9375 9.4425 16.1925 9.1875 16.5 9.1875C16.8075 9.1875 17.0625 9.4425 17.0625 9.75V11.25C17.0625 15.3225 15.3225 17.0625 11.25 17.0625Z"
              fill="#F2F2F3"
            />
          </svg>
          <span class="text-xs md:text-sm">Comiclink</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
