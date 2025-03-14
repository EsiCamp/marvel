<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  emptyMessage: {
    type: String,
    default: "No items available.",
  },
});

const getImageUrl = (thumbnail) => {
  if (!thumbnail || !thumbnail.path || !thumbnail.extension) {
    return "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
  }
  return `${thumbnail.path}.${thumbnail.extension}`;
};

const getItemTitle = (item) => {
  return item.title || item.name || "Untitled";
};
</script>

<template>
  <div class="media-section">
    <h2 class="pt-8 pb-4 text-white text-lg font-medium">
      {{ title }}
    </h2>
    <div v-if="loading" class="text-white text-center py-8">
      Loading {{ title.toLowerCase() }}...
    </div>
    <div
      v-else-if="!items || items.length === 0"
      class="text-gray-400 text-center py-8"
    >
      {{ emptyMessage }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex flex-col gap-y-4 p-4 border border-transparent hover:border-[#404244] transition duration-300 rounded-lg"
      >
        <div class="rounded-lg block">
          <img
            :src="getImageUrl(item.thumbnail)"
            :alt="getItemTitle(item)"
            width="216"
            height="216"
            class="aspect-[296/391] md:aspect-[352/469] w-full block h-auto rounded-lg"
            loading="lazy"
          />
        </div>
        <div class="text-white text-base font-medium">
          <h3>{{ getItemTitle(item) }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
