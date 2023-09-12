import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import { routerConvert } from './routes/routes';
import ArcoVue from '@arco-design/web-vue';
import { Message } from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from './App.vue';
import { eventBus } from './eventBus';
import './style.scss';

document.addEventListener('keydown', event => {
  if (event.key === ' ') {
    eventBus.emit('spaceKeyPressed');
  } else {
    eventBus.emit('keyPressed', event.key);
  }
});

document.addEventListener('keyup', event => {
  if (event.key === ' ') {
    eventBus.emit('spaceKeyReleased');
  } else {
    eventBus.emit('keyReleased', event.key);
  }
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
Message._context = app._context;
app.use(pinia).use(routerConvert).use(ArcoVue).mount('#app');
