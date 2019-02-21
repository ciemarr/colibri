import Vue from 'vue';
import sanitizeHtml from 'sanitize-html';

const sanitizeHtmlPlugin = {
  install(vue: any, options: any) {
    const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    ]);
    Vue.prototype.$sanitize = function(html: string) {
      return sanitizeHtml(html, { allowedTags });
    };
  }
};

Vue.use(sanitizeHtmlPlugin);


export function getStorage(): Storage {
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }

  return {
    length: 0,
    clear: () => {},
    getItem: (key: string) => null,
    key: (index: number) => null,
    removeItem: (key: string) => {},
    setItem: (key: string, value: string) => {},
  };
}
