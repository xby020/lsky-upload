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
          <!-- size -->
          <div class="d-badge d-badge-accent d-badge-md d-badge-outline">
            {{ `${select.size}${select.sizeUnit}` }}
          </div>
          <!-- image width and height -->
          <div class="d-badge d-badge-accent d-badge-md d-badge-outline">
            {{ `${width} x ${height}` }}
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
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  return new Promise<{ width: number; height: number }>((resolve) => {
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
  });
}

const width = ref(0);
const height = ref(0);

watch(
  () => props.select,
  async () => {
    if (props.select && props.select.file) {
      const { width: w, height: h } = await getImageSize(props.select.file);
      width.value = w;
      height.value = h;
    }
  },
);
</script>

<style scoped></style>
