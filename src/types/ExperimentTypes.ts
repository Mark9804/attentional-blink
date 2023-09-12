export type ExperimentType = 'Control' | 'Experiment';
// prettier-ignore
export type RomajiCharacter = |
    'あ' | 'い' | 'う' | 'え' | 'お' |
    'か' | 'き' | 'く' | 'け' | 'こ' |
    'さ' | 'し' | 'す' | 'せ' | 'そ' |
    'た' | 'ち' | 'つ' | 'て' | 'と' |
    'な' | 'に' | 'ぬ' | 'ね' | 'の' |
    'は' | 'ひ' | 'ふ' | 'へ' | 'ほ' |
    'ま' | 'み' | 'む' | 'め' | 'も' |
    'や' | 'ゆ' | 'よ' |
    'ら' | 'り' | 'る' | 'れ' | 'ろ' |
    'わ' | 'を' | 'ん';

export interface ExperimentSession {
  session?: number;
  experimentType?: ExperimentType;
  letterStream: string;
  // 15C0:
  // 15 letters before target,
  // experiment group,
  // second target at position 0
  // NA if no second target
  letterStreamCode: string;
  firstTarget: RomajiCharacter;
  firstTargetPosition: number;
  secondTargetPosition: number | 'NA';
  firstTargetResponse?: RomajiCharacter;
  firstTargetCorrect?: boolean;
  secondTargetResponse?: 'y' | 'n';
  secondTargetCorrect?: boolean;
}
