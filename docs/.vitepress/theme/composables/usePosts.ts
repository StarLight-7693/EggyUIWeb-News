import { computed, type ComputedRef } from 'vue';
import { data as allPosts } from '@/posts.data';
import { PAGE_SIZE } from '@/config';
import type { Post } from '@/types';

export interface PagedPosts {
  /** 全部文章（按时间倒序） */
  allPosts: Post[];
  /** 总页数（至少 1） */
  totalPages: ComputedRef<number>;
  /** 当前页（已按上下界收敛） */
  page: ComputedRef<number>;
  /** 当前页文章 */
  pagePosts: ComputedRef<Post[]>;
}

/**
 * 列表分页组合式函数。
 * @param getCurrent 当前页取值函数（响应式）
 * @param getSource  数据集取值函数，默认全部文章（分类/标签页可传入过滤后的集合）
 */
export function usePagedPosts(
  getCurrent: () => number,
  getSource: () => Post[] = () => allPosts,
): PagedPosts {
  const totalPages = computed(() => Math.max(1, Math.ceil(getSource().length / PAGE_SIZE)));
  const page = computed(() => {
    const raw = Math.floor(Number(getCurrent()));
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.min(raw, totalPages.value);
  });
  const pagePosts = computed(() =>
    getSource().slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE),
  );

  return { allPosts, totalPages, page, pagePosts };
}

export { allPosts };