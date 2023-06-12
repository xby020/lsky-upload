<template>
  <div class="w-full h-full">
    <!-- preview -->
    <div class="w-full h-full flex flex-col" v-if="select">
      <!-- preview -->
      <div class="w-full rounded-lg overflow-hidden" :key="select.id">
        <img
          :src="files ? select.url : select.links.thumbnail_url"
          alt=""
          class="w-full h-200px object-contain"
        />
      </div>

      <div class="w-full h-2px bg-primary/20"></div>

      <!-- info -->
      <div class="w-full flex-auto p-2 text-info">
        <h2 class="text-lg text-primary font-semibold truncate">
          {{ select.name }}
        </h2>
        <!-- info -->
        <div class="flex gap-2 py-2">
          <!-- size -->
          <div class="d-badge d-badge-accent d-badge-md d-badge-outline">
            {{ `${select.size}${select.sizeUnit || 'KB'}` }}
          </div>
          <!-- image width and height -->
          <div class="d-badge d-badge-accent d-badge-md d-badge-outline">
            {{ `${width} x ${height}` }}
          </div>
        </div>

        <!-- url -->
        <div
          class="w-full flex-auto flex flex-col gap-2"
          v-if="select.status === 'success' || !files"
        >
          <!-- url -->
          <div
            v-for="urlInfo in urlList"
            :key="urlInfo"
            class="w-full flex items-center gap-2"
          >
            <label class="d-label w-36">
              <span class="d-label-text uppercase">{{ urlInfo }}</span>
            </label>
            <input
              type="text"
              :value="select.links ? select.links[urlInfo] : ''"
              readonly
              placeholder="暂无链接"
              class="d-input d-input-bordered d-input-sm w-full"
            />
            <div
              class="d-btn d-btn-sm d-btn-outline i-mdi-content-copy"
              @click="
                copyUrlToClipboard(select.links ? select.links[urlInfo] : '')
              "
            ></div>
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
import ImgList from '../imgList/ImgList.vue';

interface Props {
  files?: boolean;
  select?: FileInfo;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:files']);

async function getImageSize(file: File | string) {
  // 从File对象中获取图片的宽高
  const url = typeof file === 'string' ? file : URL.createObjectURL(file);
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
    if (props.files) {
      if (props.select && props.select.file) {
        const { width: w, height: h } = await getImageSize(props.select.file);
        width.value = w;
        height.value = h;
      }
    } else {
      console.log(props.select);
      width.value = props.select.width;
      height.value = props.select.height;
    }
  },
);

const urlList = ref(['url', 'html', 'bbcode', 'markdown']);
const { copy } = useClipboard();
function copyUrlToClipboard(url: string) {
  console.log(url);
  copy(url);
  window.$notice.success('复制成功');
}
</script>

<style scoped></style>
