<template>
  <div class="w-full h-full flex gap-4">
    <!-- left -->
    <div
      class="flex-auto h-full border-2 card-board flex flex-col justify-center items-center p-4"
    >
      <!-- Upload -->
      <div
        class="w-full flex-auto flex flex-col justify-center items-center gap-2 select-none cursor-pointer text-primary rounded-lg py-4"
        :class="
          uploadList.length > 0
            ? 'border-2 border-dashed border-primary-focus/20'
            : ''
        "
      >
        <div class="i-mdi-upload text-12"></div>
        <div class="text-2xl font-semibold text-primary-focus">上传图片</div>
        <div class="text-lg">
          点击上传或使用 <kbd class="d-kbd d-kbd-sm">Ctrl</kbd> +
          <kbd class="d-kbd d-kbd-sm">V</kbd> 粘贴图片
        </div>
      </div>

      <!-- List -->
      <div class="w-full h-1/2" v-if="uploadList.length > 0"></div>
    </div>

    <!-- right -->
    <div
      class="w-2/3 h-full border-2 card-board"
      v-if="uploadList.length > 0"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { base64ToBuffer, getFiles } from '@/preload';
import dayjs from 'dayjs';
import { isDarkColors, onPluginEnter } from 'uTools';

const isDark = isDarkColors();

const uploadList = ref<File[]>([]);

onPluginEnter(({ code, type, payload }) => {
  console.log(code, type, payload);

  if (code === 'upload') {
    if (type === 'files') {
      const files = getFiles(payload);
      console.log(files);
    }
    if (type === 'img') {
      // 获取三位随机字符
      const randomStr = Math.random().toString(36).slice(-3);
      const fileBolb = base64ToBuffer(payload);
      console.log(fileBolb);
    }
  }
});
</script>

<style scoped></style>
