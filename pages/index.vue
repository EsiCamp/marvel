<script setup>
import { useHead } from "#app";
import MarvelCharacters from "~/components/home/MarvelCharacters.vue";

useHead({
  title: "Marvel Characters",
  meta: [
    { name: "description", content: "Explore the Marvel Universe characters" },
    { name: "keywords", content: "marvel, superheroes, comics, characters" },
  ],
});
</script>

<template>
  <div class="bg-[#2c2e30]">
    <div class="max-w-[1608px] mx-auto">
      <div class="pt-8 md:pt-16 px-4 md:px-0">
        <MarvelCharacters />
      </div>
    </div>
  </div>
</template>
