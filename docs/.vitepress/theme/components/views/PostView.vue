<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import GiscusComments from '../GiscusComments.vue';
import { data as allPosts } from '@/posts.data';
import { formatDate, termPath, toArray } from '@/utils';

// 文章详情（对齐原 post.ejs：返回链接 / 标题 / 时间 / 分类标签 / 正文 / 上下篇 / 评论）
const { page, frontmatter } = useData();

const categories = computed(() => toArray(frontmatter.value.categories));
const tags = computed(() => toArray(frontmatter.value.tags));
const dateText = computed(() => formatDate(frontmatter.value.date));

/** 去掉前后缀，便于用 relativePath（posts/x.md）匹配 loader 产出的 url（/posts/x.html） */
function normalize(value: string): string {
  return value.replace(/^\/+/, '').replace(/\.md$/, '').replace(/\.html$/, '');
}

const index = computed(() =>
  allPosts.findIndex((post) => normalize(post.url) === normalize(page.value.relativePath)),
);

// 按时间倒序：index-1 为更新的一篇，index+1 为更早的一篇
const prevPost = computed(() => (index.value > 0 ? allPosts[index.value - 1] : null));
const nextPost = computed(() =>
  index.value >= 0 && index.value < allPosts.length - 1 ? allPosts[index.value + 1] : null,
);
</script>

<template>
  <article class="page container single">
    <a class="back-link" :href="withBase('/')">← 返回新闻</a>

    <h1 class="post-title">{{ frontmatter.title }}</h1>

    <div class="post-meta">
      <time :datetime="dateText">{{ dateText }}</time>
      <a
        v-for="category in categories"
        :key="category"
        class="tag"
        :href="withBase(termPath('categories', category))"
        >{{ category }}</a
      >
      <a
        v-for="tag in tags"
        :key="tag"
        class="tag"
        :href="withBase(termPath('tags', tag))"
        >#{{ tag }}</a
      >
    </div>

    <div class="post-content"><Content /></div>

    <nav class="post-nav">
      <a v-if="prevPost" class="prev" :href="withBase(prevPost.url)">← {{ prevPost.title }}</a>
      <span v-else></span>
      <a v-if="nextPost" class="next" :href="withBase(nextPost.url)">{{ nextPost.title }} →</a>
    </nav>

    <ClientOnly>
      <GiscusComments />
    </ClientOnly>
  </article>
</template>