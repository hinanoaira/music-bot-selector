<template>
  <div id="app">
    <!-- ヘッダー固定 -->
    <header class="header">
      <h2>Music Request Bot</h2>
    </header>

    <!-- メイン -->
    <main class="main">
      <RouterView />
    </main>

    <!-- フッター固定 -->
    <footer class="footer">
      &copy; 2025 Music Request Bot
    </footer>

    <!-- 右下に常駐するキューリストパネル -->
    <QueuePanel class="Queue" />
  </div>
</template>

<script lang="ts" setup>
import QueuePanel from '@/components/QueuePanel.vue'
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: sans-serif;
  background-color: #f8f8f8;
}

#app {
  width: 100%;
  height: 100%;
}

/* ヘッダー */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #333;
  color: #fff;
  padding: 1rem;
  padding-top: 0rem;
  box-sizing: border-box;
  z-index: 10;
}

/* フッター */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #333;
  color: #fff;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;
  z-index: 10;
}

/* main領域：ヘッダー＆フッターを除いた高さを確保してoverflow: hidden; */
.main {
  position: absolute;
  top: 60px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
  /* 中のコンポーネントでスクロールするイメージ */
  background-color: #f8f8f8;
}

.queue-panel {
  z-index: 20;
}
</style>
