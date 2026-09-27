import { countPosts, paginationParams } from '../.vitepress/build/posts';

/**
 * 首页分页动态路由。
 * 第 1 页为 /（docs/index.md），此处仅生成 /page/2、/page/3 …
 */
export default {
  watch: ['../posts/*.md'],
  paths() {
    return paginationParams(countPosts());
  },
};