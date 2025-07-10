
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/notes-rxjs/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/notes-rxjs"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 3352, hash: 'ea1c9f572131b6c6ca21e243fcfd59e272a44789cdb2b0c6365089227174c9f1', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 3705, hash: 'a45ff7e46eb9d3a2a5a21761e6d062336d8ce2800eb5318ed9cb9c630205e69f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 11338, hash: '1e0d37d63d0e411b7a5f76e85e9eb203aee7aa3dbdf2aa28ccdd2cdcd64cbfa3', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-TZ6QQZVY.css': {size: 41, hash: '1dULaUfmc3c', text: () => import('./assets-chunks/styles-TZ6QQZVY_css.mjs').then(m => m.default)}
  },
};
