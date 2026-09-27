<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import GiscusComments from '../GiscusComments.vue';
import { data as allPosts } from '@/posts.data';
import { SITE } from '@/config';
import { formatDate, termPath, toArray } from '@/utils';

// 文章详情（对齐原 post.ejs：返回链接 / 标题 / 时间 / 分类标签 / 正文 / 上下篇 / 评论）
const { page, frontmatter } = useData();

const categories = computed(() => toArray(frontmatter.value.categories));
const tags = computed(() => toArray(frontmatter.value.tags));
const dateText = computed(() => formatDate(frontmatter.value.date));
// <time datetime> 采用完整 ISO 时间，便于浏览器阅读模式识别发布时间
const dateISO = computed(() => {
  const date = new Date(frontmatter.value.date);
  return Number.isNaN(date.getTime()) ? dateText.value : date.toISOString();
});

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
  <!-- Schema.org 微数据 + 语义标签：浏览器阅读模式据此识别标题 / 作者 / 时间 / 正文 -->
  <article class="page container single" itemscope itemtype="https://schema.org/NewsArticle">
    <nav class="post-back" aria-label="返回新闻列表" role="navigation">
      <a class="back-link" :href="withBase('/')">← 返回新闻</a>
    </nav>

    <header class="post-header">
      <h1 class="post-title" itemprop="headline">{{ frontmatter.title }}</h1>

      <div class="post-meta">
        <span
          class="post-author"
          itemprop="author"
          itemscope
          itemtype="https://schema.org/Organization"
        >
          <span itemprop="name">{{ SITE.author }}</span>
        </span>
        <time class="post-date" :datetime="dateISO" itemprop="datePublished">{{ dateText }}</time>
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
    </header>

    <div class="post-content" itemprop="articleBody"><Content /></div>

    <footer class="post-footer">
      <nav class="post-nav" role="navigation" aria-label="上一篇 / 下一篇">
        <a v-if="prevPost" class="prev" :href="withBase(prevPost.url)">← {{ prevPost.title }}</a>
        <span v-else></span>
        <a v-if="nextPost" class="next" :href="withBase(nextPost.url)">{{ nextPost.title }} →</a>
      </nav>

      <aside class="post-comments-wrap" role="complementary" aria-label="评论区">
        <ClientOnly>
          <GiscusComments />
        </ClientOnly>
      </aside>
    </footer>
  </article>
</template>