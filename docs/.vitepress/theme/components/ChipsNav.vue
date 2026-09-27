<script setup lang="ts">
import { withBase } from 'vitepress';

// 首页 / 列表页共用的快捷入口（对齐原 index.ejs 的 chips）
const chips = [
  { label: '归档', href: '/archives/', external: false },
  { label: '分类', href: '/categories/', external: false },
  { label: '标签', href: '/tags/', external: false },
  { label: 'RSS', href: '/atom.xml', external: true },
];
</script>

<template>
  <nav class="chips">
    <a
      v-for="chip in chips"
      :key="chip.label"
      class="chip"
      :href="withBase(chip.href)"
      :target="chip.external ? '_blank' : '_self'"
      >{{ chip.label }}</a
    >
  </nav>
</template>