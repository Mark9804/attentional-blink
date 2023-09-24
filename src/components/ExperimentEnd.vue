<script setup lang="ts">
import { settings } from '@/settings.ts';
import { computed, ref } from 'vue';
import { utils, writeFileXLSX } from 'xlsx';
import { useAttentionalBlinkStore } from '@/store/store.ts';

const downloadButtonClicked = ref(false);
const useStore = useAttentionalBlinkStore();

const result = computed(() => useStore.getExperimentResult);
const maximumLetterStreamLength = computed(
  () => useStore.getMaximumLetterStreamLength * 2
);
const sheetTitles = [
  'letterStreamCode',
  'firstTarget',
  'firstTargetPosition',
  'secondTargetPosition',
  'session',
  'experimentType',
  'firstTargetResponse',
  'firstTargetCorrect',
  'secondTargetResponse',
  'secondTargetCorrect',
];
const sheetTitleLength = sheetTitles.map(title => {
  return { wch: title.length };
});

function handleDownloadResult() {
  downloadButtonClicked.value = true;
  const sheet = utils.json_to_sheet(result.value, {
    sheetStubs: true,
  });
  sheet['!cols'] = [
    { wch: maximumLetterStreamLength.value },
    ...sheetTitleLength,
  ];
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet, '実験結果');
  writeFileXLSX(workbook, '実験結果.xlsx');
}

function handleSubmitResult() {
  open(settings.submitUrl, '_blank');
}
</script>

<template>
  <a-space direction="vertical" align="center" :size="36">
    <h1>実験はこれで終了します</h1>
    <a-space direction="vertical" align="start" size="medium">
      <p>
        「<span class="text-primary-6 font-bold">結果をダウンロード</span
        >」ボタンをクリックして，<br />実験結果をダウンロードしてください。
      </p>
      <p v-if="downloadButtonClicked">
        そして，「<span class="text-yellow-400 font-bold">結果提出</span
        >」ボタンをクリックして，<br />ダウンロードした結果をフォームズで提出してください。
      </p>
    </a-space>
    <a-space>
      <template #split>
        <a-divider direction="vertical" />
      </template>
      <a-button type="primary" size="large" @click="handleDownloadResult">
        結果をダウンロード
      </a-button>
      <a-button
        v-if="downloadButtonClicked"
        type="primary"
        status="warning"
        size="large"
        @click="handleSubmitResult"
      >
        結果提出
      </a-button>
    </a-space>
  </a-space>
</template>

<style scoped lang="scss">
p {
  @apply text-2xl;
}
</style>
