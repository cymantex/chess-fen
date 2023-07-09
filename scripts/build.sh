#!/usr/bin/env bash

rm -rf dist

if node ./scripts/updateExports.js; then
  if tsc --build tsbuild.json; then
    cp -r package.json dist
    cp -r README.md dist
    cp -r LICENCE dist
  fi
fi
