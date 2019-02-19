import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import StoryLoader from './components/StoryLoader.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: StoryLoader,
      props: (route) => ({
        storyUrl: route.query.url,
      }),
    },
  ],
});

const _vue = new Vue({
  router,
  el: '#app',
  render: (h) => h(App),
});
