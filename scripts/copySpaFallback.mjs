#!/usr/bin/env node

import { copyFile } from 'node:fs/promises';
import path from 'node:path';

const distPath = path.resolve(process.cwd(), 'dist');

await copyFile(
  path.join(distPath, 'index.html'),
  path.join(distPath, '404.html'),
);

console.log('Copied dist/index.html to dist/404.html.');
