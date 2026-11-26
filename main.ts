// NusaStat — National Statistics Portal of Indonesia (Node 22, standard
// library only). The site is plain static files under app/ (ES modules,
// CSS, no build step) and its content lives in its own files: nothing it
// runs, styles or shows loads over the network. This program hands it in:
// it copies app/ and screenshots/ from beside this file to /output and
// writes /output/dossier.json with the vendored make.fun library, the
// summary the judge reads (screenshots, first-load files and bytes, and
// the source). Leave vendor/makefun-frontend.ts as it is: the scorer
// requires dossier.json to be byte for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse (more than
// 4 screenshots or one over 256 KiB; more than 993 files and directories
// in app/ or 16 MiB of app files: app/ counts beside /output's own
// 1000-entry cap, its screenshots/ and dossier.json).
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// A hand-in that silently produced nothing is worse than a loud failure:
// confirm the dossier landed and say how big it is, so both grader runs
// (which must write identical bytes) leave the same trace in their logs.
const dossierBytes = statSync(dossierPath).size;
if (dossierBytes < 1000) throw new Error('dossier.json suspiciously small: ' + dossierBytes + ' bytes');
console.log('wrote ' + dossierPath + ' (' + dossierBytes + ' bytes)');
