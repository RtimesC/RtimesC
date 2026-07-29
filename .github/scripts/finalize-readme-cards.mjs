import { readFile, writeFile } from 'node:fs/promises';

const cardPaths = [
  'profile/stats-light.svg',
  'profile/stats-dark.svg',
  'profile/top-langs-light.svg',
  'profile/top-langs-dark.svg',
];

const marker = '/* profile-card-static-state */';
const staticState = `
          ${marker}
          * { animation: none !important; }
          .stagger { opacity: 1 !important; }
`;

for (const cardPath of cardPaths) {
  const source = await readFile(cardPath, 'utf8');
  if (!source.includes('</style>')) {
    throw new Error(`${cardPath} does not contain an SVG style block.`);
  }
  const finalized = source.includes(marker)
    ? source
    : source.replace('</style>', `${staticState}        </style>`);
  const normalized = finalized
    .replace(/[ \t]+$/gm, '')
    .replace(/\n+$/, '\n');
  await writeFile(cardPath, normalized, 'utf8');
}
