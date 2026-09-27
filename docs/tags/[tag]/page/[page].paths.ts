import { countByField, totalPagesOf } from '../../../.vitepress/build/posts';

/** 标签详情分页动态路由：第 1 页为 /tags/<name>.html */
export default {
  watch: ['../../../posts/*.md'],
  paths() {
    const result: { params: Record<string, string> }[] = [];
    for (const [name, count] of countByField('tags')) {
      const total = totalPagesOf(count);
      for (let page = 2; page <= total; page += 1) {
        result.push({ params: { tag: name, page: String(page) } });
      }
    }
    return result;
  },
};