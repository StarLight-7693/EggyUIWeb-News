<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import type { Post } from '@/types';

const props = defineProps<{ post: Post }>();

// 封面：外链原样输出，站内相对路径补 base
const coverSrc = computed(() => {
  const cover = props.post.cover;
  if (!cover) return withBase('/images/default_cover.png');
  if (/^(?:https?:|data:)/i.test(cover)) return cover;
  return withBase(cover.startsWith('/') ? cover : `/${cover}`);
});
</script>

<template>
  <a class="card" :href="withBase(post.url)">
    <div class="card-cover">
      <img :src="coverSrc" :alt="post.title" loading="lazy" />
    </div>
    <div class="card-body">
      <div class="card-text">
        <span class="card-title">{{ post.title }}</span>
        <time class="card-date">{{ post.date }}</time>
      </div>
      <svg
        class="card-arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </svg>
    </div>
  </a>
</template>