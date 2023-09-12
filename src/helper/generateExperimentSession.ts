import { shuffle } from 'lodash-es';
import { romajiCharacters } from '@/helper/romajiCharacters.ts';
import { ExperimentSession, RomajiCharacter } from '@/types/ExperimentTypes';
import { settings } from '@/settings';

function generateLetterStreamWithoutSecondTarget(letterCount: number): string {
  const romajiCharacterList = romajiCharacters.filter(e => 'ん' !== e);
  let letterStream = '';
  for (let i = 0; i < letterCount; i++) {
    letterStream +=
      romajiCharacterList[
        Math.floor(Math.random() * romajiCharacterList.length)
      ];
  }
  return letterStream;
}

function generateExperimentSession(
  secondTargetPosition: number | 'NA'
): ExperimentSession {
  const letterCountBeforeFirstTarget = 7 + Math.floor(Math.random() * 8);
  const letterStreamBeforeFirstTarget = generateLetterStreamWithoutSecondTarget(
    letterCountBeforeFirstTarget
  );
  const firstTarget =
    0 === secondTargetPosition
      ? 'ん'
      : (generateLetterStreamWithoutSecondTarget(1) as RomajiCharacter);
  let secondPartLetterStream = '';
  if ('NA' === secondTargetPosition) {
    secondPartLetterStream = generateLetterStreamWithoutSecondTarget(8);
  } else if (0 === secondTargetPosition) {
    secondPartLetterStream = generateLetterStreamWithoutSecondTarget(7);
  } else {
    secondPartLetterStream += generateLetterStreamWithoutSecondTarget(
      secondTargetPosition as number
    );
    secondPartLetterStream += 'ん';
    secondPartLetterStream += generateLetterStreamWithoutSecondTarget(
      7 - (secondTargetPosition as number)
    );
  }
  const letterStream =
    letterStreamBeforeFirstTarget + firstTarget + secondPartLetterStream;
  const letterStreamCode =
    letterCountBeforeFirstTarget + 'X' + secondTargetPosition;

  return {
    letterStream,
    letterStreamCode,
    firstTarget,
    firstTargetPosition: letterCountBeforeFirstTarget + 1,
    secondTargetPosition,
  };
}

function generateExperimentSessionList(): ExperimentSession[] {
  const sessionWithoutSecondTargetList: ExperimentSession[] = [];
  const sessionWithSecondTargetList: ExperimentSession[] = [];
  const isDev = settings.isDevEnv;
  // generate sessions without second target
  for (let session = 0; session < settings.trialsPerSession; session++) {
    const experimentSession = generateExperimentSession('NA');
    sessionWithoutSecondTargetList.push(experimentSession);
  }
  // generate sessions with second target
  const iterationCount = isDev ? 1 : 10;
  for (
    let secondTargetPosition = 0;
    secondTargetPosition < 9;
    secondTargetPosition++
  ) {
    for (let session = 0; session < iterationCount; session++) {
      const experimentSession = generateExperimentSession(secondTargetPosition);
      sessionWithSecondTargetList.push(experimentSession);
    }
  }
  const experimentSessionList = sessionWithoutSecondTargetList.concat(
    sessionWithSecondTargetList
  );
  const shuffledExperimentSessionList = shuffle(experimentSessionList);
  for (
    let session = 0;
    session < shuffledExperimentSessionList.length;
    session++
  ) {
    shuffledExperimentSessionList[session].session = session + 1;
  }
  return shuffledExperimentSessionList;
}

export {
  generateLetterStreamWithoutSecondTarget,
  generateExperimentSession,
  generateExperimentSessionList,
};
