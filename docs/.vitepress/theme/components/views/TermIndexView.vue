<script setup lang="ts">
import { withBase } from 'vitepress';
import ChipsNav from '../ChipsNav.vue';
import type { TermItem } from '@/types';

// 分类 / 标签索引页：chip 云
defineProps<{ title: string; items: TermItem[] }>();
</script>

<template>
  <div class="page news-home">
    <div class="container">
      <div class="list-utils">
        <h1 class="list-title">{{ title }}</h1>
        <ChipsNav />
      </div>

      <div class="chip-cloud">
        <p v-if="!items.length" class="empty-state">暂无内容</p>
        <a
          v-for="item in items"
          :key="item.name"
          class="cloud-chip"
          :href="withBase(item.path)"
        >
          <span class="cloud-name">{{ item.name }}</span>
          <span class="cloud-count">{{ item.count }}</span>
        </a>
      </div>
    </div>
  </div>
</template>