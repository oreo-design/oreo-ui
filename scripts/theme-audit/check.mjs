/** Component token contract, not a visual-consistency oracle. */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const postcss=require(createRequire(require.resolve('vite/package.json')).resolve('postcss'));
let checked=0;const violations=[];
for(const owner of readdirSync('src/components',{withFileTypes:true}).filter(p=>p.isDirectory())){
 for(const file of readdirSync(join('src/components',owner.name)).filter(p=>p.endsWith('.css'))){
  const path=join('src/components',owner.name,file);checked++;
  postcss.parse(readFileSync(path,'utf8')).walkDecls(d=>{
   if(/^(padding|margin)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$|^(row-|column-)?gap$|^border(-[a-z]+)*-radius$/.test(d.prop)&&!/(var\(|calc\(|min\(|max\(|clamp\()/.test(d.value)&&/\d(?:px|rem)/.test(d.value))violations.push(`${path}: ${d.prop}: ${d.value}`);
  });
 }
}
assert.deepEqual(violations,[], 'Fixed component spacing or corners bypass the theme scale');
console.log(`Checked spacing and corner token contracts in ${checked} component stylesheets.`);

// Utility-owned controls must use the same scales. The two 1px exceptions are
// glyph geometry (terminal caret and square Stop icon), not control surfaces.
const glyphCorners = new Set(['src/components/terminal/terminal.tsx', 'src/components/icon/custom-glyphs.tsx']);
function checkUtilities(dir) {
  for (const entry of readdirSync(dir, {withFileTypes:true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { checkUtilities(path); continue; }
    if (!/\.tsx?$/.test(path)) continue;
    const source = readFileSync(path, 'utf8');
    for (const match of source.matchAll(/rounded(?:-[trbl]{1,2})?-\[([\d.]+)(px|rem)\]/g))
      assert.ok(glyphCorners.has(path) && match[1] === '1' && match[2] === 'px', `${path}: fixed utility corner ${match[0]}`);
    assert.ok(!/(?:ring|outline)-(?:status-progress|\[var\(--color-status-progress\)\])/.test(source), `${path}: focus uses status instead of accent`);
  }
}
checkUtilities('src/components');
console.log('Checked component utility corners and interaction focus tokens.');
