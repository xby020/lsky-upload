<template>
  <div
    class="w-screen h-screen flex flex-col justify-center items-center"
    :data-theme="isDark ? 'night' : 'cupcake'"
  >
    <base-layout>
      <router-view v-slot="{ Component }">
        <component :is="Component" v-motion-slide-bottom></component>
      </router-view>
    </base-layout>
  </div>
</template>

<script setup lang="ts">
import { isDarkColors, onPluginEnter } from 'uTools';

// dark theme
const isDark = useDark();

onMounted(() => {
  onPluginEnter(({ code, type, payload }) => {
    console.log('app');
    window.$notice({
      title: 'onPluginEnter',
      message: JSON.stringify({ code, type, payload }),
    });
  });
});
</script>

<style scoped>
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
