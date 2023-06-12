<template>
  <div class="w-full h-full card-board flex gap-2 p-4">
    <div class="w-2/3 h-full card-board flex flex-col gap-2 p-2">
      <select class="d-select w-full max-w-xs" v-if="albums.length">
        <option
          v-for="album in albums"
          :key="album.id"
          :selected="selectAlbumId === album.id"
        >
          {{ album.name }}
        </option>
      </select>
      <div class="text-lg text-accent font-bold">默认相册</div>

      <div class="w-full flex-auto flex flex-wrap gap-2 overflow-y-auto">
        <div
          class="flex-grow cursor-pointer"
          v-for="img in images"
          :key="img.key"
          @click="handleChoosenImage(img)"
        >
          <img
            :src="img.links.thumbnail_url"
            class="min-w-full h-240px object-cover"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="w-1/3 h-full card-board">
      <img-preview :select="choosenImage"></img-preview>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { AlbumsQueryParams, AlbumsQueryResponse } from '@/types/lsky';
import ImgPreview from '../upload/components/imgPreview/ImgPreview.vue';

const userStore = useUserStore();

const albums = ref<AlbumsQueryResponse['data']>([]);
const selectAlbumId = ref(0);

async function getAlbums() {
  const res = await userStore.getAlbums({
    page: 1,
    order: 'newest',
    keyword: '',
  });
  albums.value = res;
  selectAlbumId.value = res[0] ? res[0].id : 0;
}

interface ImagesInfo {
  key: string;
  name: string;
  origin_name: string;
  pathname: string;
  size: number;
  width: number;
  height: number;
  md5: string;
  sha1: string;
  human_date: string;
  date: string;
  links: {
    url: string;
    html: string;
    bbcode: string;
    markdown: string;
    markdown_with_link: string;
    thumbnail_url: string;
  };
}

const images = ref<ImagesInfo[]>([]);
const choosenImage = ref<ImagesInfo>();

function handleChoosenImage(img: ImagesInfo) {
  const result = { ...img };
  result.name = result.origin_name;
  choosenImage.value = img;
}

onMounted(async () => {
  await getAlbums();
  const res = await userStore.getImages({
    page: 1,
    order: 'newest',
    keyword: '',
    album_id: selectAlbumId.value || null,
  });
  console.log(res);
  images.value = res.data;
});
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
