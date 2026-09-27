<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useData, withBase } from 'vitepress';
import { SITE } from '@/config';

// 原 themes/eggyui/source/js/header.js 的行为（TS 化）：
// 汉堡开合 / ESC / 点外关闭 / 滚动加深毛玻璃 / 加载进度条 / 搜索提交
const { page } = useData();

const main = SITE.mainUrl.replace(/\/+$/, '');
const logo = withBase('/images/logo.png');

const navOpen = ref(false);
const scrolled = ref(false);
const progressActive = ref(false);
const progressDone = ref(false);
const progressWidth = ref(0);
const searchQuery = ref('');

// 搜索 → 本站搜索结果页（与主站 Header 的跨站搜索行为对齐）
function submitSearch() {
  const query = searchQuery.value.trim();
  if (query) {
    window.location.href = `${withBase('/search/')}?q=${encodeURIComponent(query)}`;
  } else {
    document.querySelector<HTMLInputElement>('.search-form input')?.focus();
  }
}

function setScrollLock(lock: boolean) {
  document.body.style.overflow = lock ? 'hidden' : '';
}

function closeMenu() {
  navOpen.value = false;
  setScrollLock(false);
}

function toggleMenu() {
  navOpen.value = !navOpen.value;
  setScrollLock(navOpen.value);
}

let progressTimer: number | undefined;

function finishProgress() {
  progressWidth.value = 100;
  progressDone.value = true;
  window.setTimeout(() => {
    progressActive.value = false;
    progressDone.value = false;
    progressWidth.value = 0;
  }, 800);
}

function simulateLoading() {
  if (progressTimer) window.clearInterval(progressTimer);
  progressWidth.value = 0;
  progressActive.value = true;
  progressDone.value = false;
  let progress = 0;
  progressTimer = window.setInterval(() => {
    progress += 2;
    if (progress >= 100) {
      window.clearInterval(progressTimer);
      progressTimer = undefined;
      finishProgress();
      return;
    }
    progressWidth.value = progress;
  }, 50);
}

function onScroll() {
  scrolled.value = window.scrollY > 20;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && navOpen.value) {
    closeMenu();
    document.querySelector<HTMLButtonElement>('.hamburger')?.focus();
  }
}

function onDocClick(event: MouseEvent) {
  const header = document.querySelector<HTMLElement>('.glass-header');
  if (navOpen.value && header && !header.contains(event.target as Node)) {
    closeMenu();
  }
}

// 路由切换时关闭抽屉（替代整页跳转时的收起逻辑）
watch(
  () => page.value.relativePath,
  () => closeMenu(),
);

onMounted(() => {
  simulateLoading();
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('click', onDocClick);
  onScroll();
});

onBeforeUnmount(() => {
  if (progressTimer) window.clearInterval(progressTimer);
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('keydown', onKeydown);
  document.removeEventListener('click', onDocClick);
  setScrollLock(false);
});
</script>

<template>
  <header class="glass-header" :class="{ scrolled }" role="banner">
    <!-- 顶部加载进度条 -->
    <div
      class="loading-bar"
      :class="{ active: progressActive, done: progressDone }"
      :style="{ width: progressWidth + '%' }"
    ></div>

    <!-- Logo → 本站首页 -->
    <a :href="withBase('/')" class="brand" aria-label="EggyUI 新闻">
      <span class="logo-icon">
        <img :src="logo" alt="Logo" />
      </span>
      <span class="brand-text">EggyUI</span>
    </a>

    <!-- 导航：首页/下载/关于指向主站，新闻指向本站（target=_self 实现无缝跳转） -->
    <ul class="nav-links" :class="{ open: navOpen }" role="navigation">
      <li><a :href="main + '/'" target="_self">首页</a></li>
      <li><a :href="main + '/download'" target="_self">下载</a></li>
      <li><a :href="withBase('/')" class="active">新闻</a></li>
      <li><a :href="main + '/about'" target="_self">关于</a></li>
    </ul>

    <!-- 右侧操作：本站搜索 + 开始使用（主站下载） -->
    <div class="actions">
      <form class="search-form" role="search" @submit.prevent="submitSearch">
        <span class="search-icon" role="button" aria-label="搜索新闻" @click="submitSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="search"
          name="q"
          placeholder="搜索新闻..."
          aria-label="搜索新闻"
          autocomplete="off"
        />
      </form>

      <a class="btn btn-primary" :href="main + '/download'">开始使用</a>

      <button
        class="hamburger"
        :class="{ active: navOpen }"
        type="button"
        aria-label="切换导航菜单"
        :aria-expanded="navOpen"
        @click="toggleMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>