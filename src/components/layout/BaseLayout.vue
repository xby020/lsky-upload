<template>
  <div
    class="relative w-full h-full flex flex-col justify-start items-center px-8 py-4 gap-4 overflow-hidden"
  >
    <!-- notification -->
    <system-notification></system-notification>
    <!-- Titie -->
    <div class="w-full h-72px d-navbar border-2 border-primary/20 rounded-lg">
      <!-- start -->
      <div class="d-navbar-start gap-4">
        <div class="d-avatar">
          <div class="w-10 rounded-full">
            <img src="https://docs.lsky.pro/logo.png" />
          </div>
        </div>
        <a class="text-base-content text-3xl font-semibold">
          {{ title ? title : '兰空图床上传' }}
        </a>
      </div>

      <!-- center -->
      <div class="d-navbar-center">
        <div class="d-tabs d-tabs-boxed">
          <a
            class="d-tab"
            :class="menu.route === name ? 'd-tab-active' : ''"
            v-for="menu in menuList"
            :key="menu.route"
            @click="goTo(menu.route)"
          >
            {{ menu.name }}
          </a>
        </div>
      </div>

      <!-- end -->
      <div class="d-navbar-end gap-2">
        <div
          class="d-btn d-btn-sm d-btn-circle d-tooltip flex justify-center items-center"
          data-tip="设置"
          @click="goTo('Settings')"
        >
          <div
            class="text-xl flex justify-center items-center i-mdi-cog text-neutral-content"
          ></div>
        </div>

        <!-- user -->
        <div class="d-btn flex gap-2">
          <div class="d-avatar">
            <div class="w-36px rounded-full">
              <img :src="userInfo.avatar" alt="" class="object-cover" />
            </div>
          </div>

          <div class="flex flex-col">
            <div class="text-base font-bold select-none text-secondary">
              {{ userInfo.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- content -->
    <div class="w-full flex-auto flex gap-4 overflow-hidden">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';

const route = useRoute();
const router = useRouter();

const title = computed(() => route.meta.title);
const name = computed(() => route.name);

const menuList = ref([
  {
    name: '上传',
    route: 'Upload',
  },
  {
    name: '画廊',
    route: 'Gallery',
  },
]);

function goTo(route: string) {
  router.push({ name: route });
}

// user profile
const userStore = useUserStore();
const userInfo = reactive({
  name: '未登录',
  avatar: 'https://docs.lsky.pro/logo.png',
});

onMounted(async () => {
  await userStore.getProfile();
  userInfo.name = userStore.name || '未登录';
  userInfo.avatar = userStore.avatar || 'https://docs.lsky.pro/logo.png';
});
</script>

<style scoped></style>
