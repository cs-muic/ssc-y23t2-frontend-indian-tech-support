<template>
  <div class="history-view">
    <nav class="navbar">
      <NavbarComponent />
    </nav>
    <h1>This should contain history</h1>
    <h2>Anish is a wanker</h2>
  </div>
</template>
<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
</script>
<style scoped>
.navbar {
  padding: 20px;
  background-color: #f8f9fa;
}
</style>
