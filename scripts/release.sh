#!/usr/bin/env bash

node ./scripts/updateVersion.js
cd dist
npm run publish