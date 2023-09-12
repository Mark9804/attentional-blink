<script setup lang="ts">
import { settings } from '@/settings';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAttentionalBlinkStore } from '@/store/store';
import { RomajiCharacter } from '@/types/ExperimentTypes.ts';
import { Message } from '@arco-design/web-vue';

const router = useRouter();
const useStore = useAttentionalBlinkStore();

const params = computed(() => router.currentRoute.value.params);
const session = computed(() => parseInt(params.value.session as string));
const sessionInfo = computed(() => useStore.getSessionInfo(session.value));
const letterStream = computed(() => sessionInfo.value!.letterStream.split(''));
const firstTargetPosition = computed(
  () => sessionInfo.value!.firstTargetPosition
);
const firstTarget = computed(() => sessionInfo.value!.firstTarget);
const experimentType = computed(() => sessionInfo.value!.experimentType);
const secondTargetPosition = computed(
  () => sessionInfo.value!.secondTargetPosition
);
const nextSession = computed(() => session.value + 1);
const hasNextSession = computed(
  () => !!useStore.getSessionInfo(nextSession.value)
);

const currentWordTemplate = ref('<p></p>');
const showFirstTargetResponsePane = ref(false);
const showSecondTargetResponsePane = ref(false);
const firstTargetResponse = ref('' as RomajiCharacter);

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function init() {
  currentWordTemplate.value = '<p>・</p>';
  await wait(180);
  currentWordTemplate.value = '';
  await wait(settings.waitTime);
  for (let i = 0; i < letterStream.value.length; i++) {
    currentWordTemplate.value = `<p style="color: ${
      i + 1 === firstTargetPosition.value ? 'white' : 'black'
    }">${letterStream.value[i]}</p>`;
    await wait(settings.wordInterval);
    await nextTick();
    currentWordTemplate.value = '';
    await nextTick();
    await wait(settings.waitTime);
  }
  currentWordTemplate.value = '';
  if ('Experiment' === experimentType.value) {
    showFirstTargetResponsePane.value = true;
  } else {
    showSecondTargetResponsePane.value = true;
  }
}

function handleFirstTargetResponse() {
  // @ts-ignore
  if (!/[\u3041-\u3096]/.test(firstTargetResponse.value)) {
    Message.error('ひらがなを記入しでください');
    return;
  }
  firstTargetResponse.value =
    firstTargetResponse.value.trim() as RomajiCharacter;
  useStore.setSessionResponse(
    session.value,
    'firstTargetResponse',
    firstTargetResponse.value
  );
  useStore.setSessionResponse(
    session.value,
    'firstTargetCorrect',
    firstTargetResponse.value === firstTarget.value
  );
  showFirstTargetResponsePane.value = false;
  showSecondTargetResponsePane.value = true;
}

function handleSecondTargetResponse(response: boolean) {
  const isSecondTargetPresent = 'NA' !== secondTargetPosition.value;
  const isSecondTargetCorrect = response === isSecondTargetPresent;
  const secondTargetResponse = response ? 'y' : 'n';
  useStore.setSessionResponse(
    session.value,
    'secondTargetResponse',
    secondTargetResponse
  );
  useStore.setSessionResponse(
    session.value,
    'secondTargetCorrect',
    isSecondTargetCorrect
  );
  router.push({
    name: hasNextSession.value ? 'ExperimentInstruction' : 'ExperimentEnd',
    query: {
      nextSession: session.value + 1,
    },
  });
}

onMounted(() => {
  init();
});
</script>

<template>
  <div
    class="flex flex-col text-8xl px-8 font-bold"
    v-html="currentWordTemplate"
  ></div>
  <a-space
    direction="vertical"
    size="large"
    fill
    v-if="showFirstTargetResponsePane"
  >
    <h1>第１ターゲットを記入してください</h1>
    <a-input
      v-model="firstTargetResponse"
      size="large"
      placeholder="第１ターゲットを記入してください"
    />
    <a-space fill direction="vertical" align="center">
      <a-button type="primary" size="large" @click="handleFirstTargetResponse">
        提出して次へ
      </a-button>
    </a-space>
  </a-space>
  <a-space
    direction="vertical"
    size="large"
    align="center"
    fill
    v-if="showSecondTargetResponsePane"
  >
    <h1>第２ターゲットの有無を教えてください</h1>
    <a-space align="center" size="large">
      <template #split>
        <a-divider direction="vertical" />
      </template>
      <a-button size="large" @click="handleSecondTargetResponse(true)"
        >あり</a-button
      >
      <a-button size="large" @click="handleSecondTargetResponse(false)"
        >なし</a-button
      >
    </a-space>
  </a-space>
</template>

<style scoped lang="scss"></style>
