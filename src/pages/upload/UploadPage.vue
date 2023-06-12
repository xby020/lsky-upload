<template>
  <div class="w-full h-full flex gap-4">
    <!-- left -->
    <div
      class="flex-auto h-full border-2 card-board flex flex-col justify-center items-center gap-2 p-4"
    >
      <!-- Upload -->
      <div
        ref="dropZoneRef"
        class="w-full flex-auto flex flex-col justify-center items-center gap-2 select-none cursor-pointer text-primary rounded-lg py-4"
        :class="[
          uploadList.length > 0
            ? 'border-2 border-dashed border-primary-focus/20'
            : '',
          isOverDropZone ? 'animate-pulse' : '',
        ]"
        @click="showFileDialog"
      >
        <div
          class="i-mdi-upload text-12 cursor-pointer hover:text-secondary"
          @click.stop="btnUploadClick"
        ></div>
        <div class="text-2xl font-semibold text-primary-focus">上传图片</div>
        <div
          class="text-center"
          :class="uploadList.length > 0 ? 'text-md' : 'text-lg'"
        >
          点击、拖拽
          <br />
          或 <kbd class="d-kbd d-kbd-sm">Ctrl</kbd> +
          <kbd class="d-kbd d-kbd-sm">V</kbd> 粘贴图片到此处
          <br />
          点击上面的图标上传队列里全部图片
        </div>
      </div>

      <!-- List -->
      <div class="w-full h-2/3 bg-secondary/10" v-if="uploadList.length > 0">
        <img-list
          v-model:files="uploadList"
          v-model:select="choosenFile"
        ></img-list>
      </div>
    </div>

    <!-- right -->
    <div class="w-2/5 h-full border-2 card-board" v-if="uploadList.length > 0">
      <img-preview :files="true" :select="showFileInfo"></img-preview>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  base64ToBuffer,
  getFileNameFromPath,
  getFiles,
  getRandomId,
} from '@/preload';
import { FileInfo } from '@/types/files';
import dayjs from 'dayjs';
import {
  isDarkColors,
  onPluginEnter,
  onPluginOut,
  showOpenDialog,
} from 'uTools';
import ImgList from './components/imgList/ImgList.vue';
import ImgPreview from './components/imgPreview/ImgPreview.vue';
import { useUserStore } from '@/store/modules/user';

const uploadList = ref<FileInfo[]>([]);
const userStore = useUserStore();

const { token, choosenStrategy } = storeToRefs(userStore);

onMounted(async () => {
  // 检测用户是否登录
  if (!token.value) {
    // 登录
    await userStore.login();
  }
});

// 从utools插件进入
onPluginEnter(async ({ code, type, payload }) => {
  console.log(code, type, payload);
  if (code === 'upload') {
    if (type === 'files') {
      const files = getFiles(payload);
      uploadList.value = files.map((file) => {
        return {
          id: getRandomId(),
          name: file.name,
          file,
          progress: 0,
          status: 'waiting',
        };
      });
    }
    if (type === 'img') {
      // 获取三位随机字符
      const randomStr = Math.random().toString(36).slice(-3);
      const name = `${dayjs().format('YYYYMMDDHHmmss')}${randomStr}.png`;
      const fileBolb = base64ToBuffer(payload);
      const file = new File([fileBolb.buffer], name, {
        type: 'image/png',
      });

      uploadList.value = [
        {
          id: getRandomId(),
          name,
          file: file,
          progress: 0,
          status: 'waiting',
        },
      ];
    }
  }
});

onPluginOut(() => {
  uploadList.value = [];
});

// 打开文件选择对话框
function showFileDialog() {
  const fileArray = showOpenDialog({
    title: '选择图片',
    filters: [
      {
        name: 'Images',
        extensions: ['jpeg', 'jpg', 'png', 'psd', 'tif', 'bmp', 'webp'],
      },
    ],
    properties: ['openFile', 'multiSelections'],
  });

  if (fileArray) {
    const fileInfoArray = fileArray.map((path) => {
      const fileName = getFileNameFromPath(path);
      return {
        name: fileName,
        path: path,
      };
    });

    const files: File[] = getFiles(fileInfoArray);
    const fileList: FileInfo[] = files.map((file) => {
      return {
        id: getRandomId(),
        name: file.name,
        file,
        progress: 0,
        status: 'waiting',
      };
    });
    uploadList.value.push(...fileList);
  }
}

// 拖拽上传
const dropZoneRef = ref<HTMLElement | null>(null);
function onDrop(file: File[] | null) {
  if (file) {
    const fileInfoArray: FileInfo[] = file.map((f) => {
      return {
        id: getRandomId(),
        name: f.name,
        file: f,
        progress: 0,
        status: 'waiting',
      };
    });
    uploadList.value.push(...fileInfoArray);
  }
}
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

// 上传文件列表中所有图片
async function uploadFileList(fileList: FileInfo[]) {
  fileList.forEach(async (f) => {
    const fileInfo = uploadList.value.find((file) => file.id === f.id);
    if (fileInfo) {
      fileInfo.status = 'uploading';
      try {
        const res = await userStore.uploadImg(f, choosenStrategy.value);
        if (res) {
          console.log(uploadList.value);
          fileInfo.status = 'success';
          fileInfo.links = res.links;
        } else {
          fileInfo.status = 'error';
        }
      } catch (error) {
        fileInfo.status = 'error';
      }
    }
  });
}

// 上传图标点击
const unUploadFileList = computed(() => {
  return uploadList.value.filter((file) => file.status !== 'success');
});
async function btnUploadClick() {
  if (unUploadFileList.value.length > 0) {
    uploadFileList(unUploadFileList.value);
  } else {
    showFileDialog();
  }
}

function getFileSize(file: File) {
  let size = file.size;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let index = 0;
  while (size > 1024) {
    size /= 1024;
    index++;
  }
  return {
    size: Number(size.toFixed(2)),
    sizeUnit: units[index],
  };
}

// 图片选择
const choosenFile = ref<FileInfo | undefined>();
const showFileInfo = computed((): FileInfo | undefined => {
  if (choosenFile.value) {
    const curFile: FileInfo | undefined = uploadList.value.find(
      (file) => file.id === choosenFile.value?.id,
    );
    if (curFile) {
      curFile.url = URL.createObjectURL(curFile.file);
      const { size, sizeUnit } = getFileSize(curFile.file);
      curFile.size = size;
      curFile.sizeUnit = sizeUnit;
    }
    return curFile;
  } else {
    return undefined;
  }
});
</script>

<style scoped></style>
