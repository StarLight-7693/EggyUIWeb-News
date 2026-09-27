<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, nextTick, watch } from 'vue';
import { useData } from 'vitepress';
import { GISCUS } from '@/config';

// 原 post.ejs 内嵌的 Giscus 脚本（改为客户端按路由动态注入，兼容 SPA 导航）
const { page } = useData();
const container = ref<HTMLElement | null>(null);

function mountGiscus() {
  const el = container.value;
  if (!el) return;
  // 每次路由变化都重建，避免评论串页
  el.innerHTML = '';
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  const attrs: Record<string, string> = {
    'data-repo': GISCUS.repo,
    'data-repo-id': GISCUS.repoId,
    'data-category': GISCUS.category,
    'data-category-id': GISCUS.categoryId,
    'data-mapping': GISCUS.mapping,
    'data-strict': GISCUS.strict,
    'data-reactions-enabled': GISCUS.reactionsEnabled,
    'data-emit-metadata': GISCUS.emitMetadata,
    'data-input-position': GISCUS.inputPosition,
    'data-theme': GISCUS.theme,
    'data-lang': GISCUS.lang,
    'data-loading': GISCUS.loading,
  };
  for (const [key, value] of Object.entries(attrs)) {
    script.setAttribute(key, value);
  }
  el.appendChild(script);
}

onMounted(() => nextTick(mountGiscus));

watch(
  () => page.value.relativePath,
  () => nextTick(mountGiscus),
);

onBeforeUnmount(() => {
  if (container.value) container.value.innerHTML = '';
});
</script>

<template>
  <div ref="container" class="post-comments"></div>
</template>