<template>
  <div id="app">
    <header class="header">
      <h2>あいらの音楽Bot リクエスト</h2>
    </header>

    <main class="main">
      <RouterView />
    </main>

    <footer class="footer">&copy; 2025 Music Request Bot</footer>

    <QueueView />

    <ToastContainer />
  </div>
</template>

<script lang="ts" setup>
import QueueView from '@/views/QueueView.vue'
import ToastContainer from '@/components/templates/ToastContainer.vue'
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

.main {
  position: absolute;
  top: 60px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
  background-color: #f8f8f8;
}

.queue-panel {
  z-index: 20;
}
</style>
