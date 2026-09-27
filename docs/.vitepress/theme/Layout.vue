<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import HomeView from './components/views/HomeView.vue';
import ArchiveView from './components/views/ArchiveView.vue';
import CategoryIndexView from './components/views/CategoryIndexView.vue';
import CategoryView from './components/views/CategoryView.vue';
import TagIndexView from './components/views/TagIndexView.vue';
import TagView from './components/views/TagView.vue';
import SearchView from './components/views/SearchView.vue';
import NotFoundView from './components/views/NotFoundView.vue';
import PostView from './components/views/PostView.vue';

// 与 VitePress 自定义主题约定一致：按 frontmatter.layout 切换页面外壳
const { page, frontmatter, params } = useData();

const layout = computed(() => (frontmatter.value.layout as string) || 'post');
// 静态页面没有动态路由参数，params 可能为 undefined
const currentPage = computed(() => Number(params.value?.page) || 1);

function decodeParam(value: unknown): string {
  const raw = typeof value === 'string' ? value : '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

const categoryName = computed(() => decodeParam(params.value?.category));
const tagName = computed(() => decodeParam(params.value?.tag));
</script>

<template>
  <SiteHeader />

  <!-- 主内容地标：浏览器阅读模式据此定位正文，忽略顶栏/页脚等噪声 -->
  <main id="content" class="site-main" role="main">
    <NotFoundView v-if="page.isNotFound" />
    <HomeView v-else-if="layout === 'home'" :page="currentPage" />
    <ArchiveView v-else-if="layout === 'archive'" :page="currentPage" />
    <CategoryIndexView v-else-if="layout === 'category-index'" />
    <CategoryView v-else-if="layout === 'category'" :name="categoryName" :page="currentPage" />
    <TagIndexView v-else-if="layout === 'tag-index'" />
    <TagView v-else-if="layout === 'tag'" :name="tagName" :page="currentPage" />
    <SearchView v-else-if="layout === 'search'" />
    <PostView v-else />
  </main>

  <SiteFooter />
</template>