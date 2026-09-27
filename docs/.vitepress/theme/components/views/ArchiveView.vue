<script setup lang="ts">
import { computed } from 'vue';
import ChipsNav from '../ChipsNav.vue';
import CardGrid from '../CardGrid.vue';
import Pagination from '../Pagination.vue';
import { usePagedPosts } from '@/composables/usePosts';
import type { Post } from '@/types';

const props = defineProps<{ page: number }>();
const { pagePosts, page, totalPages } = usePagedPosts(() => props.page);

// 与 Hexo archive 一致：先分页，再把当前页按「YYYY 年 M 月」分组
const groups = computed(() => {
  const map = new Map<string, Post[]>();
  for (const post of pagePosts.value) {
    const key = post.date.slice(0, 7);
    const bucket = map.get(key);
    if (bucket) bucket.push(post);
    else map.set(key, [post]);
  }
  return [...map.entries()].map(([key, posts]) => {
    const [year, month] = key.split('-');
    return { key, label: `${year} 年 ${parseInt(month, 10)} 月`, posts };
  });
});
</script>

<template>
  <div class="page news-home">
    <div class="container">
      <div class="list-utils">
        <h1 class="list-title">归档</h1>
        <ChipsNav />
      </div>

      <p v-if="!groups.length" class="empty-state">暂无归档内容</p>

      <div v-for="group in groups" :key="group.key" class="month-group">
        <h2 class="month-title">{{ group.label }}</h2>
        <CardGrid :posts="group.posts" />
      </div>

      <Pagination
        :current="page"
        :total-pages="totalPages"
        first-href="/archives/"
        page-prefix="/archives/page/"
      />
    </div>
  </div>
</template>