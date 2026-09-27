import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { createContentLoader, defineConfig, type HeadConfig } from 'vitepress';
import { SITE } from './theme/config';
import { toArray } from './theme/utils';

// ============================================================
// GitHub Pages 部署路径（base）
//   - 用户/组织主页（<user>.github.io）        → '/'
//   - 项目页仓库（github.com/<user>/<repo>）   → '/<repo>/'
// 部署前请把下面常量改为实际路径。
// ============================================================
const BASE = '/';

const SITE_TITLE = 'EggyUI 新闻';
const SITE_DESC = 'EggyUI 新闻中心，获取 EggyUI 最新新闻与公告。';
const SITE_KEYWORDS =
  'eggyui新闻,eggyui公告,eggyui更新,EggyUI-RE新闻,EggyUI公告,EggyUI,EggyUI下载';

/** Atom feed 收录条数（对齐原 hexo-generator-feed limit: 20） */
const FEED_LIMIT = 20;

function xmlEscape(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 由页面相对路径推导线上绝对地址（VitePress 默认 cleanUrls=false，非 index 页以 .html 结尾） */
function absolutePageUrl(relativePath: string): string {
  const route = relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html');
  return new URL(route, `${SITE.newsUrl}/`).href;
}

/** 站内相对 / 绝对图片地址 → 线上绝对地址（外链与 data URI 原样返回） */
function absoluteAssetUrl(src: string | undefined): string | null {
  if (!src) return null;
  if (/^(?:https?:)?\/\//i.test(src) || src.startsWith('data:')) return src;
  return new URL(src.startsWith('/') ? src : `/${src}`, `${SITE.newsUrl}/`).href;
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: SITE_TITLE,
  // 标题模板交由 VitePress 默认行为（`<title> | <站点标题>`）：
  // 首页标题本身就是站点标题，因此不会重复追加后缀，与原 Hexo 的 title 规则一致。
  description: SITE_DESC,
  head: [
    ['meta', { name: 'author', content: SITE.author }],
    ['meta', { name: 'keywords', content: SITE_KEYWORDS }],
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE}images/favicon.png` }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.cdnfonts.com/css/segoe-pro' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/noto-sans-sc@37.0.0/noto_sans_sc_medium/css.min.css',
      },
    ],
  ],
  base: BASE,
  // 动态路由的页面标题（分类 / 标签详情、分页页）在构建期细化，利于 SEO
  transformPageData(pageData) {
    const params = (pageData as { params?: Record<string, string> }).params;
    if (!params) return;
    const layout = pageData.frontmatter?.layout;
    if (layout === 'category' && params.category) {
      pageData.title = `分类：${params.category}`;
    } else if (layout === 'tag' && params.tag) {
      pageData.title = `标签：${params.tag}`;
    }
    if (params.page && Number(params.page) > 1) {
      pageData.title = `${pageData.title ?? SITE_TITLE} · 第 ${params.page} 页`;
    }
  },
  // 浏览器阅读模式（Firefox Reader View / Safari 阅读器）会读取 Open Graph、
  // article:* 元数据与 JSON-LD；这里为文章页补齐标题 / 作者 / 发布时间 / 封面等信息。
  transformHead({ pageData, title, description }) {
    const frontmatter = (pageData.frontmatter ?? {}) as Record<string, any>;
    const isPost = pageData.relativePath.startsWith('posts/');
    const url = absolutePageUrl(pageData.relativePath);
    const pageTitle = (isPost ? frontmatter.title : undefined) || title;

    const head: HeadConfig[] = [
      ['meta', { property: 'og:site_name', content: SITE_TITLE }],
      ['meta', { property: 'og:type', content: isPost ? 'article' : 'website' }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
    ];
    if (description) {
      head.push(['meta', { property: 'og:description', content: description }]);
      head.push(['meta', { name: 'twitter:description', content: description }]);
    }

    if (!isPost) return head;

    const published = frontmatter.date ? new Date(frontmatter.date) : null;
    const publishedISO =
      published && !Number.isNaN(published.getTime()) ? published.toISOString() : undefined;
    const cover =
      absoluteAssetUrl(frontmatter.cover) ?? absoluteAssetUrl('/images/default_cover.png');

    if (publishedISO) {
      head.push(['meta', { property: 'article:published_time', content: publishedISO }]);
    }
    head.push(['meta', { property: 'article:author', content: SITE.author }]);
    for (const tag of toArray(frontmatter.tags)) {
      head.push(['meta', { property: 'article:tag', content: tag }]);
    }
    if (cover) head.push(['meta', { property: 'og:image', content: cover }]);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: frontmatter.title ?? title,
      description: frontmatter.description ?? description ?? '',
      mainEntityOfPage: url,
      inLanguage: 'zh-CN',
      author: { '@type': 'Organization', name: SITE.author, url: SITE.mainUrl },
      publisher: {
        '@type': 'Organization',
        name: SITE.brand,
        url: SITE.mainUrl,
        logo: { '@type': 'ImageObject', url: absoluteAssetUrl('/images/logo.png') },
      },
      ...(publishedISO ? { datePublished: publishedISO, dateModified: publishedISO } : {}),
      ...(cover ? { image: [cover] } : {}),
    };
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)]);

    return head;
  },
  vite: {
    // 使用 Sass 现代 JS API（Vite 5.4+），避免 Dart Sass 2.0 移除 legacy API 后构建失败
    css: {
      preprocessorOptions: {
        scss: { api: 'modern' },
      },
    },
    resolve: {
      // 与主项目 EggyUIWeb-Vue3 一致：@ → 主题源码目录
      alias: {
        '@': fileURLToPath(new URL('./theme', import.meta.url)),
      },
    },
  },
  async buildEnd(siteConfig) {
    // 构建期生成 Atom feed，对齐原 hexo-generator-feed 的 /atom.xml
    const posts = await createContentLoader('posts/*.md', { render: true }).load();

    const entries = posts
      .map((post) => ({
        url: post.url,
        html: post.html ?? '',
        frontmatter: post.frontmatter as Record<string, any>,
      }))
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .slice(0, FEED_LIMIT);

    const absolute = (route: string) => new URL(route, SITE.newsUrl).href;
    const updated = entries[0]
      ? new Date(entries[0].frontmatter.date).toISOString()
      : new Date().toISOString();

    const items = entries
      .map((entry) => {
        const link = absolute(entry.url);
        const lines = [
          '  <entry>',
          `    <title>${xmlEscape(entry.frontmatter.title)}</title>`,
          `    <link href="${xmlEscape(link)}" />`,
          `    <id>${xmlEscape(link)}</id>`,
          `    <updated>${new Date(entry.frontmatter.date).toISOString()}</updated>`,
        ];
        if (entry.frontmatter.description) {
          lines.push(`    <summary>${xmlEscape(entry.frontmatter.description)}</summary>`);
        }
        lines.push(`    <content type="html">${xmlEscape(entry.html)}</content>`);
        lines.push('  </entry>');
        return lines.join('\n');
      })
      .join('\n');

    const feed = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<feed xmlns="http://www.w3.org/2005/Atom">',
      `  <title>${xmlEscape(SITE_TITLE)}</title>`,
      `  <subtitle>${xmlEscape(SITE_DESC)}</subtitle>`,
      `  <link href="${xmlEscape(absolute('/atom.xml'))}" rel="self" />`,
      `  <link href="${xmlEscape(SITE.newsUrl)}" />`,
      `  <id>${xmlEscape(SITE.newsUrl)}</id>`,
      `  <updated>${updated}</updated>`,
      `  <author><name>${xmlEscape(SITE.author)}</name></author>`,
      `  <icon>${xmlEscape(absolute('/images/logo.png'))}</icon>`,
      items,
      '</feed>',
      '',
    ].join('\n');

    fs.writeFileSync(path.join(siteConfig.outDir, 'atom.xml'), feed, 'utf-8');
  },
});