<script setup lang="ts">
import { eventBus } from '@/eventBus.ts';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAttentionalBlinkStore } from '@/store/store';
import { ExperimentType } from '@/types/ExperimentTypes';
import {settings} from "@/settings.ts";

const router = useRouter();
const useStore = useAttentionalBlinkStore();

const query = computed(() => router.currentRoute.value.query);

const nextSession = (query.value.nextSession as string) ?? 1;
const sessionInfo = computed(() =>
  useStore.getSessionInfo(parseInt(nextSession))
);
const sessionType = computed(
  () => sessionInfo.value?.experimentType as ExperimentType
);
const sessionTypeString = {
  Experiment: '実験条件',
  Control: '統制条件',
};

function getSessionTypeString(sessionType: string) {
  return Reflect.get(sessionTypeString, sessionType);
}

const spaceKeyLongPressed = ref(false);
const spaceKeyPressStartTimestamp = ref(0);

eventBus.on('spaceKeyPressed', () => {
  if (0 === spaceKeyPressStartTimestamp.value) {
    spaceKeyPressStartTimestamp.value = Date.now();
  }
  if (Date.now() - spaceKeyPressStartTimestamp.value > settings.spacePressTime) {
    spaceKeyLongPressed.value = true;
  }
});

eventBus.on('spaceKeyReleased', () => {
  spaceKeyPressStartTimestamp.value = 0;
  if (spaceKeyLongPressed.value) {
    spaceKeyLongPressed.value = false;
    eventBus.off('spaceKeyPressed');
    eventBus.off('spaceKeyReleased');
    router.push({
      name: 'ExperimentComponent',
      params: {
        session: nextSession,
      },
    });
  }
});
</script>

<template>
  <a-space
    direction="vertical"
    align="center"
    :size="36"
    v-if="!spaceKeyLongPressed"
  >
    <h1>次の試行は{{ getSessionTypeString(sessionType) }}</h1>
    <a-space direction="vertical" align="start" size="medium">
      <p>
        次の試行は，<span class="text-primary-6 font-bold">{{
          getSessionTypeString(sessionType)
        }}</span
        >となっています。<br />
      </p>
      <p v-if="'Experiment' === sessionType">
        第１ターゲットの白文字を<span class="text-yellow-400">読み取る</span
        >とともに，<br />
        第２ターゲットの”ん”が文字列に含まれている<br />
        かどうかを判断してください
      </p>
      <p v-else>
        第１ターゲットの白文字を<span class="text-yellow-400">無視</span
        >して，<br />
        第２ターゲットの「ん」が文字列に含まれている<br />
        かどうかを判断してください
      </p>
      <p>
        準備ができたら Space キーを１秒以上に押して<br />
        実験を始めてください
      </p>
    </a-space>
  </a-space>
  <a-space v-else-if="spaceKeyLongPressed">
    <h1>Space キーを離し，実験が開始します</h1>
  </a-space>
</template>

<style scoped lang="scss">
p {
  @apply text-2xl;
}
</style>
