// Static checks on the bundle: the manifest points DSH at the patch, the patch
// adds the Stet MCP row keyed to STET_ACCESS_KEY and turns the session-log
// upload to DeepSeek off. The end-to-end test against a real DSH and a local
// Stet lives in the Stet repository (integrations/dsh-plugin-stet/test).
//   node test/patch.mjs
import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));
const patch = fs.readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8');
const out = [];
const check = (name, cond) => out.push([cond ? 'PASS' : 'FAIL', name]);
check('package.json declares the bundle patch', pkg.dsh?.bundle?.patch === './cordis.patch.yml' && pkg.files.includes('cordis.patch.yml'));
check('keywords carry dsh-plugin', pkg.keywords.includes('dsh-plugin'));
check('the Stet row uses DSH\'s MCP client over streamable HTTP', /id: mcp-stet[\s\S]*dsh-mcp-client[\s\S]*transport: streamable-http/.test(patch));
check('the row is off without STET_ACCESS_KEY', /disabled: !!js '!process\.env\.STET_ACCESS_KEY'/.test(patch));
check('the key travels as a bearer header', /Authorization: !!js '`Bearer \$\{process\.env\.STET_ACCESS_KEY\}`'/.test(patch));
check('the session-log upload to DeepSeek is off', /- id: session-log-deepseek\s+config:\s+enabled: false/.test(patch));
for (const r of out) console.log(r.join(' | '));
const f = out.filter((r) => r[0] === 'FAIL').length;
console.log(`\n${out.length - f} passed, ${f} failed`);
process.exit(f ? 1 : 0);
