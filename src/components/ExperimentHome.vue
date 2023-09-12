<script setup lang="ts">
import { eventBus } from '@/eventBus.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

eventBus.on('spaceKeyPressed', () => {
  eventBus.off('spaceKeyPressed');
  setTimeout(() => {
    router.push({
      name: 'OverallExperimentBriefing',
    });
  }, 4);
});
</script>

<template>
  <a-space>
    <a-space direction="vertical" size="large" fill>
      <h1 class="font-bold text-4xl">説明</h1>
      <p class="text-2xl">
        この実験は紙とペンを使用します（紙とペンはなんでも構いません）
      </p>
      <p class="text-2xl">
        用意できたら，右の図のようにセッション１ー６と記述してください<br />
        その際，上下の間隔は余裕を持つようにしてください
      </p>
      <p class="text-2xl">
        準備ができたら Space キーを押して次に進んでください
      </p>
    </a-space>
    <img alt="説明" src="@assets/intro_paper.jpg" />
  </a-space>
</template>

<style scoped lang="scss">
img {
  width: 48vw;
  min-width: 512px;
  max-width: 720px;
}
</style>
