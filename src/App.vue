<template>
  <div>
    <h1>模板</h1>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="pcss" scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@font-face {
  font-family: Emoji;
  src: local('Apple Color Emojiji'), local('Segoe UI Emoji'),
    local('Segoe UI Symbol'), local('Noto Color Emoji');
  unicode-range: U+1F000-1F644, U+203C-3299;
}

body {
  font-family: system-ui, —apple-system, Segoe UI, Rototo, Emoji, Helvetica,
    Arial, sans-serif;
}
</style>
