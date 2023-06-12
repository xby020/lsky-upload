<template>
  <div
    class="absolute w-full h-full flex flex-col justify-center items-center pointer-events-none z-999"
  >
    <div class="absolute top-10 w-2/3 h-full overflow-hidden">
      <transition-group name="list">
        <div
          v-for="notice in notificationList"
          :key="notice.id"
          class="d-alert w-full pointer-events-auto mb-2"
          :class="`${notice.typeClass}`"
        >
          <div class="text-3xl" :class="notice.typeIcon"></div>
          <div class="flex flex-col gap-1 justify-center">
            <span class="text-lg font-semibold">{{ notice.title }}</span>
            <span v-if="notice.content">{{ notice.content }}</span>
          </div>
          <div>
            <slot name="action"></slot>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Notice } from '@/types/window';

const notificationList = ref<Notice.NoticeInfo[]>([]);

function createNotication(notification: Notice.NoticeInfo) {
  const randomId = Math.random().toString(36).slice(-8);
  notification.id = randomId;
  notification.duration = notification.duration || 3000;
  switch (notification.type) {
    case 'success':
      notification.typeClass = 'd-alert-success';
      notification.typeIcon = 'i-mdi-check-circle';
      break;
    case 'info':
      notification.typeClass = 'd-alert-info';
      notification.typeIcon = 'i-mdi-information';
      break;
    case 'warning':
      notification.typeClass = 'd-alert-warning';
      notification.typeIcon = 'i-mdi-alert';
      break;
    case 'error':
      notification.typeClass = 'd-alert-error';
      notification.typeIcon = 'i-mdi-close-circle';
      break;
  }
  notificationList.value.push(notification);

  const timer = setTimeout(() => {
    notificationList.value = notificationList.value.filter(
      (item) => item.id !== randomId,
    );
    clearTimeout(timer);
  }, notification.duration);
  notification.timer = timer;
}

// 当 notificationList 超过 3 个时，删除第一个
watch(notificationList, (newVal) => {
  if (newVal.length > 3) {
    const first = newVal[0];
    clearTimeout(first.timer);
    notificationList.value.shift();
  }
});

function sendNotice(
  info: Omit<Notice.NoticeInfo, 'type'> | string,
  type: Notice.NoticeInfo['type'],
) {
  if (typeof info === 'string') {
    createNotication({ title: info, type });
  } else {
    createNotication({ ...info, type });
  }
}

const notice: Notice.Notice = {
  create: createNotication,
  success: (info) => sendNotice(info, 'success'),
  info: (info) => sendNotice(info, 'info'),
  warning: (info) => sendNotice(info, 'warning'),
  error: (info) => sendNotice(info, 'error'),
};

onMounted(() => {
  window.$notice = notice;
});
</script>

<style lang="pcss" scoped>
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  @apply transform-gpu transition-all duration-300 ease-in-out opacity-95;
}

.list-enter-from,
.list-leave-to {
  @apply opacity-0 translate-y-[-100%] scale-50;
}

.list-enter-to,
.list-leave-from {
  @apply opacity-100 translate-y-0 scale-100;
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>
