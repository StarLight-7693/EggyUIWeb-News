<script setup lang="ts">
import { withBase } from 'vitepress';

// 首页 / 列表页共用的快捷入口（对齐原 index.ejs 的 chips）
const chips = [
  { label: '归档', href: '/archives/' },
  { label: '分类', href: '/categories/' },
  { label: '标签', href: '/tags/' }
];
</script>

<template>
  <nav class="chips">
    <a
      v-for="chip in chips"
      :key="chip.label"
      class="chip"
      :href="withBase(chip.href)"
      >{{ chip.label }}</a>
    <a class="chip" href="/atom.xml" target="_blank">RSS</a>
  </nav>
</template>