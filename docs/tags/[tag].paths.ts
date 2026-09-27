import { countByField } from '../.vitepress/build/posts';

/** 标签详情动态路由（每个标签一页），标签名取自文章 frontmatter。 */
export default {
  watch: ['../posts/*.md'],
  paths() {
    return [...countByField('tags').keys()].map((name) => ({ params: { tag: name } }));
  },
};