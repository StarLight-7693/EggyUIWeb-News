/**
 * 站点常量：主站 / 新闻站（用于跨站导航与搜索的「无缝衔接」）
 * 对齐主项目 EggyUIWeb-Vue3 的 src/config.ts 约定。
 */
export const SITE = {
  /** 主站（EggyUIWeb-Vue3 SPA 所在域） */
  mainUrl: 'https://eggyui.skystarlight.top',
  /** 新闻站（本项目所在域） */
  newsUrl: 'https://eggyuinews.skystarlight.top',
  /** 品牌名 */
  brand: 'EggyUI',
  /** 作者 / 组织 */
  author: 'EggyUI Team',
} as const;

/** 页脚 / 首页 chip 的订阅与社交链接 */
export const SOCIAL_LINKS = {
  RSS: '/atom.xml',
  GitHub: 'https://github.com/CN-RBL/EggyUI-RE',
  GitCode: 'https://gitcode.com/eggy-ui-team',
} as const;

/** 列表页每页文章数（对齐原 Hexo per_page: 10） */
export const PAGE_SIZE = 10;

/** Giscus 评论配置（对齐原 post.ejs 内嵌脚本） */
export const GISCUS = {
  repo: 'StarLight-7693/EggyUIWeb-News',
  repoId: 'R_kgDOUPbibQ',
  category: 'Announcements',
  categoryId: 'DIC_kwDOUPbibc4DE_I8',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  theme: 'light_protanopia',
  lang: 'zh-CN',
  loading: 'lazy',
} as const;