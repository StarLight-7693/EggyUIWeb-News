/* ============================================================
 * eggyui 主题 · 搜索页本地检索
 * 读取 URL ?q=，拉取构建期生成的 /search.json 前端过滤并渲染。
 * 无后端依赖。
 * ============================================================ */
(function () {
  'use strict'

  var params = new URLSearchParams(window.location.search)
  var q = (params.get('q') || '').trim()

  var input = document.getElementById('searchPageInput')
  if (input) input.value = q

  var statsEl = document.getElementById('searchStats')
  var listEl = document.getElementById('searchResults')

  if (!statsEl || !listEl) return

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;')
  }

  // 封面：缺省用 default_cover；相对路径统一补站点根
  function coverOf(c) {
    if (!c) return '/images/default_cover.png'
    if (/^(?:\/|https?:|data:)/i.test(c)) return c
    return '/' + c
  }

  function cardMarkup(p) {
    return (
      '<a class="card" href="/' + p.path + '">' +
      '<div class="card-cover">' +
      '<img src="' + escapeAttr(coverOf(p.cover)) + '" alt="' + escapeHtml(p.title) + '" loading="lazy" />' +
      '</div>' +
      '<div class="card-body">' +
      '<div class="card-text">' +
      '<span class="card-title">' + escapeHtml(p.title) + '</span>' +
      '<time class="card-date">' + escapeHtml(p.date || '') + '</time>' +
      '</div>' +
      '<svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M5 12h14" /><path d="M12 5l7 7-7 7" />' +
      '</svg>' +
      '</div>' +
      '</a>'
    )
  }

  if (!q) {
    statsEl.textContent = '输入关键词开始搜索新闻。'
    return
  }

  var tokens = q.toLowerCase().split(/\s+/).filter(Boolean)

  function match(text) {
    var lower = (text || '').toLowerCase()
    return tokens.every(function (t) { return lower.indexOf(t) >= 0 })
  }

  fetch('/search.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    })
    .then(function (data) {
      var posts = data.posts || []
      var hits = posts.filter(function (p) {
        return match(p.title) || match(p.content) || match((p.tags || []).join(' '))
      })

      if (hits.length === 0) {
        statsEl.textContent = '未找到与“' + q + '”相关的新闻。'
        listEl.innerHTML = '<p class="empty-state">未找到相关新闻</p>'
        return
      }

      statsEl.textContent = '找到 ' + hits.length + ' 条与“' + q + '”相关的结果'
      listEl.innerHTML = hits.map(cardMarkup).join('')
    })
    .catch(function (err) {
      statsEl.textContent = '搜索索引加载失败，请稍后重试。'
      console.error('搜索失败:', err)
    })
})()
