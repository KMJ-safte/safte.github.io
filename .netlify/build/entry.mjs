import { r as renderers } from './chunks/remark-excerpt_JInAdv0o.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_0oGMkZII.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/about.astro.mjs');
const _page1 = () => import('./pages/archive.astro.mjs');
const _page2 = () => import('./pages/posts/_---slug_.astro.mjs');
const _page3 = () => import('./pages/robots.txt.astro.mjs');
const _page4 = () => import('./pages/rss.xml.astro.mjs');
const _page5 = () => import('./pages/_---page_.astro.mjs');
const pageMap = new Map([
    ["src/pages/about.astro", _page0],
    ["src/pages/archive.astro", _page1],
    ["src/pages/posts/[...slug].astro", _page2],
    ["src/pages/robots.txt.ts", _page3],
    ["src/pages/rss.xml.ts", _page4],
    ["src/pages/[...page].astro", _page5]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "1136d312-d90f-4f34-846b-94127915ed00"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
