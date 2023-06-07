<template>
  <div class="w-full h-full overflow-y-auto flex flex-col gap-2 p-2">
    <!-- card -->
    <div
      v-for="(file, fileIndex) in fileList"
      :key="fileIndex"
      class="w-full h-72px rounded-lg bg-secondary-content text-secondary p-2 flex items-center gap-4 border-2 border-transparent hover:border-primary cursor-pointer select-none transition-all duration-200 ease-in-out"
      @click="choosenFile(file)"
    >
      <!-- img -->
      <div class="w-56px h-56px rounded-lg overflow-hidden">
        <img :src="file.url" class="w-full h-full object-cover" />
      </div>

      <!-- info -->
      <div class="flex-auto h-full flex flex-col justify-between">
        <div class="w-full flex justify-between gap-2">
          <!-- name -->
          <div
            class="flex-auto d-tooltip d-tooltip-neutral"
            :class="
              fileList.length > 1 && fileIndex === fileList.length - 1
                ? 'd-tooltip-top'
                : 'd-tooltip-bottom'
            "
            :data-tip="file.name"
          >
            <div
              class="w-full max-w-180px text-start text-sm font-semibold text-accent truncate"
            >
              {{ file.name }}
            </div>
          </div>

          <!-- status -->
          <div
            class="d-badge d-badge-outline"
            :class="statusClass[file.status]"
          >
            {{ statusText[file.status] }}
          </div>

          <!-- delete -->
          <div
            class="d-btn d-btn-xs d-btn-warning d-btn-circle d-btn-outline"
            @click.stop="deleteFile(fileIndex)"
          >
            <i-mdi-delete></i-mdi-delete>
          </div>
        </div>

        <div class="w-full flex-auto flex items-center gap-2">
          <!-- size -->
          <div class="text-xs text-accent text-nowrap">
            {{ getFileSize(file.file) }}
          </div>

          <div class="h-full flex-auto flex justify-center items-center">
            <progress
              class="w-full d-progress d-progress-accent"
              :value="file.progress"
              :max="100"
            ></progress>
          </div>
          <div class="d-btn d-btn-xs d-btn-primary d-btn-circle d-btn-outline">
            <i-mdi-upload></i-mdi-upload>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileInfo } from '@/types/files';

interface Props {
  files: FileInfo[];
  select?: FileInfo;
}

const statusClass = {
  waiting: 'd-badge-warning',
  uploading: 'd-badge-info',
  success: 'd-badge-success',
  error: 'd-badge-error',
};
const statusText = {
  waiting: '等待上传',
  uploading: '上传中',
  success: '上传成功',
  error: '上传失败',
};

const props = defineProps<Props>();

const emits = defineEmits(['update:files', 'update:select']);

const trashCan = ref<string[]>([]);

function getFileUrl(file: FileInfo) {
  const src = URL.createObjectURL(file.file);
  trashCan.value.push(src);
  return src;
}

const fileList = computed({
  get(): FileInfo[] {
    return props.files.map((fileInfo) => {
      return {
        ...fileInfo,
        url: getFileUrl(fileInfo),
        progress: 0,
        status: 'waiting',
      };
    });
  },
  set(v) {
    emits('update:files', v);
  },
});

function getFileSize(file: File) {
  let size = file.size;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let index = 0;
  while (size > 1024) {
    size /= 1024;
    index++;
  }
  return `${size.toFixed(2)} ${units[index]}`;
}

function deleteFile(index: number) {
  console.log(index);
  const newFileList = [...fileList.value];
  newFileList.splice(index, 1);
  fileList.value = newFileList;
}

function choosenFile(file: FileInfo) {
  emits('update:select', file);
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: #00000010;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #828df8, #606ff6);
  background-blend-mode: color-burn;
  border-radius: 8px;
  cursor: pointer;
}
</style>
