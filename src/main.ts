import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';

import './registerServiceWorker';
import './helpers';

import App from './App.vue';
import StoryLoader from './components/StoryLoader.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/story',
      component: StoryLoader,
      props: (route) => ({ axios }),
    },
  ],
});

const _vue = new Vue({
  router,
  el: '#app',
  render: (h) => h(App),
});
