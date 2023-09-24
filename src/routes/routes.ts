import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import ExperimentComponent from '@components/ExperimentComponent.vue';
import ExperimentInstruction from '@components/ExperimentInstruction.vue';
import OverallExperimentBriefing from '@components/OverallExperimentBriefing.vue';
import ExperimentEnd from '@components/ExperimentEnd.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/briefing',
  },
  {
    path: '/start',
    redirect: '/briefing',
  },
  {
    path: '/briefing',
    name: 'OverallExperimentBriefing',
    component: OverallExperimentBriefing,
  },
  {
    path: '/instruction',
    name: 'ExperimentInstruction',
    component: ExperimentInstruction,
  },
  {
    path: '/:session/experiment',
    name: 'ExperimentComponent',
    component: ExperimentComponent,
  },
  {
    path: '/end',
    name: 'ExperimentEnd',
    component: ExperimentEnd,
  }
];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { routerConvert, routes };
