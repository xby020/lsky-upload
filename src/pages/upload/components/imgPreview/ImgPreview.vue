<template>
  <div class="w-full h-full">
    <!-- preview -->
    <div class="w-full h-full flex flex-col" v-if="select">
      <!-- preview -->
      <div
        class="w-full rounded-lg border-secondary/20 overflow-hidden gradient-wrap"
        :style="gradientClass"
        ref="imgContainerRef"
        :key="select.id"
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
import Grade from 'grade-js';

interface Props {
  files?: FileInfo[];
  select?: FileInfo;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:files']);

// img preview
const imgContainerRef = ref<HTMLElement>();
// 从左上到右下的渐变色
const gradientClass = ref(
  'background: linear-gradient(45deg, #ffffff00, #ffffff00,);',
);
async function setGradient() {
  const imgContainer = document.querySelectorAll('.gradient-wrap');
  await nextTick();
  return new Promise((resolve) => {
    Grade(imgContainer, null, function (data: any) {
      resolve(data[0].gradientData);
    });
  });
}

const selectId = computed(() => props.select?.id);
watch(
  selectId,
  async () => {
    const gradient: any = await setGradient();
    const formRgba = gradient[0].rgba;
    const toRgba = gradient[1].rgba;
    console.log(formRgba, toRgba);
    const fromColor = `rgba(${formRgba[0]}, ${formRgba[1]}, ${formRgba[2]}, ${formRgba[3]})`;
    const toColor = `rgba(${toRgba[0]}, ${toRgba[1]}, ${toRgba[2]}, ${toRgba[3]})`;
    gradientClass.value = `background: linear-gradient(45deg, ${fromColor}, ${toColor});`;
  },
  { immediate: true },
);

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
