// 构建脚本：把 src/ 打包成单个 app.js（IIFE，可直接用 <script> 引入，双击 index.html 也能运行）
import * as esbuild from 'esbuild';

const serve = process.argv.includes('--serve');
const options = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  outfile: 'app.js',
  minify: !serve,
  sourcemap: serve ? 'inline' : false,
  loader: { '.glsl': 'text', '.vert': 'text', '.frag': 'text' },
  legalComments: 'none',
  logLevel: 'info',
};

if (serve) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: '.', port: 8123 });
  console.log(`dev server: http://localhost:${port}/`);
} else {
  await esbuild.build(options);
}
