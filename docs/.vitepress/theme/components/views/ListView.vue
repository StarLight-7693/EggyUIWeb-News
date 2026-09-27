<script setup lang="ts">
import ChipsNav from '../ChipsNav.vue';
import CardGrid from '../CardGrid.vue';
import Pagination from '../Pagination.vue';
import type { Post } from '@/types';

// 列表页通用外壳：标题 + 快捷入口 + 卡片网格 + 分页
defineProps<{
  title: string;
  posts: Post[];
  current: number;
  totalPages: number;
  firstHref: string;
  pagePrefix: string;
}>();
</script>

<template>
  <div class="page news-home">
    <div class="container">
      <div class="list-utils">
        <h1 class="list-title">{{ title }}</h1>
        <ChipsNav />
      </div>

      <CardGrid :posts="posts" />

      <Pagination
        :current="current"
        :total-pages="totalPages"
        :first-href="firstHref"
        :page-prefix="pagePrefix"
      />
    </div>
  </div>
</template>