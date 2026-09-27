<script setup lang="ts">
import { computed } from 'vue';
import ListView from './ListView.vue';
import { allPosts, usePagedPosts } from '@/composables/usePosts';
import { termPagePrefix, termPath } from '@/utils';

const props = defineProps<{ name: string; page: number }>();

const source = () => allPosts.filter((post) => post.categories.includes(props.name));
const { pagePosts, page, totalPages } = usePagedPosts(() => props.page, source);

const title = computed(() => `分类：${props.name}`);
</script>

<template>
  <ListView
    :title="title"
    :posts="pagePosts"
    :current="page"
    :total-pages="totalPages"
    :first-href="termPath('categories', name)"
    :page-prefix="termPagePrefix('categories', name)"
  />
</template>