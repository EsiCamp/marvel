<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["changePage"]);

const paginationRange = computed(() => {
  const totalPageCount = props.totalPages;
  const currentPageNum = props.currentPage + 1;
  const siblingCount = 1;
  const totalPageNumbers = siblingCount * 2 + 3;
  if (totalPageCount <= totalPageNumbers) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1);
  }
  const leftSiblingIndex = Math.max(currentPageNum - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPageNum + siblingCount,
    totalPageCount
  );
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 1;
  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "RIGHT_DOTS", lastPageIndex];
  }
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPageCount - rightItemCount + i + 1
    );
    return [firstPageIndex, "LEFT_DOTS", ...rightRange];
  }
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [
      firstPageIndex,
      "LEFT_DOTS",
      ...middleRange,
      "RIGHT_DOTS",
      lastPageIndex,
    ];
  }
});

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < props.totalPages) {
    emit("changePage", newPage);
  }
};
</script>

<template>
  <div
    v-if="totalPages > 0"
    class="pt-6 pb-8 flex items-center justify-center gap-x-2"
  >
    <button
      @click="changePage(0)"
      :disabled="currentPage === 0"
      class="w-[24px] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      aria-label="First page"
    >
      &lt;&lt;
    </button>
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 0"
      class="w-[24px] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      aria-label="Previous page"
    >
      &lt;
    </button>
    <template v-for="(pageNumber, index) in paginationRange" :key="index">
      <template
        v-if="pageNumber === 'LEFT_DOTS' || pageNumber === 'RIGHT_DOTS'"
      >
        <span class="text-[#989A9C] text-base font-medium">...</span>
      </template>
      <template v-else>
        <button
          @click="changePage(pageNumber - 1)"
          :class="[
            'rounded-full w-[24px] flex items-center justify-center text-base cursor-pointer',
            currentPage === pageNumber - 1
              ? 'bg-[#DC2626] text-white'
              : 'text-[#989A9C]',
          ]"
        >
          {{ pageNumber }}
        </button>
      </template>
    </template>
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage >= totalPages - 1"
      class="w-[24px] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      aria-label="Next page"
    >
      &gt;
    </button>
    <button
      @click="changePage(totalPages - 1)"
      :disabled="currentPage >= totalPages - 1"
      class="w-[24px] text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      aria-label="Last page"
    >
      &gt;&gt;
    </button>
  </div>
</template>
