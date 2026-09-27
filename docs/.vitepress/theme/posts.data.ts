import { createContentLoader } from 'vitepress';
import type { Post } from './types';
import { formatDate, toArray } from './utils';

/**
 * 文章数据加载器。
 * 构建期解析 docs/posts/*.md，规范化后随 bundle 内联（运行时不发请求）。
 * 首页 / 归档 / 分类 / 标签 / 搜索均消费这份数据。
 */
declare const data: Post[];
export { data };

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default createContentLoader('posts/*.md', {
  render: true,
  transform(raw): Post[] {
    return raw
      .map((page) => {
        const frontmatter = page.frontmatter as Record<string, any>;
        return {
          title: frontmatter.title ?? '',
          url: page.url,
          date: formatDate(frontmatter.date),
          timestamp: new Date(frontmatter.date).getTime() || 0,
          // 未指定或非 true 一律视为不置顶
          stickypost: frontmatter.stickypost === true,
          categories: toArray(frontmatter.categories),
          tags: toArray(frontmatter.tags),
          cover: frontmatter.cover || '/images/default_cover.png',
          description: frontmatter.description ?? '',
          content: stripHtml(page.html ?? '').slice(0, 3000),
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  },
});