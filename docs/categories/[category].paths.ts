import { countByField } from '../.vitepress/build/posts';

/**
 * 分类详情动态路由（每个分类一页）。
 * 分类名取自文章 frontmatter，新增文章后自动生成，无需手工维护。
 */
export default {
  watch: ['../posts/*.md'],
  paths() {
    return [...countByField('categories').keys()].map((name) => ({
      params: { category: name },
    }));
  },
};