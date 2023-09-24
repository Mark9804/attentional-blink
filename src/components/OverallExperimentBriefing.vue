<script setup lang="ts">
import { useRouter } from 'vue-router';
import { generateExperimentSessionList } from '@/helper/generateExperimentSession.ts';
import { useAttentionalBlinkStore } from '@/store/store.ts';
import { ExperimentType, RomajiCharacter } from '@/types/ExperimentTypes.ts';

const router = useRouter();
const useStore = useAttentionalBlinkStore();

function handleExperimentTypeSelect(experimentType: ExperimentType) {
  const experimentSessions = generateExperimentSessionList();
  const typeExperiment = Array.from({ length: 90 }, () => 'Experiment');
  const typeControl = Array.from({ length: 90 }, () => 'Control');
  const sessionTypeList =
    'Experiment' === experimentType
      ? typeExperiment.concat(typeControl)
      : typeControl.concat(typeExperiment);
  const experimentSessionList = experimentSessions.map((session, index) => {
    session.experimentType = sessionTypeList[index] as ExperimentType;
    session.letterStreamCode = session.letterStreamCode.replace(
      'X',
      'Experiment' === experimentType ? 'E' : 'C'
    );
    session.firstTargetResponse = '' as RomajiCharacter;
    session.firstTargetCorrect = false;
    // @ts-ignore
    session.secondTargetResponse = '';
    session.secondTargetCorrect = false;
    return session;
  });
  useStore.setSessionsList(experimentSessionList);
  router.replace({
    name: 'ExperimentInstruction',
    query: {
      nextSession: 1,
    },
  });
}
</script>

<template>
  <a-space direction="vertical" align="center" :size="36">
    <h1>セッション順を選んでください</h1>
    <a-space align="center" size="large">
      <template #split>
        <a-divider direction="vertical" />
      </template>
      <a-tooltip>
        <template #content>
          実験条件が先に実施する。実験条件セッションが終わる後，統制条件を実施する。
        </template>
        <a-button
          type="primary"
          size="large"
          @click="handleExperimentTypeSelect('Experiment')"
          >実験条件が先に実施する</a-button
        >
      </a-tooltip>
      <a-tooltip>
        <template #content>
          統制条件が先に実施する。統制条件セッションが終わる後，実験条件を実施する。
        </template>
        <a-button size="large" @click="handleExperimentTypeSelect('Control')"
          >統制条件が先に実施する</a-button
        >
      </a-tooltip>
    </a-space>
  </a-space>
</template>

<style scoped lang="scss"></style>
