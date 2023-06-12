<template>
  <div class="w-full h-full card-board flex flex-col p-4">
    <!-- Header -->
    <div class="d-navbar bg-base-100">
      <div class="flex-1">
        <a class="text-xl font-bold">设置</a>
      </div>

      <div class="flex-none">
        <button class="d-btn d-btn-success" @click="handleSave">
          <span class="d-loading d-loading-spinner" v-if="saveLoading"></span>
          <div class="i-mdi-content-save text-base" v-else></div>
          保存
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="w-full flex-auto px-2">
      <!-- 接口地址 -->
      <div class="d-form-control w-full max-w-xs">
        <label class="d-label">
          <span class="d-label-text text-lg">接口地址</span>
        </label>
        <input
          v-model="form.baseUrl"
          type="text"
          placeholder="https://example.com/ap1/v1"
          class="d-input d-input-bordered w-full max-w-xs"
        />
      </div>

      <!-- 用户名(邮箱) -->
      <div class="d-form-control w-full max-w-xs">
        <label class="d-label">
          <span class="d-label-text text-lg">用户名(邮箱)</span>
        </label>
        <input
          v-model="form.email"
          type="text"
          placeholder="XXX@email.com"
          class="d-input d-input-bordered w-full max-w-xs"
        />
      </div>

      <!-- 密码 -->
      <div class="d-form-control w-full max-w-xs">
        <label class="d-label">
          <span class="d-label-text text-lg">密码</span>
          <div class="d-btn d-btn-xs" @click="showPassword = !showPassword">
            <div :class="showPassword ? 'i-mdi-eye' : 'i-mdi-eye-off'"></div>
          </div>
        </label>
        <input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入密码"
          class="d-input d-input-bordered w-full max-w-xs"
        />
      </div>

      <!-- 上传策略 -->
      <div class="d-form-control w-full max-w-xs">
        <label class="d-label">
          <span class="d-label-text">上传策略</span>
        </label>
        <select class="d-select d-select-bordered">
          <option
            v-for="s in strategies"
            :key="s.id"
            :selected="choosenStrategy === s.id"
          >
            {{ s.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { LskyStrategy } from '@/types/user';

const userStore = useUserStore();
const { baseUrl, email, password } = storeToRefs(userStore);

const saveLoading = ref(false);
const showPassword = ref(false);
const form = reactive({
  baseUrl,
  email,
  password,
});

async function handleSave() {
  try {
    saveLoading.value = true;
    userStore.save();
    window.$notice.success('已保存');
    await userStore.login();
  } finally {
    saveLoading.value = false;
  }
}

// 上传策略选择
const { choosenStrategy } = storeToRefs(userStore);
const strategies = ref<LskyStrategy[]>([]);
onMounted(async () => {
  strategies.value = await userStore.getStrategies();
});
</script>

<style scoped></style>
