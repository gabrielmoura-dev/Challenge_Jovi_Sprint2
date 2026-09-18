const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const errors = [];
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(path.join(dir, item.name)) : [path.join(dir, item.name)]); }
for (const file of [...walk('assets'), ...walk('telas'), 'index.html']) {
  if (!/\.(js|html|css)$/.test(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  if (file.endsWith('.js')) { try { new vm.Script(source, { filename: file }); } catch (error) { errors.push(error.message); } }
  if (file.endsWith('.html')) {
    for (const [, attrs, script] of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/\bsrc=|application\/ld\+json/.test(attrs)) continue;
      try { new vm.Script(script, { filename: file }); } catch (error) { errors.push(error.message); }
    }
  }
  const refs = file.endsWith('.html') ? Array.from(source.matchAll(/(?:src|href)=["']([^"']+)["']/g), m => m[1]) : file.endsWith('.css') ? Array.from(source.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g), m => m[1]) : [];
  for (const ref of refs) {
    if (/^(?:https?:|data:|#|mailto:|tel:)/.test(ref)) continue;
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    const target = path.resolve(path.dirname(file), decodeURIComponent(clean));
    if (!fs.existsSync(target)) errors.push(`${file}: missing ${ref}`);
  }
}
console.log(JSON.stringify({ errors }, null, 2));
process.exitCode = errors.length ? 1 : 0;
