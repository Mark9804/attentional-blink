import { defineStore } from 'pinia';
import { romajiCharacters } from '@/helper/romajiCharacters.ts';
import { ExperimentSession } from '@/types/ExperimentTypes';

export const useAttentionalBlinkStore = defineStore({
  id: 'attentional-blink-store',
  persist: true,
  state: () => {
    return {
      // prettier-ignore
      romajiCharacterList: romajiCharacters,
      sessionsList: [] as ExperimentSession[],
    };
  },
  getters: {
    getSessionInfo: state => (session: number) =>
      state.sessionsList.filter(e => e.session === session)
        ? state.sessionsList.filter(e => e.session === session)[0]
        : null,
    getSecondTargetList: state =>
      state.sessionsList.filter(
        i => 'NA' !== i.secondTargetPosition
      ),
    getExperimentResult: state => state.sessionsList,
    getMaximumLetterStreamLength: state =>
      Math.max(...state.sessionsList.map(e => e.letterStream.length)),
  },
  actions: {
    setSessionsList(sessionsList: ExperimentSession[]): void {
      this.sessionsList = sessionsList;
    },
    setSessionResponse(session: number, property: string, value: any): void {
      const sessionIndex = this.sessionsList.findIndex(
        e => e.session === session
      );
      if (-1 !== sessionIndex) {
        // @ts-ignore
        this.sessionsList[sessionIndex][property] = value;
      }
    },
  },
});
