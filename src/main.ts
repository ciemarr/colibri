import Vue from 'vue';
import sanitizeHtml from 'sanitize-html';

const myPlugin = {
  install(vue: any, options: any) {
    const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    ]);
    Vue.prototype.$sanitize = function(html: string) {
      return sanitizeHtml(html, { allowedTags });
    };
  }
};

Vue.use(myPlugin);

import VueRouter from 'vue-router';
import axios from 'axios';
import './registerServiceWorker';
import App from './App.vue';
import StoryLoader from './components/StoryLoader.vue';

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
        axios: axios,
      }),
    },
  ],
});

const _vue = new Vue({
  router,
  el: '#app',
  render: (h) => h(App),
});
