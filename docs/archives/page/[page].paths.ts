import { countPosts, paginationParams } from '../../.vitepress/build/posts';

/** 归档分页动态路由：第 1 页为 /archives/ */
export default {
  watch: ['../../posts/*.md'],
  paths() {
    return paginationParams(countPosts());
  },
};