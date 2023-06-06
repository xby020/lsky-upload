<template>
  <div class="w-full h-full">
    <!-- preview -->
    <div class="w-full h-full flex flex-col" v-if="select">
      <!-- preview -->
      <div
        class="w-full rounded-lg bg-base-200 border-secondary/20 overflow-hidden"
      >
        <img :src="select.url" alt="" class="w-full h-200px object-contain" />
      </div>

      <!-- info -->
      <div class="w-full flex-auto p-2 text-info">
        <h2 class="text-lg text-primary font-semibold truncate">
          {{ select.name }}
        </h2>
        <!-- info -->
        <div class="flex gap-2 py-2">
          <div class="d-badge d-badge-accent d-badge-md d-badge-outline">
            {{ `${select.size}${select.sizeUnit}` }}
          </div>
        </div>
      </div>
    </div>

    <!-- no select file -->
    <div
      class="w-full h-full flex flex-col justify-center items-center gap-4"
      v-else
    >
      <div class="text-12 text-secondary">
        <i-mdi-image-search></i-mdi-image-search>
      </div>
      <div class="text-secondary">图片信息预览</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileInfo } from '@/types/files';

interface Props {
  files?: FileInfo[];
  select?: FileInfo;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:files']);

async function getImageSize(file: File) {
  // 从File对象中获取图片的宽高
}
</script>

<style scoped></style>
