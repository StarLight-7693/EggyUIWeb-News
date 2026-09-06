'use strict'

/**
 * 构建期生成 /search.json —— 零后端本地搜索索引
 * 供搜索页（source/search，layout: search）的 js/search.js 前端过滤使用。
 */

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

hexo.extend.generator.register('search_index', function (locals) {
  const posts = locals.posts.sort('-date').map(function (post) {
    return {
      title: post.title || '',
      date: post.date ? post.date.format('YYYY-MM-DD') : '',
      path: post.path,
      tags: post.tags ? post.tags.map((t) => t.name) : [],
      categories: post.categories ? post.categories.map((c) => c.name) : [],
      cover: post.cover || '/images/default_cover.png',
      content: stripHtml(post.content || '').slice(0, 3000),
    }
  })

  return {
    path: 'search.json',
    data: JSON.stringify({ posts: posts }),
  }
})
