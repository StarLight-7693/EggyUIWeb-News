<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useData } from 'vitepress';
import CardGrid from '../CardGrid.vue';
import { data as allPosts } from '@/posts.data';

// 原 themes/eggyui/source/js/search.js 的本地检索（TS + Vue 化）：
// 读取 ?q=，对标题 / 正文 / 标签做前端过滤，无需后端。
const { page } = useData();
const query = ref('');

function readQuery() {
  if (typeof window === 'undefined') return;
  query.value = (new URLSearchParams(window.location.search).get('q') || '').trim();
}

onMounted(readQuery);
watch(
  () => page.value.relativePath,
  () => readQuery(),
);

const tokens = computed(() => query.value.toLowerCase().split(/\s+/).filter(Boolean));

const hits = computed(() => {
  if (!tokens.value.length) return [];
  return allPosts.filter((post) => {
    const haystack = [post.title, post.content, post.tags.join(' ')].map((text) =>
      text.toLowerCase(),
    );
    return tokens.value.every((token) => haystack.some((text) => text.includes(token)));
  });
});

const stats = computed(() => {
  if (!query.value) return '输入关键词开始搜索新闻。';
  if (!hits.value.length) return `未找到与“${query.value}”相关的新闻。`;
  return `找到 ${hits.value.length} 条与“${query.value}”相关的结果`;
});

// 提交时把关键词写回地址栏，保持 /search/?q= 契约（便于分享与主站跨站跳转）
function onSubmit() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('q', query.value.trim());
  window.history.replaceState(null, '', url);
}
</script>

<template>
  <div class="page news-home">
    <div class="container">
      <div class="list-utils">
        <h1 class="list-title">搜索</h1>
      </div>

      <form class="search-form big" role="search" @submit.prevent="onSubmit">
        <span class="search-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          v-model="query"
          type="search"
          name="q"
          placeholder="搜索新闻标题与正文..."
          aria-label="搜索新闻"
          autocomplete="off"
        />
        <button type="submit" class="btn btn-primary">搜索</button>
      </form>

      <div class="search-tip">{{ stats }}</div>

      <CardGrid v-if="tokens.length" :posts="hits" empty-text="未找到相关新闻" />
    </div>
  </div>
</template>