/// <reference types="vite/client" />
import { ExperimentType, SessionString } from '@/types/ExperimentTypes';

declare type RouteParamsRaw = {
  session: SessionString;
  experimentType: ExperimentType;
};
