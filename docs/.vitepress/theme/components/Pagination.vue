<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';

const props = defineProps<{
  /** 当前页（从 1 开始） */
  current: number;
  /** 总页数 */
  totalPages: number;
  /** 第 1 页地址，如 / 、/archives/ 、/categories/公告.html */
  firstHref: string;
  /** 第 n(>=2) 页地址前缀，如 /page/ 、/archives/page/ 、/categories/公告/page/ */
  pagePrefix: string;
}>();

const prevHref = computed(() =>
  props.current <= 2 ? props.firstHref : `${props.pagePrefix}${props.current - 1}`,
);
const nextHref = computed(() => `${props.pagePrefix}${props.current + 1}`);
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" role="navigation">
    <a v-if="current > 1" class="page-btn" :href="withBase(prevHref)">← 上一页</a>
    <span class="page-info">{{ current }} / {{ totalPages }}</span>
    <a v-if="current < totalPages" class="page-btn" :href="withBase(nextHref)">下一页 →</a>
  </nav>
</template>