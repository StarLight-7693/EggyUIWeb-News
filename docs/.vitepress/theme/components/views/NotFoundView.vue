<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { withBase } from 'vitepress';

// 原 404.ejs：5 秒倒计时后自动回首页
const count = ref(5);
let timer: number | undefined;

function goBack() {
  if (window.history.length > 1) window.history.back();
  else window.location.href = withBase('/');
}

onMounted(() => {
  timer = window.setInterval(() => {
    count.value -= 1;
    if (count.value <= 0) {
      if (timer) window.clearInterval(timer);
      window.location.replace(withBase('/'));
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <div class="page news-home">
    <div class="container">
      <div class="nf-card">
        <h1 class="nf-code">404</h1>
        <p class="nf-msg">页面不存在或已被移除</p>
        <div class="nf-actions">
          <button class="btn btn-primary" type="button" @click="goBack">返回上一页</button>
          <a class="btn" :href="withBase('/')">返回首页</a>
        </div>
        <p class="nf-tip"><span>{{ count }}</span> 秒后自动返回首页…</p>
      </div>
    </div>
  </div>
</template>