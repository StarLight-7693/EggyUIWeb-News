<script setup lang="ts">
import PostCard from './PostCard.vue';
import type { Post } from '@/types';

withDefaults(
  defineProps<{
    posts: Post[];
    emptyText?: string;
  }>(),
  { emptyText: '暂无内容' },
);
</script>

<template>
  <div class="card-grid">
    <p v-if="!posts.length" class="empty-state">{{ emptyText }}</p>
    <template v-else>
      <PostCard v-for="post in posts" :key="post.url" :post="post" />
    </template>
  </div>
</template>