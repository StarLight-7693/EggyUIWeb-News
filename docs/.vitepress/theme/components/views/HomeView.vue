<script setup lang="ts">
import ListView from './ListView.vue';
import { usePagedPosts } from '@/composables/usePosts';

const props = defineProps<{ page: number }>();
const { pagePosts, page, totalPages } = usePagedPosts(() => props.page);
</script>

<template>
  <ListView
    title="新闻"
    :posts="pagePosts"
    :current="page"
    :total-pages="totalPages"
    first-href="/"
    page-prefix="/page/"
  />
</template>