import { countByField, totalPagesOf } from '../../../.vitepress/build/posts';

/** 分类详情分页动态路由：第 1 页为 /categories/<name>.html */
export default {
  watch: ['../../../posts/*.md'],
  paths() {
    const result: { params: Record<string, string> }[] = [];
    for (const [name, count] of countByField('categories')) {
      const total = totalPagesOf(count);
      for (let page = 2; page <= total; page += 1) {
        result.push({ params: { category: name, page: String(page) } });
      }
    }
    return result;
  },
};