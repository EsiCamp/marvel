<script setup>
import { useHead } from "#app";

useHead({
  title: "Marvel Characters Explorer",
  meta: [
    { name: "description", content: "Explore the Marvel Universe characters" },
    { name: "keywords", content: "marvel, superheroes, comics, characters" },
  ],
});
</script>

<template>
  <div>
    <MarvelCharacters />
  </div>
</template>
