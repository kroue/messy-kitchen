/**
 * Generates the Open Graph images in public/og/ (1200×630, brand style).
 * Run after changing titles or branches:  npm run og
 */
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'public/og');
fs.mkdirSync(out, { recursive: true });

const font = (pkg, file) => fs.readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file));
const fonts = [
  { name: 'Jost', data: font('jost', 'jost-latin-300-normal.woff'), weight: 300, style: 'normal' },
  { name: 'Jost', data: font('jost', 'jost-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Newsreader', data: font('newsreader', 'newsreader-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Newsreader', data: font('newsreader', 'newsreader-latin-400-italic.woff'), weight: 400, style: 'italic' },
];

// Reuse the traced whisk-and-bowl mark.
const logoSrc = fs.readFileSync(path.join(root, 'src/components/LogoMark.astro'), 'utf8');
const d = logoSrc.match(/<path d="([^"]+)"/)[1];
const viewBox = logoSrc.match(/viewBox="([^"]+)"/)[1];
const logo = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="#1A1A1A" fill-rule="evenodd" d="${d}"/></svg>`,
).toString('base64')}`;

const ACCENT = { matcha: '#7A8F5A', cookie: '#B07A48', ube: '#7B5C8E' };

const pages = [
  { file: 'default', eyebrow: 'Café & Bakery · Cagayan de Oro', title: 'Baked with love since 2018', sub: 'Tres leches, cookies, matcha & coffee. Three branches, open daily.', accent: 'cookie' },
  { file: 'menu', eyebrow: 'The Menu', title: 'Tres leches, cookies & matcha', sub: 'Whole cakes, slices, coffee and soft serve in CDO.', accent: 'matcha' },
  { file: 'reserve', eyebrow: 'Cake Reservations', title: 'Reserve a cake', sub: 'Pickup at Nazareth, Ayala Centrio or Kauswagan.', accent: 'cookie' },
  { file: 'branches', eyebrow: 'Visit Us', title: 'Three branches in CDO', sub: 'Nazareth · Ayala Centrio · Kauswagan. Open daily 9 AM – 8 PM.', accent: 'ube' },
  { file: 'branch-nazareth', eyebrow: 'Nazareth · Cagayan de Oro', title: 'A quiet café in Nazareth', sub: '9th–16th Street, Nazareth. Open daily 9 AM – 8 PM.', accent: 'matcha' },
  { file: 'branch-ayala-centrio', eyebrow: 'Ayala Malls Centrio', title: 'Our Centrio kiosk', sub: 'Cookies, iced drinks and cake pickups.', accent: 'ube' },
  { file: 'branch-kauswagan', eyebrow: 'Kauswagan · Right before S&R', title: 'Pasalubong on the way to the airport', sub: 'Home of Cookie Butter Soft Serve.', accent: 'cookie' },
  { file: 'celebrations', eyebrow: 'Celebrations & Corporate', title: 'Cookie boxes & cake bundles', sub: 'Bulk orders, office pantry and corporate gifts.', accent: 'ube' },
  { file: 'about', eyebrow: 'Our Story', title: 'Baking since 2018', sub: 'A little kitchen in Cagayan de Oro, three branches later.', accent: 'matcha' },
];

const h = (type, style, ...children) => ({ type, props: { style, children: children.length === 1 ? children[0] : children } });

for (const p of pages) {
  const tree = h(
    'div',
    { width: 1200, height: 630, display: 'flex', background: '#FBF8F3', padding: 64, fontFamily: 'Newsreader' },
    h(
      'div',
      { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingRight: 48 },
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: 20 },
        { type: 'img', props: { src: logo, width: 84, height: 80 } },
        h(
          'div',
          { display: 'flex', flexDirection: 'column' },
          h('div', { fontFamily: 'Jost', fontWeight: 400, fontSize: 24, letterSpacing: 7, color: '#1A1A1A' }, 'THE MESSY KITCHEN'),
          h('div', { fontFamily: 'Jost', fontWeight: 400, fontSize: 15, letterSpacing: 6, color: '#5C554D', marginTop: 6 }, 'CAFÉ & BAKERY'),
        ),
      ),
      h(
        'div',
        { display: 'flex', flexDirection: 'column' },
        h('div', { display: 'flex', alignItems: 'center', gap: 16 },
          h('div', { width: 40, height: 2, background: ACCENT[p.accent] }, ''),
          h('div', { fontFamily: 'Jost', fontSize: 20, letterSpacing: 6, color: '#5C554D' }, p.eyebrow.toUpperCase()),
        ),
        h('div', { fontFamily: 'Jost', fontWeight: 300, fontSize: 64, lineHeight: 1.15, letterSpacing: 8, color: '#1A1A1A', marginTop: 24, maxWidth: 760 }, p.title.toUpperCase()),
        h('div', { fontSize: 30, color: '#5C554D', marginTop: 24, maxWidth: 720 }, p.sub),
      ),
    ),
    h('div', { width: 300, height: '100%', borderRadius: '150px 150px 28px 28px', background: '#F1E9DD', display: 'flex', alignItems: 'center', justifyContent: 'center' },
      { type: 'img', props: { src: logo, width: 190, height: 181, style: { opacity: 0.9 } } },
    ),
  );
  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(out, `${p.file}.png`));
  console.log('og/' + p.file + '.png');
}
