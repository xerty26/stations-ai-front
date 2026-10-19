import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createServer } from 'vite';

const DIST = 'dist';
const HOISTED_TAGS = /<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>/g;

const server = await createServer({ appType: 'custom', server: { middlewareMode: true }, logLevel: 'error' });

try {
    const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
    const { PROVINCE_NAMES } = await server.ssrLoadModule('/src/utils/provinces.js');
    const template = await readFile(join(DIST, 'index.html'), 'utf-8');

    const routes = ['/', '/legal', '/gasolineras', '/historico-precios', ...Object.keys(PROVINCE_NAMES).map((slug) => `/gasolineras/${slug}`)];

    for (const url of routes) {
        const html = render(url);
        const headTags = (html.match(HOISTED_TAGS) || []).map((tag) => tag.replace(/^<(\w+)/, '<$1 data-prerender'));
        const body = html.replace(HOISTED_TAGS, '');

        const page = template
            .replace('</head>', `${headTags.join('\n')}\n    </head>`)
            .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

        const dir = join(DIST, url);
        await mkdir(dir, { recursive: true });
        await writeFile(join(dir, 'index.html'), page);
    }

    console.log(`Prerendered ${routes.length} routes`);
} finally {
    await server.close();
}
