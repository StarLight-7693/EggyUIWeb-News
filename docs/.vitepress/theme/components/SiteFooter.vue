<script setup lang="ts">
import { withBase } from 'vitepress';
import { SITE, SOCIAL_LINKS } from '@/config';

const main = SITE.mainUrl.replace(/\/+$/, '');

const navLinks = [
  { label: '主站首页', href: `${main}/`, external: false },
  { label: '下载', href: `${main}/download`, external: false },
  { label: '新闻', href: withBase('/'), external: false },
  { label: '关于', href: `${main}/about`, external: false },
];

const socialLinks = Object.entries(SOCIAL_LINKS).map(([label, href]) => ({
  label,
  href: href.startsWith('/') ? withBase(href) : href,
  external: !href.startsWith('/'),
}));
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="brand-text">{{ SITE.brand }}</span>
        <span class="footer-copy">2026 EggyUI Team · Powered by VitePress</span>
      </div>

      <div class="footer-links">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          :target="link.external ? '_blank' : '_self'"
          >{{ link.label }}</a
        >
      </div>

      <div class="footer-ext">
        <a
          v-for="link in socialLinks"
          :key="link.label"
          :href="link.href"
          :target="link.external ? '_blank' : '_self'"
          >{{ link.label }}</a
        >
      </div>
    </div>
  </footer>
</template>