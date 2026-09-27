<script setup lang="ts">
import { computed } from 'vue';
import TermIndexView from './TermIndexView.vue';
import { allPosts } from '@/composables/usePosts';
import { termPath } from '@/utils';
import type { TermItem } from '@/types';

const items = computed<TermItem[]>(() => {
  const counts = new Map<string, number>();
  for (const post of allPosts) {
    for (const name of post.categories) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()].map(([name, count]) => ({
    name,
    count,
    path: termPath('categories', name),
  }));
});
</script>

<template>
  <TermIndexView title="分类" :items="items" />
</template>