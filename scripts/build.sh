#!/usr/bin/env bash

rm -rf dist
node ./scripts/updateExports.js
tsc --build tsbuild.json
cp -r package.json dist
cp -r README.md dist
cp -r LICENCE dist