// news-image-20261125 entry. Node 22, standard library only.
//
// The entry image is entry.png beside this file: one 1024x1024 PNG that
// sums up 25 November 2026 world news. This program copies it unchanged
// to <output>/entry.png for the grader, after checking the format the
// competition asks for: PNG or JPEG, at most 1024x1024, at most 1 MiB.
//
// The image covers six stories first reported on 25 November 2026:
// the Houthi strikes on Saudi Arabia, the Asian market slide, the graft
// probe of Shanghai party chief Chen Jining, the flooded mine in West
// Java, the freed Cartagena hostages, and Pakistan's first astronaut
// aboard Shenzhou-24. All text on the image was rendered from verified
// Reuters reporting; the hero photo is labelled illustrative.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

const bytes = readFileSync(source);
const pngHead = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpegHead = Buffer.from([0xff, 0xd8, 0xff]);
const isPng = bytes.subarray(0, 8).equals(pngHead);
const isJpeg = bytes.subarray(0, 3).equals(jpegHead);
if (!isPng && !isJpeg) throw new Error("entry.png is neither PNG nor JPEG");
if (isPng) {
  const w = bytes.readUInt32BE(16);
  const h = bytes.readUInt32BE(20);
  if (w > 1024 || h > 1024) throw new Error(`entry.png is ${w}x${h}, over 1024x1024`);
  console.log(`entry.png is ${w}x${h} PNG`);
}
if (bytes.length > 1048576) throw new Error(`entry.png is ${bytes.length} bytes, over 1 MiB`);

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, bytes);
const written = statSync(target).size;
if (written !== bytes.length) throw new Error(`wrote ${written} bytes, expected ${bytes.length}`);
console.log(`entry.png (${written} bytes) -> ${target}`);
